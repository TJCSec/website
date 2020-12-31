/** @jsx jsx */
import { useState } from 'react'
import { Box, Heading, Link, Text, jsx, Button, Flex } from 'theme-ui'

import ScoreBoard from './scoreboard'

const CTFCard = ({ name, link, startDate, endDate, tjParticipants, ...props }) => {
  const [modalOpen, setModalOpen] = useState(false)

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
      }}
    >
      <Box>
        <Link href={link}
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
            {name}
          </Heading>
        </Link>
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
      {tjParticipants && <Button
        onClick={() => {setModalOpen(true)}}
        sx={{
          mt: 2,
        }}
      >
        TJ Participants
      </Button>}
      <ScoreBoard isOpen={modalOpen} scores={tjParticipants} onClose={() => {setModalOpen(false)}}/>
    </Flex>
  )
}

export default CTFCard
