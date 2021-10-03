// @ts-check

/**
 * @type {import('vitepress').UserConfig}
 */
module.exports = {
  title: 'Fir.js',
  description: 'Framework agnostic meta-framework for server-side rendered applications',
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }]],

  themeConfig: {
    nav: [{ text: 'GitHub', link: 'https://github.com/adamjedlicka/fir' }],

    sidebar: {
      '/introduction/': [
        {
          text: 'Introduction',
          link: '/introduction/',
          children: [
            { text: 'Modules', link: '/introduction/modules' },
            { text: 'Inversion of control', link: '/introduction/inversion-of-control' },
          ],
        },
      ],
    },
  },
}
