import type {SyntaxNode} from '@lezer/common'
import { parser } from './parser.grammar'

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
    const compiledNode = compileNode(cursor.node)
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
 * If encounters unknown node type, throws an error
 * @throws {Error}
 */
const compileNode = (node: SyntaxNode): Command[] => {
  const nodeType = node.type.name
  switch (nodeType) {
    case NodeType.move:

    case NodeType.turn:

    case NodeType.repeat:

    default:
      throw new Error(`Unknown node type: ${nodeType}`)
  }
}
