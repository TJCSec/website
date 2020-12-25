/** @jsx jsx */
import {  Button, Flex, Grid, jsx } from 'theme-ui'
import { graphql } from 'gatsby'
import Fuse from 'fuse.js';

import Layout from '../components/layout'
import Hero from '../components/hero'
import Container from '../components/container'
import SearchBar from '../components/searchbar'
import { useCallback, useState } from 'react'
import CTFCard from '../components/ctfcard';

const debounce = (func, wait) => {
  let timeout

  return (...args) => {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

const CardGrid = ({ ctfs }) => {
  return (
    <Grid
      sx={{
        gridTemplateColumns: [
          'repeat(auto-fill, minmax(200px, 1fr))',  // better way to do this?
          null,
          'repeat(auto-fill, minmax(300px, 1fr))',
        ],
      }}
    >
      {ctfs.map((ctf, i) => (
        <CTFCard
          key={i}
          name={ctf.name}
          link={ctf.link}
          startDate={ctf.startDate}
          endDate={ctf.endDate}
        />
      ))}

    </Grid>
  )
}

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
  const fuse = new Fuse(ctfs, fuseOptions)

  const search = useCallback(debounce((value) => {
    const res = (value === '')
      ? ctfs
      : fuse.search(value).map(val => val.item)
    setDisplayedCTFs(res)
  }, 100), [])

  const onSearchAction = (e) => {
    setPattern(e.target.value)
    search(e.target.value)
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
          <SearchBar onChange={onSearchAction} value={pattern} />
          <CardGrid ctfs={displayedCTFs} />
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
      }
    }
  }
`
