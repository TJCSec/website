/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Link } from 'gatsby'

const NewLink = (props) => (
  <Link
    {...props}
    sx={{
      color: 'inherit',
      '&.active': {
        color: 'primary',
      },
    }}
  />
)

export default NewLink