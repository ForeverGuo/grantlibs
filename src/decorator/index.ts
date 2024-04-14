import { toDecorator } from "./toDecorator";
function log(func: Function, message: string) {
  return function (...args: unknown[]) {
    console.log(message);
    return func(...args);
  };
}

const logger = toDecorator(log);

class TestClass {
  @logger("Hello world!")
  testMethod() {
    return 1;
  }
}

export const instance = new TestClass();
