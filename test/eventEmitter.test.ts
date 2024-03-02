import { eventEmitter } from "../src/index";

test("eventEmitter", () => {
  eventEmitter.on('testName', () => {
    console.info('test-1')
  })
  eventEmitter.on('testName', () => {
    console.info('test-2')
  })
  eventEmitter.emit('testName')
})
