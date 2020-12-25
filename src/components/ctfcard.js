/** @jsx jsx */
import { Heading, Text, jsx, Button, Flex } from 'theme-ui'

const CTFCard = ({ name, link, startDate, endDate, ...props }) => {
  return (
    <Flex
      {...props}
      sx={{
        bg: 'lightBackground',
        borderRadius: 4,
        padding: 4,
        alignItems: 'flex-start',
        flexDirection: 'column',
        justifyContent: 'space-between',
        '& > *': {
          flex: '0 1 auto',
        }
      }}
    >
      <Heading
        as='h1'
        sx={{
          fontSize: [3, 4, 5],
        }}
      >
        {name}
      </Heading>
      <Text
        sx={{
          fontSize: 1,
          marginTop: 2,
        }}
      >
        {`${startDate} - ${endDate}`}
      </Text>
      <Text
        sx={{
          fontSize: [1, 2],
          mt: 3,
          flex: '1 0 auto',
        }}
      >
        {/* {body} */}
      </Text>
      <Text
        sx={{
          fontSize: 1,
          marginTop: 2,
          // color: color,
        }}
      >
        {/* {display} */}
      </Text>
      <Button
        sx={{
          mt: 3,
        }}
        as='a'
        href={link}
        target='_blank'
        rel='noopener noreferrer'
      >
        Go
      </Button>
    </Flex>
  )
}

export default CTFCard
