const fizzbuzz = require('../../src/model/fizzbuzz.js')
const assert = require('assert')

const numbers = fizzbuzz(50)

describe("fizzbuzz", () => {
  it("15の倍数のときはFizzBuzz", () => assert.strictEqual(numbers[45 - 1], "FizzBuzz"))

  it("3の倍数かつ5の倍数でないときはFizz", () => assert.strictEqual(numbers[6 - 1], "Fizz"))

  it("3の倍数でないかつ5の倍数のときはBuzz", () => assert.strictEqual(numbers[10 - 1], "Buzz"))

  it("それ以外のときは数字", () => assert.strictEqual(numbers[23 - 1], 23))
})