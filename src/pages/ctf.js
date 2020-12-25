/** @jsx jsx */
import {  Button, Flex, Grid, jsx } from 'theme-ui'
import { graphql } from 'gatsby'
import Fuse from 'fuse.js';

import Layout from '../components/layout'
import Hero from '../components/hero'
import Container from '../components/container'
import SearchBar from '../components/searchbar'
import { useRef, useState } from 'react'
import CTFCard from '../components/ctfcard';
import debounce from '../utils/debounce';
import CardGrid from '../components/cardgrid';

const CTFs = ({ data }) => {
  const {
    allCtfsYaml: {
      nodes: ctfs,
    }
  } = data

  const [pattern, setPattern] = useState('')
  const [displayedCTFs, setDisplayedCTFs] = useState(ctfs)

  const fuseOptions = {
    keys: ['name'],
    threshold: 0.4,
  }
  const fuse = useRef(new Fuse(ctfs, fuseOptions)).current

  const search = useRef(debounce((value) => {
    const res = (value === '')
      ? ctfs
      : fuse.search(value).map(val => val.item)
      // potential performance gain from using refIndex instead
      // and just showing/hiding cards
    setDisplayedCTFs(res)
  }, 100)).current

  const onSearchAction = useRef((e) => {
    setPattern(e.target.value)
    search(e.target.value)
  }).current

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
          <SearchBar onChange={onSearchAction} value={pattern} />
          <CardGrid>
            {displayedCTFs.map((ctf, i) => (
              <CTFCard
                key={i}
                name={ctf.name}
                link={ctf.link}
                startDate={ctf.startDate}
                endDate={ctf.endDate}
                participants={ctf.tjParticipants}
              />
            ))}
          </CardGrid>
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
