/** @jsx jsx */
import { Heading, Text, jsx } from 'theme-ui'
import { motion } from 'framer-motion'
import { navigate } from 'gatsby'

import { cardAnimateProps } from '../animations/animations'

const WriteupCard = ({ frontmatter, excerpt, timeToRead, ...props }) => {
  return (
    <motion.div
      {...cardAnimateProps()}
      onClick={() => {navigate(frontmatter.slug)}}
      {...props}
      sx={{
        display: 'flex',
        bg: 'lightBackground',
        borderRadius: 4,
        padding: 4,
        alignItems: 'stretch',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
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
          color: 'primary',
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
    </motion.div>
  )
}

export default WriteupCard
