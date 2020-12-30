/** @jsx jsx */
import { jsx } from 'theme-ui'
import { graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'

import Layout from '../components/layout'
import Hero from '../components/hero'
import Container from '../components/container'

const Writeup = ({ data: { mdx: post } }) => {
  const {title, date} = post.frontmatter
  const {excerpt, body} = post

  return (
    <Layout seo={{ title: title, description: excerpt }} >
      <Hero title={title} subtitle={'Published on ' + date}
        sx={{ maxWidth: 'writeup' }}
      />
      <Container
        sx={{
          maxWidth: 'writeup',
          '& a.anchor': {
            fill: theme => theme.colors.text,
          },
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
