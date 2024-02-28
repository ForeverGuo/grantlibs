export default {
  preset: "ts-jest",
  verbose: true,  // 显示测试结果
  bail: true,     // 显示测试日志
  testEnvironment: "node",
  testMatch: [
    // 匹配文件，指示了Jest应该在那些文件夹中寻找哪些文件
    "**/test/**/*.test.ts",
  ],
  moduleFileExtensions: [
    //覆盖的文件类型
    "js",
    "ts",
  ],
  coveragePathIgnorePatterns: [
    //忽略的目录
    "/node_modules/",
    "/dist/",
    "/test/dist/**/*",
  ],
  coverageThreshold: {
    // 测试报告阀值
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
