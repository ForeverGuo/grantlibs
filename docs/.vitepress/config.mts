import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "grantguo",
  description: "基于JavaScript, TypeScript开发的轮子库, 适用于各种Web应用开发场景",
  base: "/grant-libs/",
  head: [
    ['link',{rel:'icon',href:'/smile.ico'}], 
  ],
  themeConfig: {
    logo: '/logo.png',
    nav: [
      { text: 'Home', link: '/' },
      { text: '指南', link: '/guide/install' },
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
            text: 'calendar日历',
            link: '/examples/calendar/index'
          },
          {
            text: 'test正则匹配',
            link: '/examples/check/index'
          },
          {
            text: 'clone克隆',
            link: '/examples/clone/index'
          },
          {
            text: 'store存储',
            link: '/examples/store/index'
          },
          {
            text: 'idCard身份证',
            link: '/examples/idCard/index'
          },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ForeverGuo/grant-libs' }
    ]
  }
})
