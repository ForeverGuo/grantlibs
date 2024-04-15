import { toDecorator } from "./toDecorator";
import { decMaxCalls } from "./decMaxCalls";
function log(func: Function, message: string) {
  return function (...args: unknown[]) {
    console.log(message);
    return func(...args);
  };
}

const logger = toDecorator(log);

class TestClass {
  private count = 0;
  @decMaxCalls(2)
  testMethod() {
    return ++this.count;
  }
}

export const instance = new TestClass();
