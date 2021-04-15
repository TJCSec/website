/** @jsx jsx */
import { Link, Image, jsx } from 'theme-ui'

import { Link as AnchorLink } from 'react-scroll'
import GatsbyLink from '../components/link'

const externalLinkRegex = /^(https?:)?\/\//

const MdLink = ({ href, children, external, ...props }) => {
  return (
    href[0] === '#' ? (
      <AnchorLink
        href={href}
        to={href.substring(1)}
        smooth={true}
        duration={400}
        hashSpy={true}
        {...props}
      >
        {children}
      </AnchorLink>
    ) : externalLinkRegex.test(href) ? (
      <Link
        href={href}
        target='_blank' rel='nofollow noopener noreferrer'
        {...props}
      >
        {children}
      </Link>
    ) : (
      <GatsbyLink to={href} {...props}>
        {children}
      </GatsbyLink>
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
      borderLeft: '3px solid',
      borderLeftColor: 'primary',
    }}
  >
    {children}
  </blockquote>
)


export default {
  pre: props => props.children,
  a: MdLink,
  blockquote: Blockquote,
  img: Image,
}
