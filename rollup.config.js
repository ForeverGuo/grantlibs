import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import { readFileSync } from "fs";
import { terser } from "rollup-plugin-terser";
import alias from "@rollup/plugin-alias";
const packageJson = JSON.parse(readFileSync("./package.json", "utf8")); // 读取UMD全局模块名，在package中定义了
const pkgName = packageJson.umdModuleName;
import path from 'path'

const pathResolve = (p) => path.resolve(__dirname, p);
export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/esm/index.js",
      format: "esm",
    },
    {
      file: "dist/cjs/index.js",
      format: "cjs",
    },
    {
      file: "dist/umd/index.js",
      format: "umd",
      name: pkgName,
      globals: {
        // 配置依赖中的UMD全局变量名
      },
    },
    {
      file: "dist/bundle/index.js",
      format: "iife",
      name: pkgName,
      plugins: [terser()],
    },
  ],
  plugins: [
    typescript({
      tsconfig: "./tsconfig.json",
    }),
    alias({
      resolve: [".ts", '.js'], 
      entries: [
        { find: "@", replacement: pathResolve('../src') }, // 将 @ 识别为 ./src 目录
      ]
    }),
    resolve(),
  ],
};