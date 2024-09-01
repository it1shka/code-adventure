import { styleTags, tags } from '@lezer/highlight'
import { parser } from './parser.grammar'
import { LRLanguage, LanguageSupport, foldInside, foldNodeProp, indentNodeProp, syntaxTree } from '@codemirror/language'
import { completeFromList, snippetCompletion } from '@codemirror/autocomplete'
import { linter, type Diagnostic } from '@codemirror/lint'

const Keywords = Object.freeze([
  'move', 'steps',
  'turn', 'left', 'right',
  'repeat', 'times', 'end',
  'define', 'as', 'execute',
  'backtracking',
])

const Snippets = Object.freeze({
  move: 'move ${n} steps',
  turn: 'turn ${direction}',
  repeat: 'repeat ${n} times\n\t${instructions}\nend',
  define: 'define ${procedure} as\n\t${instructions}\nend',
  execute: 'execute ${procedure}',
  backtracking: 'backtracking\n\t${instructions}\nend'
})

const BlockStatements = Object.freeze([
  'Repeat',
  'DefineProcedure',
  'Backtracking',
]).join(' ')

const InstructionsLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [
      styleTags({
        Number: tags.number,
        Direction: tags.atom,
        Comment: tags.comment,
        ProcedureName: tags.typeName,
        [Keywords.join(' ')]: tags.keyword,
      }),
      indentNodeProp.add({
        [BlockStatements]: context => {
          return context.column(context.node.from) + context.unit
        },
      }),
      foldNodeProp.add({
        [BlockStatements]: foldInside,
      }),
    ],
  }),
  languageData: {
    commentTokens: { line: '#' },
  }
})

const simpleLinter = () => {
  return linter(view => {
    const errors: Diagnostic[] = []
    syntaxTree(view.state).iterate({ enter: node => {
      if (!node.type.isError) return
      const line = view.state.doc.lineAt(node.to)
      const error = Object.freeze({
        from: node.from,
        to: node.to,
        severity: 'error',
        message: `Syntax error on line ${line.number}`,
      })
      errors.push(error)
    }})
    return errors
  })
}

const codeCompletion = InstructionsLanguage.data.of({
  autocomplete: completeFromList(Keywords.map(keyword => {
    return Object.freeze({ label: keyword, type: 'keyword' })
  }))
})

const snippets = InstructionsLanguage.data.of({
  autocomplete: Object.entries(Snippets).map(([name, snippet]) => {
    return snippetCompletion(snippet, { label: name })
  })
})

const InstructionsLanguageSupport = () => {
  return new LanguageSupport(
    InstructionsLanguage,
    [codeCompletion, snippets, simpleLinter()],
  )
}

export default InstructionsLanguageSupport
