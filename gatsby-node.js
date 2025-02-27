const readingTime = require('reading-time')
const path = require('path')

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions
  const writeupTemplate = path.resolve('src/templates/writeup.js')

  const writeups = await graphql(`
    query Writeups {
      allMdx(sort: {frontmatter: {date: DESC}}) {
        nodes {
          frontmatter {
            slug
          }
          internal {
            contentFilePath
          }
        }
      }
    }
  `)

  if (writeups.errors) {
    reporter.panicOnBuild('Error querying for writeups')
    return
  }

  writeups.data.allMdx.nodes.forEach(({ frontmatter, internal }) => {
    createPage({
      path: frontmatter.slug,
      component: `${writeupTemplate}?__contentFilePath=${internal.contentFilePath}`,
    })
  })
}

exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `Mdx`) {
    createNodeField({
      node,
      name: `timeToRead`,
      value: readingTime(node.body)
    })
  }
}