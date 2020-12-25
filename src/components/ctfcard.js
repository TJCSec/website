/** @jsx jsx */
import { Box, Heading, Text, jsx, Button, Flex } from 'theme-ui'

const CTFCard = ({ name, link, startDate, endDate, ...props }) => {
  return (
    <Flex
      {...props}
      sx={{
        bg: 'lightBackground',
        borderRadius: 4,
        padding: 4,
        alignItems: 'flex-start',
        flexDirection: 'column',
        justifyContent: 'space-between',
        '& > *': {
          flex: '0 1 auto',
        }
      }}
    >
      <Box>
        <Heading
          as='h1'
          sx={{
            fontSize: [3, 4, 5],
          }}
        >
          {name}
        </Heading>
        <Text
          sx={{
            fontSize: 1,
            marginTop: 2,
            color: 'primary',
          }}
        >
          {`${startDate} - ${endDate}`}
        </Text>
      </Box>
      <Box
        sx={{
          mt: 3,
        }}
      >
        <Button
          sx={{
            mr: 2,
          }}
          as='a'
          href={link}
          target='_blank'
          rel='noopener noreferrer'
        >
          Go
        </Button>
        <Button> 
          {/* Need a way of showing the scores of the people, maybe a pop-up/overlay */}
          TJ Participants
        </Button>
      </Box>
    </Flex>
  )
}

export default CTFCard
