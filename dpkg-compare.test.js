/* eslint-env jest */

const compare = require('./dpkg-compare')

describe('compare versions', () => {
  const list = [
    ['0-b', '0-a'],
    ['0b-0', '0a-0'],
    ['1.0.1', '1.0.0'],
    ['1.0.1', '1.0.0'],
    ['1.0.1', '1.0.0'],
    ['1.1.0', '1.0.0'],
    ['1.1.0', '1.0.1'],
    ['1.1.1', '1.1.0'],
    ['1.0.0', '1.0.0~rc1'],
    ['1.0.0~rc2', '1.0.0~rc1'],
    ['1.0.0~rc2+v1', '1.0.0~rc2'],
    ['1.0.1~rc2+v2', '1.0.1~rc2+v1'],
    ['1.0.0+v10', '1.0.0+v1'],
    ['2.11-9', '2.10-18+deb7u4'],
    ['2:1.1235-1', '2:1.1234-4'],
    ['3:1.1235-1', '2:1.1234-4']
  ]

  list.forEach(([a, b]) => {
    test(`compare ${a} with ${b}`, () => {
      expect(compare(a, b)).toBeGreaterThan(0)
    })
  })

  test('compare identical versions', () => {
    expect(compare('0:1-2', '0:1-2')).toBe(0)
  })
  test('compare lower than epoch', () => {
    expect(compare('1:1.2', '2:1.2')).toBeLessThan(0)
  })
  test('compare lower than versions', () => {
    expect(compare('22.2', '333')).toBeLessThan(0)
  })
})

describe('detect invalid versions', () => {
  test('version number does not start with digit', () => {
    expect(() => compare('?', '?')).toThrow('version number does not start with digit')
  })
  test('invalid character in version number', () => {
    expect(() => compare('0?', '0?')).toThrow('invalid character in version number')
  })
  test('invalid character in revision number', () => {
    expect(() => compare('1-?', '1-?')).toThrow('invalid character in revision number')
  })
  test('version number is empty', () => {
    expect(() => compare('-1', '-1')).toThrow('version number is empty')
  })
  test('revision number is empty', () => {
    expect(() => compare('1-', '1-')).toThrow('revision number is empty')
  })
  test('nothing after colon in version number', () => {
    expect(() => compare('1:', '1:')).toThrow('nothing after colon in version number')
  })
  test('epoch in version is negative', () => {
    expect(() => compare('-1:1', '-1:1')).toThrow('epoch in version is negative')
  })
  test('epoch in version is not a number', () => {
    expect(() => compare('a:1', 'a:1')).toThrow('epoch in version is not a number')
  })
  test('epoch in version is too big', () => {
    expect(() => compare('99999999999999999999999:1', '99999999999999999999999:1')).toThrow('epoch in version is too big')
  })
  test('version string is empty', () => {
    expect(() => compare('', '')).toThrow('version string is empty')
  })
  test('epoch in version is empty', () => {
    expect(() => compare(':1', ':1')).toThrow('epoch in version is empty')
  })
  test('version string is empty when comparing undefined', () => {
    expect(() => compare(undefined, undefined)).toThrow('version string is empty')
  })
  test('version string is empty when comparing null', () => {
    expect(() => compare(null, null)).toThrow('version string is empty')
  })
})
