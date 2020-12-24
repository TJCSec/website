/** @jsx jsx */
import { Box, Heading, Progress, Text, jsx, Button, Flex } from 'theme-ui'

const LectureCard = ({body, date, level, title, presentationLink, ...props}) => {
  const seekBarColor = level === 3 ? "accent" : level === 2 ? "highlight" : "secondary"
  const difficulty = level === 3 ? "Hard" : level === 2 ? "Medium" : "Easy"

  return (
    <Flex
      {...props}
      sx={{
        bg: "lightBackground",
        borderRadius: 4,
        padding: 4,
        width: "100%",
        alignItems: "center"
      }}
    >
      <Box
        sx={{
          width: "100%"
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
        <Heading
          as='h4'
          sx={{
            fontSize: [1, 2],
            marginTop: 1
          }}
        >
          {body}
        </Heading>
        <Progress 
          max={3} 
          value={level} 
          color={seekBarColor}
          sx={{
            marginTop: 3,
            height: 5,
          }}
        />
        <Text
          sx={{
            fontSize: 1,
            marginTop: 2,
            color: difficulty
          }}
        >
          {difficulty}
        </Text>
        <Button
          sx={{
            marginTop: 3
          }}
          onClick={() => {window.location.href = presentationLink}}
        >
          Presentation
        </Button>
      </Box>
    </Flex>
  )
}

export default LectureCard