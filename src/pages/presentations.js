/** @jsx jsx */
import { Button, Flex, Grid, jsx } from 'theme-ui'

import Layout from '../components/layout'
import Hero from '../components/hero'
import Container from '../components/container'
import SearchBar from '../components/searchbar'
import { useStaticQuery, graphql } from 'gatsby'
import LectureCard from '../components/lecturecard'

const CardGrid = () => {
  const lectures = useStaticQuery(query).allLecturesYaml.edges
  console.log(lectures)
  return (
    <Grid
      columns={[ 1, 2, null, 4 ]}
      sx={{
        width: "100%",
        justifyItems: "start"
      }}
    >
      {lectures.map((obj, _) => (
        <LectureCard 
          title={obj.node.title} 
          body={obj.node.body} 
          level={obj.node.level}
          presentationLink={obj.node.presentationLink}
          date={obj.node.date}
        /> 
      ))}

    </Grid>
  )
}

const Presentations = () => {
  return (
    <Layout>
      <Hero title='Presentations' />
      <Container>
        <Grid
          gap={4}
          sx={{
            justifyItems: "start"
          }}
        >
          <Flex
            sx={{
              flexDirection: ["column", "row"],
              marginTop: -3
            }}
          >
            <Button 
              sx={{
                marginRight: [null, 3],
              }}
              onClick={() => {}}
            >
                Presentations (Google Drive)
            </Button>
            <Button 
              sx={{
                marginTop: [3, 0, null],
              }}
              onClick={() => {}}
            >
                Old Presentations (Google Drive)
            </Button>
          </Flex>
          <SearchBar />
          <CardGrid />
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
          presentationLink
        }
      }
    }
  }
`