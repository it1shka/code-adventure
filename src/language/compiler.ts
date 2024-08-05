import type {SyntaxNode} from '@lezer/common'
import { parser } from './parser.grammar'
import { repeat, repeatArray } from '@/lib'

export const enum Command {
  move = 'move',
  turnRight = 'turn-right',
  turnLeft = 'turn-left',
}

// TODO: create more useful reports
export const checkErrors = (sourceCode: string) => {
  const errors: string[] = []
  let failed = 0
  parser.parse(sourceCode).iterate({enter: node => {
    if (!node.type.isError) return
    failed++
    const fragment = sourceCode.slice(node.from, node.to)
    const error = `Syntax error: ${fragment || `fail #${failed}`}`
    errors.push(error)
  }})
  return errors
}

/** 
 * If compilation fails, throws an error
 * @throws {Error}
 */
export const compile = (sourceCode: string) => {
  const ast = parser
    .configure({ strict: true })
    .parse(sourceCode)
  const instructions = []
  let cursor = ast.cursor()
  if (!cursor.firstChild()) {
    throw new Error('Failed to parse program')
  }
  do {
    const compiledNode = compileNode(sourceCode, cursor.node)
    instructions.push(...compiledNode)
  } while (cursor.nextSibling())
  return instructions
}

const enum NodeType {
  move = 'Move',
  turn = 'Turn',
  repeat = 'Repeat',
}

/**
 * @throws {Error}
 */
const compileNode = (source: string, node: SyntaxNode): Command[] => {
  const nodeType = node.type.name
  switch (nodeType) {
    case NodeType.move: {
      const n = node.getChild('Number')
      if (n === null) {
        throw new Error('In move instruction: expected the number of steps')
      }
      const stepsAmount = Number(source.slice(n.from, n.to))
      if (Number.isNaN(stepsAmount)) {
        throw new Error('In move instruction: steps is not a number')
      }
      return repeat(Command.move, stepsAmount)
    }

    case NodeType.turn: {
      const direction = node.getChild('Direction')
      if (direction === null) {
        throw new Error('In turn instruction: expected direction')
      }
      const span = source.slice(direction.from, direction.to)
      switch (span) {
        case 'left':
          return [Command.turnLeft]
        case 'right':
          return [Command.turnRight]
        default:
          throw new Error('In turn instruction: unknown direction')
      }
    }

    case NodeType.repeat: {
      const n = node.getChild('Number')
      if (n === null) {
        throw new Error('In repeat instruction: expected the number of repetitions')
      }
      const times = Number(source.slice(n.from, n.to))
      if (Number.isNaN(times)) {
        throw new Error('In repeat instruction: repetitions is not a number')
      }
      const statementStart = node.getChild('times')
      if (statementStart === null) {
        throw new Error('In repeat instruction: expected "times" keyword')
      }
      let cursor = statementStart.cursor()
      const commands = []
      while (cursor.nextSibling()) {
        if (cursor.node.type.name === 'end') break
        commands.push(...compileNode(source, cursor.node))
      }
      return repeatArray(commands, times)
    }

    default:
      throw new Error(`Unknown node type: ${nodeType}`)
  }
}
