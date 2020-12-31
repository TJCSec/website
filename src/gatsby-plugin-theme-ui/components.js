/** @jsx jsx */
import { Link, Image, Styled, jsx } from 'theme-ui'
import Prism from '@theme-ui/prism'
import PrismCore from './languages'

import { useInView } from 'react-intersection-observer'
import { Link as AnchorLink } from 'react-scroll'
import Highlight, { defaultProps } from "prism-react-renderer"

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

// Copypasta of theme-ui source, but with no lang
const NoHighlightCodeBlock = ({ children, className: outerClassName, ...props }) => {
  return (
    <Highlight
      {...defaultProps}
      {...props}
      code={children.trim()}
      language=""
      theme={undefined}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <Styled.pre 
          className={`${outerClassName} ${className}`} 
          style={style}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span
                  key={key}
                  {...getTokenProps({ token, key })}
                  sx={token.empty ? { display: `inline-block` } : undefined}
                />
              ))}
            </div>
          ))}
        </Styled.pre>
      )}
    </Highlight>
  );
};


const CodeBlock = (props) => {
  const {ref, inView} = useInView()

  return (
    <div ref={ref}>
      {!inView && <NoHighlightCodeBlock {...props} />}
      {inView && <Prism {...props} Prism={PrismCore} />}
    </div>
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
  code: CodeBlock,
  a: MdLink,
  blockquote: Blockquote,
  img: Image,
}
