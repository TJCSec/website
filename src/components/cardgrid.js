/** @jsx jsx */
import { Grid, jsx } from 'theme-ui'

const CardGrid = ({ children, ...props }) => {
  return (
    <Grid
      {...props}
      sx={{
        gridTemplateColumns: [
          'repeat(auto-fill, minmax(200px, 1fr))',  // better way to do this?
          null,
          'repeat(auto-fill, minmax(300px, 1fr))',
        ],
      }}
    >
      {children}
    </Grid>
  )
}

export default CardGrid
