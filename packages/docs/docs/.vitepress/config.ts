import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'en-US',
  title: 'TGrahp',
  description: 'a svg editor',
  lastUpdated: true,
  base: '/tgraph/',

  themeConfig: {
    repo: 'tgraph',
    docsDir: 'docs',
    docsBranch: 'gh-pages',
    editLinks: true,
    editLinkText: 'Edit this page on GitHub',
    lastUpdated: 'Last Updated',


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
    //   '/guide/': getGuideSidebar(),
    //   '/config/': getConfigSidebar(),
    //   '/': getGuideSidebar()
    }
  }
})

function getGuideSidebar() {
  return [
    // {
    //   text: 'Introduction',
    //   children: [
    //     { text: 'What is VitePress?', link: '/' },
    //     { text: 'Getting Started', link: '/guide/getting-started' },
    //     { text: 'Configuration', link: '/guide/configuration' },
    //     { text: 'Asset Handling', link: '/guide/assets' },
    //     { text: 'Markdown Extensions', link: '/guide/markdown' },
    //     { text: 'Using Vue in Markdown', link: '/guide/using-vue' },
    //     { text: 'Deploying', link: '/guide/deploy' }
    //   ]
    // },
    // {
    //   text: 'Advanced',
    //   children: [
    //     { text: 'Frontmatter', link: '/guide/frontmatter' },
    //     { text: 'Theming', link: '/guide/theming' },
    //     { text: 'API Reference', link: '/guide/api' },
    //     {
    //       text: 'Differences from Vuepress',
    //       link: '/guide/differences-from-vuepress'
    //     }
    //   ]
    // }
  ]
}

function getConfigSidebar() {
  return [
    // {
    //   text: 'App Config',
    //   children: [{ text: 'Basics', link: '/config/basics' }]
    // },
    // {
    //   text: 'Theme Config',
    //   children: [
    //     { text: 'Homepage', link: '/config/homepage' },
    //     { text: 'Algolia Search', link: '/config/algolia-search' },
    //     { text: 'Carbon Ads', link: '/config/carbon-ads' }
    //   ]
    // }
  ]
}
