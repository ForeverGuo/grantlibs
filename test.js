import { clone } from './dist/esm/index.js'

const originalObject = {
  a: 1,
  b: 'hello',
  c: [1, 2, 3],
  d: {
    e: 'nested',
    f: [4, 5, 6]
  }
};

console.info(clone.deep(originalObject))