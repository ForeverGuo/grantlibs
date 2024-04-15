import { instance } from '../src/decorator'

test('decorator', () => {
  console.log(instance.testMethod())
  console.log(instance.testMethod())
  console.log(instance.testMethod())
})
