/** @jsx jsx */
import {  Button, Flex, Grid, jsx } from 'theme-ui'
import { graphql } from 'gatsby'

import Layout from '../components/layout'
import Hero from '../components/hero'
import Container from '../components/container'
import CTFCard from '../components/ctfcard';
import CardGrid from '../components/cardgrid';

const fuseOptions = {
  keys: ['name'],
  threshold: 0.4,
}

const CTFs = ({ data }) => {
  const {
    allCtfsYaml: {
      nodes: ctfs,
    }
  } = data

  return (
    <Layout>
      <Hero
        title='CTFs'
        subtitle='Capture the Flag (CTF) competitions are fun, online computer security contests that include problems ranging widely in category and difficulty.'
      />
      <Container>
        <Grid
          gap={4}
          sx={{
            justifyItems: 'stretch',
            mb: 4,
          }}
        >
          <Flex
            sx={{
              flexDirection: ['column', null, 'row'],
            }}
          >
            <Button
              as='a'
              href='https://ctf.tjcsec.club/' // Should probably extract to access via graphql?
              target='_blank'
              rel='noopener noreferrer'
            >
              TJCSC Practice CTF
            </Button>
          </Flex>
          <CardGrid items={ctfs} Card={CTFCard} fuseOptions={fuseOptions}/>
        </Grid>
      </Container>
    </Layout>
  )
}

export default CTFs

export const query = graphql`
  query CTFs {
    allCtfsYaml {
      nodes {
        name
        startDate
        link
        endDate
        tjParticipants {
          team
          rank
          score
        }
      }
    }
  }
`
