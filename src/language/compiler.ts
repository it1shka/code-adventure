import { parser } from './parser.grammar'

export const enum Command {
  move = 'move',
  turnRight = 'turn-right',
  turnLeft = 'turn-left',
}

export const compile = (sourceCode: string) => {
  const ast = parser.parse(sourceCode)
}
