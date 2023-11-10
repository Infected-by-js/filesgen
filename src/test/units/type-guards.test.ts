import {expect} from 'chai'
import {isArray, isNull, isNumber, isObject, isString, isUndefined} from '../../type-guards'
import {describe, it} from 'mocha'

describe('Type Guard Functions', () => {
  const testCases = [
    {
      name: isObject,
      validInputs: [{key: 'value'}, {nested: {prop: 'value'}}],
      invalidInputs: ['not an object', [1, 2, 3], 42, null, undefined],
    },
    {
      name: isArray,
      validInputs: [[1, 2, 3], []],
      invalidInputs: ['not an array', {key: 'value'}, 42, null, undefined],
    },
    {
      name: isString,
      validInputs: ['string', ''],
      invalidInputs: [42, {key: 'value'}, [1, 2, 3], null, undefined],
    },
    {
      name: isNumber,
      validInputs: [42, 0, -1],
      invalidInputs: ['not a number', '42', {key: 'value'}, null, undefined],
    },
    {
      name: isNull,
      validInputs: [null],
      invalidInputs: ['not null', undefined, 42, {key: 'value'}],
    },
    {
      name: isUndefined,
      validInputs: [undefined],
      invalidInputs: ['not undefined', null, 42, {key: 'value'}],
    },
  ]

  testCases.forEach((testCase) => {
    describe(testCase.name.name, () => {
      it('should return true for valid inputs', () => {
        testCase.validInputs.forEach((input) => {
          const result = testCase.name(input)
          expect(result, `Failed for input: ${JSON.stringify(input)}`).to.be.true
        })
      })

      it('should return false for invalid inputs', () => {
        testCase.invalidInputs.forEach((input) => {
          const result = testCase.name(input)
          expect(result, `Failed for input: ${JSON.stringify(input)}`).to.be.false
        })
      })
    })
  })
})
