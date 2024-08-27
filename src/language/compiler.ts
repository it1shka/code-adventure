import type {SyntaxNode} from '@lezer/common'
import { parser } from './parser.grammar'
import { repeat, repeatArray } from '@/lib'

export const enum Command {
  move = 'move',
  turnRight = 'turn-right',
  turnLeft = 'turn-left',
}

const enum NodeType {
  move = 'Move',
  turn = 'Turn',
  repeat = 'Repeat',
  defineProcedure = 'DefineProcedure',
  callProcedure = 'CallProcedure',
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

export class Compiler {
  private procedures: {[name: string]: Command[]} = {}

  constructor (
    private readonly sourceCode: string,
  ) {}

  /** 
   * If compilation fails, throws an error
   * @throws {Error}
   */
  compile = () => {
    const ast = parser
      .configure({ strict: true })
      .parse(this.sourceCode)
    const instructions = []
    let cursor = ast.cursor()
    if (!cursor.firstChild()) {
      return []
    }
    do {
      const compiledNode = this.compileNode(cursor.node)
      instructions.push(...compiledNode)
    } while (cursor.nextSibling())
    return instructions
  }

  private compileNode = (node: SyntaxNode): Command[] => {
    const nodeType = node.type.name
    switch (nodeType) {
      case NodeType.move: 
        return this.compileMove(node)
      case NodeType.turn: 
        return this.compileTurn(node)
      case NodeType.repeat: 
        return this.compileRepeat(node)
      case NodeType.defineProcedure:
        return this.compileDefineProcedure(node)
      default:
        throw new Error(`Unsupported node type: ${nodeType}`)
    }
  }

  private compileDefineProcedure = (node: SyntaxNode) => {
    return []
  }

  private compileMove = (node: SyntaxNode) => {
    const n = node.getChild('Number')
    if (n === null) {
      throw new Error('In move instruction: expected the number of steps')
    }
    const stepsAmount = Number(this.sourceCode.slice(n.from, n.to))
    if (Number.isNaN(stepsAmount)) {
      throw new Error('In move instruction: steps is not a number')
    }
    return repeat(Command.move, stepsAmount)
  }

  private compileTurn = (node: SyntaxNode) => {
    const direction = node.getChild('Direction')
    if (direction === null) {
      throw new Error('In turn instruction: expected direction')
    }
    const span = this.sourceCode.slice(direction.from, direction.to)
    switch (span) {
      case 'left':
        return [Command.turnLeft]
      case 'right':
        return [Command.turnRight]
      default:
        throw new Error('In turn instruction: unknown direction')
    }
  }

  private compileRepeat = (node: SyntaxNode) => {
    const n = node.getChild('Number')
    if (n === null) {
      throw new Error('In repeat instruction: expected the number of repetitions')
    }
    const times = Number(this.sourceCode.slice(n.from, n.to))
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
      commands.push(...this.compileNode(cursor.node))
    }
    return repeatArray(commands, times)
  }
}
