/** @jsx jsx */
import { jsx } from 'theme-ui'
import { graphql } from 'gatsby'
import { Global } from '@emotion/core'

import unified from 'unified'
import rehypeReact from '../utils/renderer'
import rehypeSlug from 'rehype-slug'

import Layout from '../components/layout'
import Hero from '../components/hero'
import Container from '../components/container'

const processor = unified()
  .use(rehypeSlug)
  .use(rehypeReact)

const Writeup = ({ data }) => {
  const { markdownRemark: post } = data
  return (
    <Layout seo={{ title: post.frontmatter.title, description: post.excerpt, titleTemplate: '%s | TJCSC' }}>
      <Global
        styles={theme => ({
          'a.anchor': {
            fill: theme.colors.text,
          },
          'span.gatsby-resp-image-wrapper': {
            margin: '0 !important',
          },
        })}
      />
      <Hero title={post.frontmatter.title} subtitle={'Published on ' + post.frontmatter.date} />
      <Container>
        {processor.stringify(processor.runSync(post.htmlAst))}
      </Container>
    </Layout>
  )
}

export default Writeup

export const query = graphql`
  query Writeup ($path: String!) {
    markdownRemark(frontmatter: { slug: { eq: $path } }) {
      htmlAst
      excerpt(pruneLength: 250)
      frontmatter {
        date(formatString: "YYYY-MM-DD")
        slug
        title
      }
    }
  }
`
