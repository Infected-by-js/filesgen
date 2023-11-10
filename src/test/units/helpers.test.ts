import {isEmpty} from '../../helpers'
import {describe, it} from 'mocha'
import {expect} from 'chai'

suite('Helpers Test', () => {
  describe('isEmpty', () => {
    const cases = [
      {input: null, expected: true, description: 'should return true for null'},
      {input: {}, expected: true, description: 'should return true for an empty object'},
      {input: [], expected: true, description: 'should return true for an empty array'},
      {input: '', expected: true, description: 'should return true for an empty string'},
      {input: ' ', expected: true, description: 'should return false for non empty string'},
      {input: 0, expected: false, description: 'should return false for the number 0'},
      {input: 42, expected: false, description: 'should return false for a non-zero number'},
      {input: {key: 'value'}, expected: false, description: 'should return false for a non-empty object'},
      {input: [1, 2, 3], expected: false, description: 'should return false for a non-empty array'},
      {input: 'non-empty', expected: false, description: 'should return false for a non-empty string'},
    ]

    cases.forEach(({input, expected, description}) => {
      it(description, () => {
        expect(isEmpty(input)).to.equal(expected)
      })
    })
  })
})
