export default {
  color: '#e8e8e8',
  bg: 'lightBackground',
  overflow: 'auto',
  p: '1rem',
  '.comment, .block-comment, .prolog, .doctype, .cdata': {
    color: '#999',
  },
  '.punctuation': { color: '#999' },
  '.tag, .attr-name, .namespace, .deleted': {
    color: '#e2777a',
  },
  '.function-name, .function': { color: 'accent' },
  '.boolean, .number': { color: '#EF9CDA' },
  '.property, .class-name, .constant, .symbol': {
    color: '#A1E8CC',
  },
  '.selector, .important, .atrule, .keyword, .builtin': {
    color: 'primary',
  },
  '.string, .char, .attr-value, .regex, .variable': {
    color: '#FFDB78',
  },
  '.operator, .entity, .url': {
    color: '#8489AE',
  },
  '.important, .bold': {
    fontWeight: 'bold',
  },
  '.italic': {
    fontStyle: 'italic',
  },
  '.entity': {
    cursor: 'help',
  },
  '.inserted': {
    color: 'green',
  }
}
