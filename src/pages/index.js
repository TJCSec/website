/** @jsx jsx */
import { Heading, jsx } from 'theme-ui'
import { useStaticQuery, graphql } from 'gatsby'

import Layout from '../components/layout'
import Hero from '../components/hero'

const Index = () => {
  const {
    site: {
      siteMetadata: {
        description,
      },
    },
  } = useStaticQuery(query)
  return (
    <Layout>
      <Hero>
        <Heading as='h1' mb='2rem'>TJHSST Computer Security Club</Heading>
        <Heading as='h2' sx={{ color: 'primary' }}>{description}</Heading>
      </Hero>
    </Layout>
  )
}

export default Index

const query = graphql`
  {
    site {
      siteMetadata {
        description
      }
    }
  }
`
