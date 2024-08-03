import { styleTags, tags } from '@lezer/highlight'
import { parser } from './parser.grammar'
import { LRLanguage, LanguageSupport, foldInside, foldNodeProp, indentNodeProp } from '@codemirror/language'
import { completeFromList } from '@codemirror/autocomplete'

const Keywords = Object.freeze([
  'move', 'steps',
  'turn', 'left', 'right',
  'repeat', 'times', 'end'
])

const InstructionsLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [
      styleTags({
        Number: tags.number,
        Direction: tags.atom,
        Comment: tags.comment,
        [Keywords.join(' ')]: tags.keyword,
      }),
      indentNodeProp.add({
        Repeat: context => {
          return context.column(context.node.from) + context.unit
        },
      }),
      foldNodeProp.add({
        Repeat: foldInside,
      }),
    ],
  }),
  languageData: {
    commentTokens: { line: '#' },
  }
})

const codeCompletion = InstructionsLanguage.data.of({
  autocomplete: completeFromList(Keywords.map(keyword => {
    return Object.freeze({ label: keyword, type: 'keyword' })
  }))
})

const InstructionsLanguageSupport = () => {
  return new LanguageSupport(
    InstructionsLanguage,
    [codeCompletion],
  )
}

export default InstructionsLanguageSupport
