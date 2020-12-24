module.exports = {
  pathPrefix: '/csc',
  plugins: [
    "gatsby-plugin-theme-ui",
    "gatsby-plugin-react-helmet",
  ],
  siteMetadata: {
    title: 'TJCSC',
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
