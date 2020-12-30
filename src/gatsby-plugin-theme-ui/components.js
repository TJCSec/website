/** @jsx jsx */
import { Link, jsx } from 'theme-ui'
import Prism from '@theme-ui/prism'

import { Link as AnchorLink } from 'react-scroll'

const MdLink = ({ href, children, external, ...props }) => {
  return (
    href[0] === '#' ? (
      <AnchorLink href={href} to={href.substring(1)} {...props} smooth={true} duration={400}>{children}</AnchorLink>
    ) : (
      <Link
        href={href}
        target='_blank' rel='nofollow noopener noreferrer'
        {...props}
      >
        {children}
      </Link>
    )
  )
}

const Blockquote = ({ children, ...props }) => (
  <blockquote
    {...props}
    sx={{
      m: 0,
      p: '0.5rem 1.5rem',
      bg: 'lightBackground',
      borderLeft: '3px solid #ffffff15',
    }}
  >
    {children}
  </blockquote>
)


export default {
  pre: props => props.children,
  code: Prism,
  a: MdLink,
  blockquote: Blockquote
}
