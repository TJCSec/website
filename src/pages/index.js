/** @jsx jsx */
import { Box, Button, Flex, Grid, Heading, Text, jsx } from 'theme-ui'
import { graphql } from 'gatsby'
import { GatsbyImage } from "gatsby-plugin-image";
import { useCallback } from 'react'
import { scroller } from 'react-scroll'

import Layout from '../components/layout'
import Container from '../components/container'
import OfficerCard from '../components/officercard'

import CircuitBoard from '../images/circuit-board.svg'

const Index = ({ data }) => {
  const {
    site: {
      siteMetadata: { description },
    },
    hero: {
      childImageSharp: { gatsbyImageData: hero },
    },
    club: {
      childImageSharp: { gatsbyImageData: club },
    },
    allAboutYaml: { edges: about },
    allOfficersYaml: { edges: officers },
  } = data

  const scrollAbout = useCallback(() => {
    scroller.scrollTo('about', {
      duration: 400,
      smooth: 'easeInOut',
    })
  }, [])

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
            pt: (theme) => theme.sizes.navbar,
            pb: '0.5rem',
            '& > *': {
              maxWidth: (theme) => `calc(${theme.sizes.container}px / 2)`,
              px: ['2rem', '3rem', '4rem'],
            },
          },
        }}
      >
        <Flex
          sx={{
            bg: ['altBackground', null, 'background'],
            backgroundImage: [`url(${CircuitBoard})`, null, 'none'],
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-end',
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
            <Button onClick={scrollAbout}>Learn More</Button>
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
          <Box>
            <GatsbyImage
              image={hero}
              alt='TJCSC at Lockheed Martin CYBERQUEST 2019'
              sx={{
                borderRadius: 4,
                mb: 1,
              }} />
            TJCSC at Lockheed Martin CYBERQUEST 2019
          </Box>
        </Flex>
      </Flex>
      <Flex
        id='about'
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
        <GatsbyImage
          image={{ ...club, aspectRatio: 1.778 }}
          alt='TJ Computer Security Club Meeting, October 2016'
          sx={{
            display: ['none', null, 'block'],
          }} />
      </Flex>
      <Box
        sx={{
          bg: 'lightBackground',
          p: [4, null, 5],
        }}
      >
        <Container>
          <Grid columns={[1, null, 3]} gap={5}>
            {about.map(({ node: { title, text } }, i) => (
              <Box key={i}>
                <Heading as='h2' mb={2}>
                  {title}
                </Heading>
                <Text>{text}</Text>
              </Box>
            ))}
          </Grid>
        </Container>
      </Box>
      <div mt={4} sx={{ paddingTop: 32 }}>
        <Heading as='h1' mb={4} px={'4rem'}>
          Officers
        </Heading>
        <Container sx={{
          width: '100%',
          overflow: 'auto',
          paddingTop: 0,
          paddingBottom: 32
        }}>
          <div
            sx={{
              height: 'min-content',
              width: 'max-content',
              display: 'flex',
              flex: '1 1 0',
              gap: '1em'
            }}
          >
            {officers.map(({ node }, i) => (
              <OfficerCard key={i} data={node} />
            ))}
          </div>
        </Container>
      </div>
    </Layout>
  );
}

export default Index

export const query = graphql`query Home {
  site {
    siteMetadata {
      description
    }
  }
  hero: file(relativePath: {eq: "cyberquest.png"}) {
    childImageSharp {
      gatsbyImageData(layout: FULL_WIDTH)
    }
  }
  club: file(relativePath: {eq: "evan.png"}) {
    childImageSharp {
      gatsbyImageData(layout: FULL_WIDTH)
    }
  }
  allAboutYaml {
    edges {
      node {
        title
        text
      }
    }
  }
  allOfficersYaml {
    edges {
      node {
        ...OfficerInfo
      }
    }
  }
}`
