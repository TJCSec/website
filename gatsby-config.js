module.exports = {
  plugins: [
    'gatsby-plugin-image',
    'gatsby-plugin-theme-ui',
    'gatsby-plugin-sharp',
    'gatsby-transformer-yaml',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        extensions: ['.mdx', '.md'],
        gatsbyRemarkPlugins: [
          'gatsby-remark-smartypants',
          {
            resolve: 'gatsby-remark-autolink-headers',
            options: {
              isIconAfterHeader: true,
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              withWebp: true,
              linkImagesToOriginal: true,
            }
          },
          {
            resolve: 'gatsby-remark-copy-linked-files',
            options: {
              ignoreFileExtensions: ['png', 'jpg', 'jpeg', 'bmp', 'tiff'],
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: 'language-',
              inlineCodeMarker: null,
              aliases: {},
              noInlineHighlight: true,
            },
          },
        ],
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'data',
        path: `${__dirname}/data/`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'writeups',
        path: `${__dirname}/writeups/`,
      },
    },
  ],
  siteMetadata: {
    title: 'TJCSC',
    titleTemplate: '%s | TJCSC',
    description:
      'TJHSST Computer Security Club is designed to introduce students to ethical hacking',
    url: 'https://tjcsec.club',
    menuLinks: [
      {
        name: 'Presentations',
        link: '/presentations',
      },
      {
        name: 'CTF',
        link: '/ctf',
      },
      {
        name: 'Writeups',
        link: '/writeups',
      },
    ],
  },
};
