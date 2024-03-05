import { defineConfig } from "vitepress";

import { MD_DIR } from "../../scripts/config";
import { version } from "../../package.json";
import { getSideBar } from "./getSide.js";

function addLinkPrefix(arr, prefix) {
  return arr.map((obj) => {
    if (obj.items) {
      obj.items = addLinkPrefix(obj.items, prefix);
    } else {
      obj.link = prefix + obj.link;
      obj.nextLink = false;
    }
    return obj;
  });
}

const sideList = addLinkPrefix(
  getSideBar(`./website/${MD_DIR}`),
  `/${MD_DIR}/`
);

export default defineConfig({
  title: "grantguo",
  description: "基于TypeScript开发的轮子库, 适用于各种Web应用开发场景",
  base: "/grantlibs/",
  head: [["link", { rel: "icon", href: "smile.ico" }]],
  themeConfig: {
    nav: [
      { text: "首页", link: "/" },
      { text: "指南", link: "/guide/whatIs" },
      { text: "文档", link: "/doc/function/debounce" },
    ],
    sidebar: {
      [`/${MD_DIR}/`]: sideList,
      "/guide": [
        {
          text: "介绍",
          link: "/guide/whatIs",
        },
        {
          text: "安装",
          link: "/guide/install",
        },
        {
          text: "快速开始",
          link: "/guide/quick",
        },
      ],
    },
    /*sidebar: [
      {
        text: "",
        items: [
          {
            text: "介绍",
            link: "/guide/whatIs",
          },
          {
            text: "安装",
            link: "/guide/install",
          },
          {
            text: "快速开始",
            link: "/guide/quick",
          },
        ],
      },
      {
        text: "基础使用",
        items: [
          {
            text: "日历calendar",
            link: "/api/calendar/index",
          },
          {
            text: "正则匹配test",
            link: "/api/check/index",
          },
          {
            text: "克隆clone",
            link: "/api/clone/index",
          },
          {
            text: "存储store",
            link: "/api/store/index",
          },
          {
            text: "身份证idCard",
            link: "/api/idCard/index",
          },
          {
            text: "发布订阅subscribe",
            link: "/api/eventEmitter/index",
          },
        ],
      },
    ],*/

    socialLinks: [
      { icon: "github", link: "https://github.com/ForeverGuo/grant-libs" },
    ],
  },
});
