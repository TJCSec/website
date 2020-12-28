/** @jsx jsx */
import { Flex, Styled, jsx } from 'theme-ui'

import Navbar from './navbar'
import SEO from './seo'

const Layout = ({ seo, children }) => {
  return (
    <Styled.root>
      <SEO {...seo} />
      <Navbar />
      <Flex
        as='main'
        sx={{
          flexDirection: 'column',
          justifyContent: 'stretch',
        }}
      >
        {children}
      </Flex>
    </Styled.root>
  )
}

export default Layout
