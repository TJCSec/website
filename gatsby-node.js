const path = require('path')

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions
  const writeupTemplate = path.resolve('src/templates/writeup.js')

  const writeups = await graphql(`
    query Writeups {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
      ) {
        nodes {
          frontmatter {
            slug
          }
        }
      }
    }
  `)

  if (writeups.errors) {
    reporter.panicOnBuild('Error querying for writeups')
    return
  }

  writeups.data.allMarkdownRemark.nodes.forEach(({ frontmatter }) => {
    createPage({
      path: frontmatter.slug,
      component: writeupTemplate,
    })
  })
}
