/** @jsx jsx */
import { Grid, jsx } from 'theme-ui'
import { graphql } from 'gatsby'

import Layout from '../components/layout'
import Hero from '../components/hero'
import Container from '../components/container'
import WriteupCard from '../components/writeupcard'
import CardGrid from '../components/cardgrid'

const fuseOptions = {
  keys: ['frontmatter.title', 'excerpt'],
}

const Writeups = ({ data }) => {
  const {
    allMarkdownRemark: {
      nodes: writeups,
    },
  } = data
  return (
    <Layout seo={{ title: 'Writeups' }}>
      <Hero title='Writeups'
        subtitle='A collection of some writeups written by TJCSC'
      />
      <Container>
        <Grid
          gap={4}
          sx={{
            justifyItems: 'stretch',
            mb: 4,
          }}
        >
          <CardGrid items={writeups} Card={WriteupCard} fuseOptions={fuseOptions}/>
        </Grid>
      </Container>
    </Layout>
  )
}

export default Writeups

export const query = graphql`
  query Writeups {
    allMarkdownRemark(sort: {fields: frontmatter___date, order: DESC}) {
      nodes {
        frontmatter {
          date(formatString: "YYYY-MM-DD")
          slug
          title
        }
        excerpt(pruneLength: 250)
        timeToRead
      }
    }
  }
`
