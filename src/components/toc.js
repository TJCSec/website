/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Fragment } from 'react'
import { Link } from 'react-scroll'

const TableOfContents = ({ items: baseItems, ...props }) => {
  return (
    <Fragment>
      {baseItems &&
        <ul {...props}>
          {baseItems.map(({ url, title, items }) => (
            <li key={url}>
              <Link
                href={url}
                to={url.substring(1)}
                smooth={true}
                duration={400}
                hashSpy={true}
              >
                {title}
              </Link>
              <TableOfContents items={items} />
            </li>
          ))}
        </ul>
      }
    </Fragment>
  )
}

export default TableOfContents
