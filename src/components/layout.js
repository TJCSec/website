/** @jsx jsx */
import { Flex, Styled, jsx } from 'theme-ui'

import Navbar from './navbar'
import SEO from './seo'
import { motion } from 'framer-motion'

const Layout = ({ seo, children }) => {
  return (
    <Styled.root>
      <SEO {...seo} />
      <Navbar />
      <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
        <Flex
          as='main'
          sx={{
            flexDirection: 'column',
            justifyContent: 'stretch',
          }}
        >
          {children}
        </Flex>
      </motion.div>
    </Styled.root>
  )
}

export default Layout
