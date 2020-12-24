/** @jsx jsx */
import { Box, jsx } from 'theme-ui'

import CircuitBoard from '../images/circuit-board.svg'

const Hero = ({ children, ...props }) => (
  <Box
    sx={{
      backgroundColor: '#0B1117',
      backgroundImage: `url(${CircuitBoard})`,
      pr: [0, null, '50%'],
    }}
  >
    <Box
      {...props}
      sx={{
        pt: theme => `calc(2rem + ${theme.sizes.navbar})`,
        pb: '2rem',
        px: ['2rem', null, '4rem'],
        backgroundColor: 'background',
        minHeight: '100vh',
        color: 'inverse',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        'h1': {
          fontSize: [6, null, 7],
        },
        'h2': {
          fontSize: [3, null, 5],
        },
        '& > *': {
          maxWidth: [null, null, '40rem'],
        },
      }}
    >
      {children}
    </Box>
  </Box>
)

export default Hero
