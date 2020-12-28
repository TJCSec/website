export default theme => ({
  'code[class*="language-"], pre[class*="language-"]': {
    color: '#ccc',
    background: 'none',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: 1.5,
    tabSize: 4,
    hyphens: 'none',
  },
  'pre[class*="language-"]': {
    padding: '1em',
    margin: '.5em 0',
    overflow: 'auto',
  },
  ':not(pre) > code[class*="language-"], pre[class*="language-"]': {
    background: theme.colors.lightBackground,
  },
  ':not(pre) > code[class*="language-"]': {
    padding: '.1em',
    borderRadius: '.3em',
    whiteSpace: 'normal',
  },
  '.token.comment, .token.block-comment, .token.prolog, .token.doctype, .token.cdata': {
    color: '#999',
  },
  '.token.punctuation': { color: '#ccc' },
  '.token.tag, .token.attr-name, .token.namespace, .token.deleted': {
    color: '#e2777a',
  },
  '.token.function-name': { color: '#6196cc' },
  '.token.boolean, .token.number, .token.function': { color: '#f08d49' },
  '.token.property, .token.class-name, .token.constant, .token.symbol': {
    color: '#f8c555',
  },
  '.token.selector, .token.important, .token.atrule, .token.keyword, .token.builtin': {
    color: '#cc99cd',
  },
  '.token.string, .token.char, .token.attr-value, .token.regex, .token.variable': {
    color: '#7ec699',
  },
  '.token.operator, .token.entity, .token.url': {
    color: '#67cdcc',
  },
  '.token.important, .token.bold': {
    fontWeight: 'bold',
  },
  '.token.italic': {
    fontStyle: 'italic',
  },
  '.token.entity': {
    cursor: 'help',
  },
  '.token.inserted': {
    color: 'green',
  }
})
