## 介绍

grantlibs 基于 TypeScript 开发的轮子库, 适用于各种 Web 应用开发场景，让你的 vue/react 开发更加方便和高效。

## 特性

- 全面支持 web 多端开语言
- 包含了常用的函数，如防抖、节流、深拷贝、日期格式化等
- 代码简洁、易读、易维护，遵循了 eslint 和 prettier 的规范
- 使用 jest 进行单元测试，覆盖率高达 90%
- 使用 vitepress 生成文档，方便查阅和学习

## 快速上手

请通过[快速上手](/guide/install)了解更详细的内容

## 使用方法

### 安装

```ts
npm install grantlibs -D
# or
yarn add grantlibs -D
```

### 工具函数引用-按需引入

```typescript
import { clone } from "grantlibs";
const deepObj = clone.deep({ a: 1, b: 2 });
const shallowObj = clone.shallow({ a: 1, b: 2 });
```

### 文档

你可以在[这里](https://foreverguo.github.io/grantlibs/)查看完整的文档，了解更多。

### 贡献

如果你对本项目感兴趣，欢迎提出 issue 或 pull request.

### 许可

本项目遵循 MIT 协议，你可以自由地使用、修改和分发本项目。
