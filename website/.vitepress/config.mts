import { defineConfig } from 'vitepress'
import { apiMenu, guideMenu, leetCodeMenu, vue2Menu } from './menu'

export default defineConfig({
  title: "grantguo",
  description: "基于TypeScript开发的轮子库, 适用于各种Web应用开发场景",
  base: "/grantlibs/",
  head: [
    ['link', { rel: 'icon', href: 'smile.ico' }],
  ],
  lastUpdated: true,
  themeConfig: {
    search: {
      provider: 'local', // 可以开启本地搜索
      // provider: "algolia",
    },
    lastUpdatedText: "最后更新",
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/whatIs' },
      { text: '文档', link: '/api/idCard/birthday' },
      { text: 'vue2源码', link: '/vue2/prepare/index' },
      { text: '每日一题', link: '/leetcode/topk' }
    ],

    sidebar: {
      '/guide': guideMenu,
      '/api': apiMenu,
      '/leetcode': leetCodeMenu,
      '/vue2': vue2Menu
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ForeverGuo/grant-libs' }
    ]
  },
})
