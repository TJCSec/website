/** @jsx jsx */
import { Heading, Text, jsx, Button, Flex } from 'theme-ui'

import Link from './link'

const WriteupCard = ({ frontmatter, excerpt, timeToRead, ...props }) => {

  return (
    <Flex
      {...props}
      sx={{
        bg: 'lightBackground',
        borderRadius: 4,
        padding: 4,
        alignItems: 'stretch',
        flexDirection: 'column',
        justifyContent: 'space-between',
        '& > *': {
          flex: '0 1 auto',
        }
      }}
    >
      <Heading
        as='h1'
        sx={{
          fontSize: [3, 4, 5],
        }}
      >
        {frontmatter.title}
      </Heading>
      <Text
        sx={{
          fontSize: 1,
          marginTop: 2,
        }}
      >
        {frontmatter.date} — {timeToRead} minute read
      </Text>
      <Text
        sx={{
          fontSize: [1, 2],
          mt: 3,
          flex: '1 0 auto',
        }}
      >
        {excerpt}
      </Text>
      <Flex
        sx={{
          flexDirection: ['column', null, 'row'],
          mt: 3,
        }}
      >
        <Button as={Link} to={frontmatter.slug}>
          Read
        </Button>
      </Flex>
    </Flex>
  )
}

export default WriteupCard
