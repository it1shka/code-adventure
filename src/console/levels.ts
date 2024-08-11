import { Command } from '@/language/compiler'
import levelsRaw from './levels.txt?raw'
import { all } from '@/lib'

export type Position = Readonly<{
  row: number
  column: number
}>

export const enum Direction {
  up = 'up',
  right = 'right',
  down = 'down',
  left = 'left',
}

const nextPosition = (position: Position, direction: Direction): Position => {
  const { row, column } = position
  switch (direction) {
    case Direction.up: return Object.freeze({
      row: row - 1,
      column
    })
    case Direction.right: return Object.freeze({
      row,
      column: column + 1,
    })
    case Direction.down: return Object.freeze({
      row: row + 1,
      column,
    })
    default: return Object.freeze({
      row,
      column: column - 1,
    })
  }
}

const turnRight = (direction: Direction) => {
  switch (direction) {
    case Direction.up: return Direction.right
    case Direction.right: return Direction.down
    case Direction.down: return Direction.left
    default: return Direction.up
  }
}

const turnLeft = (direction: Direction) => {
  switch (direction) {
    case Direction.up: return Direction.left
    case Direction.right: return Direction.up
    case Direction.down: return Direction.right
    default: return Direction.down
  }
}

const DirectionMapping = Object.freeze({
  '^': Direction.up,
  '>': Direction.right,
  'V': Direction.down,
  '<': Direction.left,
})

export type Robot = Readonly<{
  direction: Direction
  position: Position
}>

export type Box = Readonly<{
  id: number | string
  position: Position
}>

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

type Mutable<T> = {
  -readonly [K in keyof T]: T[K]
}

export const nextLevel = (
  current: LevelSnapshot, 
  action: Command,
): LevelSnapshot => {
  if (action === Command.turnLeft) {
    return Object.freeze({
      ...current,
      robot: {
        ...current.robot,
        direction: turnLeft(current.robot.direction),
      }
    })
  }

  if (action === Command.turnRight) {
    return Object.freeze({
      ...current,
      robot: {
        ...current.robot,
        direction: turnRight(current.robot.direction),
      }
    })
  }

  const direction = current.robot.direction
  const nextRobotPosition = nextPosition(current.robot.position, direction)
  const nextBoxes = JSON.parse(JSON.stringify(current.boxes)) as Array<Mutable<Box>>
  let possibleCollision = nextRobotPosition
  const alreadyMoved = new Set<Box['id']>()
  for (let i = 0; i < nextBoxes.length; i++) {
    const boxToMove = nextBoxes.find(({ id, position }) => {
      return possibleCollision.row === position.row &&
        possibleCollision.column === position.column && 
        !alreadyMoved.has(id)
    })
    if (boxToMove === undefined) break
    boxToMove.position = nextPosition(possibleCollision, direction)
    alreadyMoved.add(boxToMove.id)
    possibleCollision = boxToMove.position
  }

  const moved = [nextRobotPosition, ...nextBoxes.map(({ position }) => position)]
  const collisionsExist = moved.some(({ row, column }) => {
    return current.walls.some(wall => {
      return wall.row === row && wall.column === column
    })
  })

  if (collisionsExist) return current

  const completed = all(nextBoxes, ({ position }) => {
    const { row, column } = position
    return current.checkpoints.some(checkpoint => {
      return row === checkpoint.row &&
        column === checkpoint.column
    })
  })

  return Object.freeze({
    ...current,
    robot: {
      ...current.robot,
      position: nextRobotPosition,
    },
    boxes: nextBoxes,
    completed,
  })
}

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
