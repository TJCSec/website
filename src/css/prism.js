export default {
  color: '#ccc',
  backgroundColor: 'lightBackground',
  overflow: 'auto',
  padding: '1rem',
  '.comment, .block-comment, .prolog, .doctype, .cdata': {
    color: '#999',
  },
  '.punctuation': { color: '#ccc' },
  '.tag, .attr-name, .namespace, .deleted': {
    color: '#e2777a',
  },
  '.function-name': { color: '#6196cc' },
  '.boolean, .number, .function': { color: '#f08d49' },
  '.property, .class-name, .constant, .symbol': {
    color: '#f8c555',
  },
  '.selector, .important, .atrule, .keyword, .builtin': {
    color: '#cc99cd',
  },
  '.string, .char, .attr-value, .regex, .variable': {
    color: '#7ec699',
  },
  '.operator, .entity, .url': {
    color: '#67cdcc',
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
