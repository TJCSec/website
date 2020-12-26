/** @jsx jsx */
import {  Button, Flex, Grid, jsx } from 'theme-ui'
import { graphql } from 'gatsby'

import Layout from '../components/layout'
import Hero from '../components/hero'
import Container from '../components/container'
import CTFCard from '../components/ctfcard';
import CardGrid from '../components/cardgrid';

const CTFs = ({ data }) => {
  const {
    allCtfsYaml: {
      nodes: ctfs,
    }
  } = data

  const fuseOptions = {
    keys: ['name'],
    threshold: 0.4,
  }

  return (
    <Layout>
      <Hero title='CTFs' />
      <Container>
        <Grid
          gap={4}
          sx={{
            justifyItems: 'stretch',
            marginBottom: 4
          }}
        >
          <Flex
            sx={{
              flexDirection: ['column', null, 'row'],
            }}
          >
            <Button
              sx={{
                mr: [0, null, 3],
                mb: [3, null, 0],
              }}
              as='a'
              href="https://ctf.tjcsec.club/" // Should probably extract to access via graphql?
              target='_blank'
              rel='noopener noreferrer'
            >
                Practice
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
