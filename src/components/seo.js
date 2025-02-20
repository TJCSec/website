import React from 'react'
import { useLocation } from '@reach/router'
import { useStaticQuery, graphql, withPrefix } from 'gatsby'

const SEO = ({ title, description, ...props }) => {
  const { pathname } = useLocation()
  const {
    site: {
      siteMetadata: {
        title: defaultTitle,
        description: defaultDescription,
        url,
      },
    },
  } = useStaticQuery(query)

  const data = {
    url: url + pathname,
    title: title ?? defaultTitle,
    description: description ?? defaultDescription,
  }

  return (
    <>
      <meta name='description' content={data.description} />
      <meta property='og:type' content='website' />
      <meta property='og:url' content={data.url} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={data.description} />
      <meta property='og:image' content={withPrefix('/meta.png')} />
      <link rel='icon' type='image/x-icon' href={withPrefix('/favicon.ico')} />
      <link rel='canonical' href={data.url} />
    </>
  )
}

export default SEO

const query = graphql`
  query SEO {
    site {
      siteMetadata {
        description
        title
        url
      }
    }
  }
`
