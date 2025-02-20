/** @jsx jsx */
import { Heading, Text, jsx } from 'theme-ui'
import { motion } from 'framer-motion'

import Link from './link'
import { cardAnimateProps } from '../animations/animations'
import datefmt from '../utils/datefmt'

const WriteupCard = ({
  frontmatter,
  fields,
  author,
  ...props
}) => {
  return (
    <Link
      to={frontmatter.slug}
      sx={{
        textDecoration: 'none',
        display: 'flex',
      }}
    >
      <motion.div
        {...cardAnimateProps()}
        {...props}
        sx={{
          flex: 'auto',
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
          },
        }}
      >
        <Text
          sx={{
            fontSize: 1,
            mb: 2,
            color: 'primary',
          }}
        >
          {frontmatter.author}
        </Text>
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
            mt: 2,
            color: 'primary',
          }}
        >
          {datefmt(frontmatter.date)} — {fields.timeToRead.text}
        </Text>
        <Text
          sx={{
            fontSize: [1, 2],
            mt: 3,
            flex: '1 0 auto',
          }}
        >
          {frontmatter.excerpt}
        </Text>
      </motion.div>
    </Link>
  )
}

export default WriteupCard