module.exports = {
  pathPrefix: '/csc',
  plugins: [
    'gatsby-plugin-theme-ui',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sharp',
    'gatsby-transformer-yaml',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        defaultLayouts: {
          default: require.resolve('./src/templates/writeup.js'),
        },
        extensions: ['.mdx', '.md'],
        gatsbyRemarkPlugins: [
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
        ]
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
        path: './data/',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'writeups',
        path: './writeups/',
      },
    },
  ],
  siteMetadata: {
    title: 'TJCSC',
    titleTemplate: '%s | TJCSC',
    description:
      'TJHSST Computer Security Club is designed to introduce students to ethical hacking',
    url: 'https://activities.tjhsst.edu',
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
