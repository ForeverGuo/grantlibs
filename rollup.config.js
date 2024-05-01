import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import { readFileSync } from "fs";
import { terser } from "rollup-plugin-terser";
import alias from "@rollup/plugin-alias";
const packageJson = JSON.parse(readFileSync("./package.json", "utf8")); // 读取UMD全局模块名，在package中定义了
const pkgName = packageJson.umdModuleName;

const banner =
  "/*!\n" +
  ` * grantlibs v${packageJson.version}\n` +
  ` * (c) 2024-${new Date().getFullYear()} grantguo \n` +
  " * Released under the MIT License.\n" +
  " */";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/esm/index.js",
      format: "esm",
      banner,
    },
    {
      file: "dist/cjs/index.js",
      format: "cjs",
      banner,
    },
    {
      file: "dist/umd/index.js",
      format: "umd",
      name: pkgName,
      globals: {
        // 配置依赖中的UMD全局变量名
      },
      banner,
    },
    {
      file: "dist/bundle/index.js",
      format: "iife",
      name: pkgName,
      plugins: [terser()],
      banner,
    },
  ],
  plugins: [
    typescript({
      tsconfig: "./tsconfig.json",
    }),
    alias({
      resolve: [".ts", ".js"],
      entries: [
        { find: "@", replacement: "../src" }, // 将 @ 识别为 ./src 目录
      ],
    }),
    resolve(),
  ],
};
