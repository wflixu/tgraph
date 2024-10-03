import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'TGraph',
  description: 'a svg editor',
  lastUpdated: true,
  base: '/tgraph/',


  themeConfig: {

    editLinks: true,
    editLinkText: 'Edit this page on GitHub',
    lastUpdated: 'Last Updated',

    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/', activeMatch: '^/$|^/guide/' },
      {
        text: '指南',
        link: '/tutorial/',
        activeMatch: '^/tutorial/'
      },
      {
        text: '手册',
        link: '/manual/',
        activeMatch: '^/manual/'
      },
      {
        text: '示例',
        link: '/demos/',
        activeMatch: '^/demos/'
      },
      {
        text: '版本',
        link: 'https://github.com/wflixu/tgraph/releases'
      }
    ],

    sidebar: {
      '/demos/': [
        {
          text: 'Demos',
          items: [
            { text: 'Demos Index', link: '/demos/' },
            { text: 'HelloWorld', link: '/demos/hello-world' },
            { text: 'Boundary', link: '/demos/boundary' }
          ]
        }
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/wflixu/tgraph' }
    ]
  }
})
