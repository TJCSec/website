/** @jsx jsx */
import { Link as ExternalLink, jsx } from 'theme-ui'
import { createElement } from 'react'
import rehypeReact from 'rehype-react'

import { Link as AnchorLink } from 'react-scroll'
import InternalLink from '../components/link'

const extRegex = /^(https?:)?\?\?/

const MdLink = ({ href, children, external, ...props }) =>
  href[0] === '#' ? (
    <AnchorLink href={href} to={href.substring(1)} {...props} smooth={true} duration={400} hashSpy={true}>{children}</AnchorLink>
  ) : extRegex.test(href) || external ? (
    <ExternalLink href={href} target='_blank' rel='nofollow noopener noreferrer' {...props}>{children}</ExternalLink>
  ) : (
    <InternalLink to={href} {...props}>{children}</InternalLink>
  )

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

function render(options) {
  rehypeReact.call(this, {
    createElement,
    components: {
      a: MdLink,
      blockquote: Blockquote,
    },
    ...options
  })
}

export default render
