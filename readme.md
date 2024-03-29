### Desription

<p align=center>
  <b>
    基于TypeScript开发的工具库, 适用于Web应用开发场景·<br/>
    无依赖任何第三方库，便于开发. <br/>
    达到开箱即用.
  </b>
</p>

<div align=center class="space-y">
  ✅ ESM
  ✅ Fast & Lightweight 
  ✅ Tree-shakable 
  ✅ Typescript Strict Mode
  <br>
  🙂 100% Test Coverage 
  🙂 Zero dependencies 
  🙂 Hoverable Docs
  🙂 TS Decorators
</div>
<p></p>

### 快速使用

```js

  pnpm install grantlibs -D
  或
  yarn add grantlibs -D

```

### ESModule 方式

```js
import { calendar, store } from "grantlibs";
const year = calendar.getYear();
```

### CommonJS 方式

```js
const { calendar, store } = require("grantlibs");
const year = calendar.getYear();
```

### 浏览器 UMD 方式

```js
<script type="text/javascript" src="/node_module/dist/umd/index.js"></script>
```

### API 文档

[文档地址](https://foreverguo.github.io/grantlibs/)

#### 参与贡献

1.  Fork 本仓库
2.  新建 feature_xxx 分支
3.  提交代码
4.  新建 Pull Request

### ISSUE 地址

[Issues](https://github.com/ForeverGuo/grantlibs/issues)
