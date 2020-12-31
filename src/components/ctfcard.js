/** @jsx jsx */
import { Box, Heading, Text, Button, jsx } from 'theme-ui'
import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'

import ScoreBoard from './scoreboard'
import {cardAnimateProps} from '../animations/animations'

const CTFCard = ({ name, link, startDate, endDate, tjParticipants, ...props }) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [isHoveringOverButtons, setisHoveringOverButtons] = useState(false)

  const open = useCallback(() => {setModalOpen(true)}, [])
  const close = useCallback(() => {setModalOpen(false)}, [])

  return (
    <motion.div
      {...cardAnimateProps(isHoveringOverButtons)}
      onClick={() => {!isHoveringOverButtons && !modalOpen && window.open(link, '_blank', 'nofollow,noopener,noreferrer')}}
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
      {tjParticipants && <Button
        onClick={open}
        onMouseEnter={() => {setisHoveringOverButtons(true)}}
        onMouseLeave={() => {setisHoveringOverButtons(false)}}
        sx={{
          mt: 2,
        }}
      >
        TJ Participants
      </Button>}
      <ScoreBoard isOpen={modalOpen} scores={tjParticipants} onClose={close}/>
    </motion.div>
  )
}

export default CTFCard
