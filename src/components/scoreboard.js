/** @jsx jsx */
import { Box, Heading, Text, jsx, Button } from 'theme-ui'
import theme from '../gatsby-plugin-theme-ui/index' 
import Modal from 'react-modal'

const modalStyles = {
  overlay: {
    zIndex: 1000,
    backgroundColor: "rgba(0, 0, 0, 0.58)",
    display: "flex",
    alignItems: "center"
  },
  content: {
    minWidth: "260px",
    maxWidth: "500px",
    maxHeight: "800px",
    margin: "auto",
    padding: "2rem",
    borderRadius: 2,
    border: "none",
    backgroundColor: theme.colors.lightBackground,
    blockSize: "fit-content",
    position: "relative",
    inset: 0,
    display: "block"
  }
}

const columns = [
  {
    header: "Rank",
    accessor: "rank",
  },
  {
    header: "Team",
    accessor: "team",
  },
  {
    header: "Score",
    accessor: "score",
  }
]

const Table = ({columns, data, ...props}) => {
  return (
    <table
      sx={{
        borderSpacing: "0 1em",
        borderCollapse: "collapse",
        width: "100%",
      }}
      {...props}
    >
      <tbody>
        <tr
          sx={{
            borderBottom: "3px solid #ffffff20"
          }}
        >
          {columns.map((column, i) => (
            <td key={i}>
              <Heading
                sx={{
                  mt: 2,
                  mb: 2,
                }}
                as='h4'
                color='primary'
              >
                {column.header}
              </Heading>
            </td>
          ))}
        </tr>
        {data.map((obj, i) => (
          <tr
            key={i}
            sx={{
              borderBottom: i !== data.length-1 ? "3px solid #ffffff15" : "0px"
            }}
          >
            {columns.map((columnItem, j) => (
              <td key={j}>
                <Text
                  sx={{
                    mt: 2,
                    mb: 2,
                  }}
                >
                  {obj[columnItem.accessor]}
                </Text>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

Modal.setAppElement('body')

const ScoreBoard = ({scores, onClose, ...props}) => {
  return (
    <Modal 
      {...props}
      style={modalStyles}
      onRequestClose={onClose}
    >
      <Heading
        as='h1'
        sx={{
          fontSize: [3, 4, 5],
        }}
      >
        TJ Participants
      </Heading>
      <Box
        sx={{
          mt: 3,
          maxHeight: "400px",
          overflow: "auto",
        }}
      >
        <Table
          columns={columns}
          data={scores}
        />
      </Box>
      <Button
        
        sx={{
          mt: 3
        }}
        onClick={() => {onClose()}}
      >
        Close
      </Button>
    </Modal>
  )
}

export default ScoreBoard
