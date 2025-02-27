/** @jsx jsx */
import { graphql } from 'gatsby'
import { GatsbyImage } from "gatsby-plugin-image";

import { Box, Heading, Text, jsx } from 'theme-ui'

const OfficerCard = ({ data, ...props }) => {
  const {
    name,
    position,
    avatar: {
      childImageSharp: { gatsbyImageData: avatar },
    },
  } = data
  return (
    <Box
      {...props}
      sx={{
        borderRadius: 12,
        bg: 'lightBackground',
        overflow: 'hidden',
        display: 'inline-block',
        width: '0px',
        minWidth: '225px',
        flex: '1 1 0',
      }}
    >
      <GatsbyImage image={avatar} alt={name} />
      <Box
        p={3}
        sx={{
          textAlign: 'center',
        }}
      >
        <Heading as='h3'>{name}</Heading>
        <Text>{position}</Text>
      </Box>
    </Box >
  );
}

export default OfficerCard

export const query = graphql`fragment OfficerInfo on OfficersYaml {
  name
  position
  avatar {
    childImageSharp {
      gatsbyImageData(
        height: 400
        width: 400
        tracedSVGOptions: {color: "#00060c"}
        placeholder: DOMINANT_COLOR
        layout: CONSTRAINED
      )
    }
  }
}`
