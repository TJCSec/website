/** @jsx jsx */
import { useState } from 'react'
import { Box, Heading, Text, jsx, Button, Flex } from 'theme-ui'
import ScoreBoard from './scoreboard';


const CTFCard = ({ name, link, startDate, endDate, tjParticipants, ...props }) => {
  const [modalOpen, setModalOpen] = useState(false);

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
      <Box>
        <Button
          sx={{
            mt: 3,
            mr: 2,
          }}
          as='a'
          href={link}
          target='_blank'
          rel='noopener noreferrer'
        >
          Go
        </Button>
        {tjParticipants && <Button 
          onClick={() => {setModalOpen(true)}}
          sx={{
            mt: 3,
          }}
        > 
          {/* Need a way of showing the scores of the people, maybe a pop-up/overlay */}
          TJ Participants
        </Button>}
      </Box>
      <ScoreBoard isOpen={modalOpen} scores={tjParticipants} onClose={() => {setModalOpen(false)}}/>
    </Flex>
  )
}

export default CTFCard
