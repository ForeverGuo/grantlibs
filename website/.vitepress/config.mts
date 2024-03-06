import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "grantguo",
  description: "基于TypeScript开发的轮子库, 适用于各种Web应用开发场景",
  base: "/grantlibs/",
  head: [
    ['link', { rel: 'icon', href: 'smile.ico' }],
  ],
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/install' },
      { text: '文档', link: '/api/calendar/index' }
    ],

    sidebar: [
      {
        text: '',
        items: [
          {
            text: '介绍',
            link: '/guide/whatIs'
          },
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
            text: '日历calendar',
            link: '/api/calendar/index'
          },
          {
            text: '正则匹配test',
            link: '/api/check/index'
          },
          {
            text: '克隆clone',
            link: '/api/clone/index'
          },
          {
            text: '存储store',
            link: '/api/store/index'
          },
          {
            text: '身份证idCard',
            link: '/api/idCard/index'
          },
          {
            text: '发布订阅subscribe',
            link: '/api/eventEmitter/index'
          },
          {
            text: '防抖debounce',
            link: '/api/function/debounce'
          },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ForeverGuo/grant-libs' }
    ]
  }
})
