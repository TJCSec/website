/** @jsx jsx */
import { Box, Button, Flex, Grid, jsx } from 'theme-ui'
import { graphql } from 'gatsby'
import Fuse from 'fuse.js';

import Layout from '../components/layout'
import Hero from '../components/hero'
import Container from '../components/container'
import SearchBar from '../components/searchbar'
import LectureCard from '../components/lecturecard'
import { useRef, useState } from 'react'
import debounce from '../utils/debounce'
import CardGrid from '../components/cardgrid';

const Presentations = ({ data }) => {
  const {
    allLecturesYaml: {
      nodes: lectures,
    },
    allLectureFoldersYaml: {
      nodes: lectureFolders,
    },
  } = data

  const currentFolder = lectureFolders[0]

  const [pattern, setPattern] = useState('')
  const [displayedLectures, setDisplayedLectures] = useState(lectures)

  const fuseOptions = {
    keys: [{name: 'title', weight: 2}, 'body'],
    threshold: 0.4,
  }
  const fuse = useRef(new Fuse(lectures, fuseOptions)).current

  const search = useRef(debounce((value) => {
    const res = (value === '')
      ? lectures
      : fuse.search(value).map(val => val.item)
      // potential performance gain from using refIndex instead
      // and just showing/hiding cards
    setDisplayedLectures(res)
  }, 100)).current

  const onSearchAction = useRef((e) => {
    setPattern(e.target.value)
    search(e.target.value)
  }).current

  return (
    <Layout>
      <Hero title='Presentations' />
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
              href={currentFolder.link}
              target='_blank'
              rel='noopener noreferrer'
            >
                Presentations ({currentFolder.label})
            </Button>
            <Box sx={{ position: 'relative' }}>
              <Button
                sx={{
                  width: '100%',
                  '&:focus + *, & + :focus-within': {
                    visibility: 'visible',
                    opacity: 1,
                  },
                }}
              >
                Old Presentations
              </Button>
              <Box
                sx={{
                  visibility: 'hidden',
                  opacity: 0,
                  position: 'absolute',
                  top: 'calc(100% + 0.5rem)',
                  width: '100%',
                  bg: 'primary',
                  borderRadius: 4,
                  py: 2,
                  zIndex: 999,
                  transition: '0.2s linear',
                }}
              >
                {lectureFolders.slice(1).map((folder, i) => (
                  <Box
                    key={i}
                    as='a'
                    sx={{
                      display: 'block',
                      textDecoration: 'none',
                      color: 'background',
                      px: 3,
                      py: 2,
                      '&:hover, &:focus': {
                        bg: 'secondary',
                      }
                    }}
                    href={folder.link}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {folder.label}
                  </Box>
                ))}
              </Box>
            </Box>
          </Flex>
          <SearchBar onChange={onSearchAction} value={pattern} />
          <CardGrid>
            {displayedLectures.map((lecture) => (
              <LectureCard
                key={lecture.title} // still rerenders on hide->show
                title={lecture.title}
                body={lecture.body}
                level={lecture.level}
                link={lecture.link}
                date={lecture.date}
              />
            ))}
          </CardGrid>
        </Grid>
      </Container>
    </Layout>
  )
}

export default Presentations

export const query = graphql`
  query Lectures {
    allLecturesYaml {
      nodes {
        title
        level
        date
        body
        link
      }
    }
    allLectureFoldersYaml {
      nodes {
        link
        label
      }
    }
  }
`
