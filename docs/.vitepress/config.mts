import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "grantguo",
  description: "基于JavaScript, TypeScript开发的轮子库, 适用于各种Web应用开发场景",
  base: "/grantlibs/",
  head: [
    ['link',{rel:'icon',href:'smile.ico'}], 
  ],
  themeConfig: {
    logo: '/logo.png',
    nav: [
      { text: 'Home', link: '/' },
      { text: '快速上手', link: '/guide/quick' },
      { text: 'API', link: '/guide/install' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      },
      {
        text: '基础',
        items: [
          {
            text: '安装',
            link: '/guide/install'
          },
          {
            text: '快速开始',
            link: '/guide/quick'
          },
        ]
      },
      {
        text: '基础使用',
        items: [
          {
            text: '日历',
            link: '/examples/calendar/index'
          },
          {
            text: '正则匹配',
            link: '/examples/check/index'
          },
          {
            text: '克隆',
            link: '/examples/clone/index'
          },
          {
            text: '存储',
            link: '/examples/store/index'
          },
          {
            text: '身份证',
            link: '/examples/idCard/index'
          },
          {
            text: '发布订阅',
            link: '/examples/eventEmitter/index'
          },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ForeverGuo/grant-libs' }
    ]
  }
})
