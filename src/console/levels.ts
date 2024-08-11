import levelsRaw from './levels.txt?raw'

export type Position = {
  row: number
  column: number
}

const enum Direction {
  up = 'up',
  right = 'right',
  down = 'down',
  left = 'left',
}

const DirectionMapping = Object.freeze({
  '^': Direction.up,
  '>': Direction.right,
  'V': Direction.down,
  '<': Direction.left,
})

type Robot = {
  direction: Direction
  position: Position
}

type Box = {
  id: number | string
  position: Position
}

export type LevelSnapshot = Readonly<{
  name: string
  rows: number
  columns: number
  robot: Robot
  walls: readonly Position[]
  boxes: readonly Box[]
  checkpoints: readonly Position[]
  completed: boolean
}>

/** In case of invalid level, throws an error
 * @throws {Error}
 */
const level = (raw: string): LevelSnapshot => {
  const lines = raw
    .split('\n')
    .map(e => e.trim())
    .filter(Boolean)
  if (lines.length < 2) {
    throw new Error('Level is empty')
  }
  const name = lines.shift()!
  const rows = lines.length
  const columns = lines[0].length
  if (columns <= 0) {
    throw new Error('Level should have at least 1 column')
  }

  let robot: Robot | null = null
  const walls: Position[] = []
  const boxes: Box[] = []
  const checkpoints: Position[] = []

  let boxID = 1

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const character = lines[row][column]
      const position = { row, column }
      switch (character) {
        case '*':
          walls.push(position)
          break
        case '^': case '>': case 'V': case '<':
          if (robot !== null) {
            throw new Error('Level should have only 1 start')
          }
          robot = { 
            position, 
            direction: DirectionMapping[character] 
          }
          break
        case 'O':
          boxes.push({
            position,
            id: `Box ${boxID++}`
          })
          break
        case 'X':
          checkpoints.push(position)
          break
      }
    }
  }

  if (robot === null) {
    throw new Error('Level should have at least 1 start')
  }
  if (boxes.length <= 0) {
    throw new Error('Level should have at least 1 box')
  }
  if (boxes.length != checkpoints.length) {
    throw new Error('Level should have a checkpoint per box')
  }

  return Object.freeze({
    name,
    rows,
    columns,
    robot,
    walls,
    boxes,
    checkpoints,
    completed: false,
  })
}

const Levels = levelsRaw
  .split('%%')
  .map(e => e.trim())
  .filter(Boolean)
  .map(level)

export default Levels
