/** @jsx jsx */
import { jsx } from 'theme-ui'
import { graphql } from 'gatsby'
import { Global } from '@emotion/core'
import { MDXRenderer } from 'gatsby-plugin-mdx'

import Layout from '../components/layout'
import Hero from '../components/hero'
import Container from '../components/container'

const Writeup = ({ data: { mdx: post } }) => {
  const {title, date} = post.frontmatter
  const {excerpt, body} = post

  return (
    <Layout seo={{ title: title, description: excerpt, titleTemplate: '%s | TJCSC' }}>
      <Global
        styles={theme => ({
          'a.anchor': {
            fill: theme.colors.text,
          },
          img: {
            maxWidth: '100%',
            width: 'auto'
          }
        })}
      />
      <Hero title={title} subtitle={'Published on ' + date}
        sx={{ maxWidth: 'writeup' }}
      />
      <Container
        sx={{
          maxWidth: 'writeup',
        }}
      >
        <MDXRenderer>{body}</MDXRenderer>
      </Container>
    </Layout>
  )
}

export default Writeup

export const query = graphql`
  query Writeup ($path: String!) {
    mdx(frontmatter: { slug: { eq: $path } }) {
      frontmatter {
        date(formatString: "YYYY-MM-DD")
        slug
        title
        excerpt
      }
      body
    }
  }
`
