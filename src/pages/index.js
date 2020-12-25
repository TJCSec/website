/** @jsx jsx */
import { Box, Button, Flex, Grid, Heading, Text, jsx } from 'theme-ui'
import { graphql } from 'gatsby'
import Img from 'gatsby-image'
import scrollTo from 'gatsby-plugin-smoothscroll'

import Layout from '../components/layout'
import Container from '../components/container'

import CircuitBoard from '../images/circuit-board.svg'

const aboutBlocks = [
  {
    title: 'What',
    text: 'we teach how to do many hacc!!!! Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vel laoreet neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque id aliquam lectus. Nulla facilisi. Nulla vehicula sapien ante, a semper nisi posuere non. Nunc facilisis vehicula arcu, ut placerat erat convallis eget. Praesent eu lacus ut nisi sollicitudin bibendum sit amet vel quam. Nullam id pharetra lacus, ac blandit dui. Nullam nisi nulla, congue id nibh sit amet, viverra auctor odio. Ut fringilla finibus nisi, quis mattis mi pellentesque sed. Nullam maximus sodales est, nec rhoncus nisi. Vestibulum varius viverra nisi in suscipit. Integer ut risus eleifend, porttitor lorem at, sollicitudin nulla.',
  },
  {
    title: 'Why',
    text: 'hacker bad tjcsc good!!!! Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vel laoreet neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque id aliquam lectus. Nulla facilisi. Nulla vehicula sapien ante, a semper nisi posuere non. Nunc facilisis vehicula arcu, ut placerat erat convallis eget. Praesent eu lacus ut nisi sollicitudin bibendum sit amet vel quam. Nullam id pharetra lacus, ac blandit dui. Nullam nisi nulla, congue id nibh sit amet, viverra auctor odio. Ut fringilla finibus nisi, quis mattis mi pellentesque sed. Nullam maximus sodales est, nec rhoncus nisi. Vestibulum varius viverra nisi in suscipit. Integer ut risus eleifend, porttitor lorem at, sollicitudin nulla.',
  },
  {
    title: 'How',
    text: 'ez lecture even monke could understand!!!! Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vel laoreet neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque id aliquam lectus. Nulla facilisi. Nulla vehicula sapien ante, a semper nisi posuere non. Nunc facilisis vehicula arcu, ut placerat erat convallis eget. Praesent eu lacus ut nisi sollicitudin bibendum sit amet vel quam. Nullam id pharetra lacus, ac blandit dui. Nullam nisi nulla, congue id nibh sit amet, viverra auctor odio. Ut fringilla finibus nisi, quis mattis mi pellentesque sed. Nullam maximus sodales est, nec rhoncus nisi. Vestibulum varius viverra nisi in suscipit. Integer ut risus eleifend, porttitor lorem at, sollicitudin nulla.',
  },
]

const Index = ({ data }) => {
  const {
    site: {
      siteMetadata: {
        description,
      },
    },
    hero: {
      childImageSharp: {
        fluid: hero,
      },
    },
    club: {
      childImageSharp: {
        fluid: club,
      },
    },
  } = data
  return (
    <Layout>
      <Flex
        sx={{
          flexDirection: 'row',
          alignItems: 'stretch',
          justifyContent: 'center',
          minHeight: '100vh',
          '& > *': {
            flex: '1',
            pt: theme => theme.sizes.navbar,
            pb: '0.5rem',
            px: ['2rem', '3rem', '4rem'],
          },
        }}
      >
        <Flex
          sx={{
            bg: ['altBackground', null, 'background'],
            backgroundImage: [`url(${CircuitBoard})`, null, 'none'],
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}
        >
          <Grid
            gap={[2, 3, 4]}
            sx={{
              justifyItems: 'start',
            }}
          >
            <Heading
              as='h1'
              sx={{
                fontSize: [5, 6, 7],
              }}
            >
              TJHSST Computer Security Club
            </Heading>
            <Heading
              as='h2'
              sx={{
                color: 'primary',
                fontSize: [2, 3, 4],
              }}
            >
              {description}
            </Heading>
            <Button onClick={() => scrollTo('#about')}>Learn More</Button>
          </Grid>
        </Flex>
        <Flex
          sx={{
            display: ['none', null, 'flex'],
            flex: '1',
            bg: 'altBackground',
            backgroundImage: `url(${CircuitBoard})`,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'stretch',
          }}
        >
          <Img fluid={hero} alt='TJCSC at Lockheed Martin CYBERQUEST 2019'
            sx={{
              borderRadius: 4,
              mb: 1,
            }}
          />
          TJCSC at Lockheed Martin CYBERQUEST 2019
        </Flex>
      </Flex>
      <Flex id='about'
        sx={{
          bg: 'altBackground',
          '& > *': {
            flex: '1 1 0',
          },
        }}
      >
        <Flex
          sx={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Heading
            as='h1'
            sx={{
              m: [4, 5, 6],
              fontSize: [5, 6, 7],
            }}
          >
            The Club
          </Heading>
        </Flex>
        <Img fluid={{ ...club, aspectRatio: 1.778 }} alt='TJ Computer Security Club Meeting, October 2016'
          sx={{
            display: ['none', null, 'block'],
            mb: 1,
          }}
        />
      </Flex>
      <Flex
        sx={{
          bg: 'lightBackground',
          flexDirection: ['column', null, 'row'],
          '& > *': {
            flex: '1 1 0',
            justifyContent: 'space-between',
            p: [4, 5, 6],
          },
        }}
      >
        {aboutBlocks.map(({ title, text }, i) => (
          <Box>
            <Heading as='h2' mb={2}>{title}</Heading>
            <Text>{text}</Text>
          </Box>
        ))}
      </Flex>
      <Container mt={4}>
        <Heading as='h1'>Officers</Heading>
      </Container>
    </Layout>
  )
}

export default Index

export const query = graphql`
  query Home {
    site {
      siteMetadata {
        description
      }
    }
    hero: file(relativePath: {eq: "cyberquest.png"}) {
      childImageSharp {
        fluid {
          ...GatsbyImageSharpFluid
        }
      }
    }
    club: file(relativePath: {eq: "evan.png"}) {
      childImageSharp {
        fluid {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`
