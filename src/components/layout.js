/** @jsx jsx */
import { Flex, Styled, jsx } from 'theme-ui'

import Navbar from './navbar'
import Footer from './footer'
import SEO from './seo'

const Layout = ({ children }) => {
  return (
    <Styled.root>
      <SEO />
      <Navbar />
      <Flex
        as='main'
        sx={{
          flexDirection: 'column',
          justifyContent: 'stretch',
          minHeight: 'calc(100vh - 72px)'
        }}
      >
        {children}
      </Flex>
      <Footer />
    </Styled.root>
  )
}

export default Layout
