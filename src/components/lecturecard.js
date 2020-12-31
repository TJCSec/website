/** @jsx jsx */
import { Flex, Heading, Link, Progress, Text, jsx } from 'theme-ui'

const difficulty = {
  1: {
    color: '#AED1FE',
    display: 'Easy',
  },
  2: {
    color: '#FFDB78',
    display: 'Medium',
  },
  3: {
    color: '#D67C78',
    display: 'Hard',
  },
}

const LectureCard = ({ body, date, level, title, link, ...props }) => {
  const { color, display } = difficulty[level]

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
      <Link href={link}
        target='_blank' rel='nofollow noopener noreferrer'
        sx={{
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        }}
      >
        <Heading
          as='h1'
          sx={{
            fontSize: [3, 4, 5],
          }}
        >
          {title}
        </Heading>
      </Link>
      <Text
        sx={{
          fontSize: 1,
          marginTop: 2,
          color: color,
        }}
      >
        {date}
      </Text>
      <Text
        sx={{
          fontSize: [1, 2],
          mt: 3,
          flex: '1 0 auto',
        }}
      >
        {body}
      </Text>
      <Progress
        max={3}
        value={level}
        color={color}
        sx={{
          mt: 3,
          height: 5,
        }}
      />
      <Text
        sx={{
          fontSize: 1,
          marginTop: 2,
          color: color,
        }}
      >
        {display}
      </Text>
    </Flex>
  )
}

export default LectureCard
