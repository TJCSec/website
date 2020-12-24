/** @jsx jsx */
import { Button, Flex, Grid, jsx } from 'theme-ui'
import { useStaticQuery, graphql } from 'gatsby'

import Layout from '../components/layout'
import Hero from '../components/hero'
import Container from '../components/container'
import SearchBar from '../components/searchbar'
import LectureCard from '../components/lecturecard'

const CardGrid = ({ lectures }) => {
  return (
    <Grid
      sx={{
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      }}
    >
      {lectures.map(({ node: lecture }, i) => (
        <LectureCard
          key={i}
          title={lecture.title}
          body={lecture.body}
          level={lecture.level}
          link={lecture.link}
          date={lecture.date}
        />
      ))}

    </Grid>
  )
}

const Presentations = () => {
  const {
    allLecturesYaml: {
      edges: lectures,
    },
    allLectureFoldersYaml: {
      edges: lectureFolders,
    },
  } = useStaticQuery(query)
  const { node: currentFolder } = lectureFolders[0]
  // TODO: dropdown for old presentations
  return (
    <Layout>
      <Hero title='Presentations' />
      <Container>
        <Grid
          gap={4}
          sx={{
            justifyItems: 'stretch',
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
            <Button
              as='a'
              href={currentFolder.link}
              target='_blank'
              rel='noopener noreferrer'
            >
                Old Presentations
            </Button>
          </Flex>
          <SearchBar />
          <CardGrid lectures={lectures} />
        </Grid>
      </Container>
    </Layout>
  )
}

export default Presentations

const query = graphql`
  query Lectures {
    allLecturesYaml {
      edges {
        node {
          title
          level
          date
          body
          link
        }
      }
    }
    allLectureFoldersYaml {
      edges {
        node {
          link
          label
        }
      }
    }
  }
`
