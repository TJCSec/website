/** @jsx jsx */
import { IoFlagSharp, IoLogoDiscord, IoLogoFacebook } from 'react-icons/io5'
import { Box, Grid, jsx } from 'theme-ui'

const FooterIcon = ({Icon, href, ...props}) => (
  <a 
    href={href}
    target='_blank'
    rel="noreferrer"
    sx={{
      color: 'text',
      textDecoration: 'none'
    }}
  >
    <Icon />
  </a>
)

const Footer = (props) => (
  <Box
    {...props}
    sx={{
      bg: 'lightBackground',
      height: '72px',
      display: 'flex',
      alignItems: 'center',
      px: "4rem",
    }}
  >
    <Grid
      columns={3}
      gap={4}
      sx={{
        ml: 'auto',
      }}
    >
      <FooterIcon href='https://www.facebook.com/groups/tjcsc' Icon={IoLogoFacebook} />
      <FooterIcon href='https://ctf.tjcsec.club/' Icon={IoFlagSharp} />
      <FooterIcon href='https://tjcsec.club/discord' Icon={IoLogoDiscord} />
    </Grid>
  </Box>
)

export default Footer
