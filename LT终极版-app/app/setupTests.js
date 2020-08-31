import 'react-native'
import Adapter from 'enzyme-adapter-react-16'
import Enzyme from 'enzyme'

global.fetch = require('jest-fetch-mock')
jest.mock('react-native-cookies', () => 'CookieManager')
jest.mock('react-native-letote-alipay', () => 'Alipay')
jest.mock('react-native-letote-baidumjt', () => ({
  onEventWithAttributes: jest.fn(),
  onEvent: jest.fn()
}))
jest.mock('react-native-letote-sensors', () => ({
  trackWithProperties: jest.fn(),
  registerDynamicSuperProperties: jest.fn(),
  track: jest.fn()
}))

jest.mock('react-native-adhoc', () => ({
  getFlag: jest.fn(),
  track: jest.fn()
}))

jest.mock('react-native-letote-picker', () => ({
  init: jest.fn(),
  show: jest.fn()
}))

jest.mock('react-native-gesture-handler', () => ({}))
const { JSDOM } = require('jsdom')

const jsdom = new JSDOM('<!doctype html><html><body></body></html>')
const { window } = jsdom

function copyProps(src, target) {
  Object.defineProperties(target, {
    ...Object.getOwnPropertyDescriptors(src),
    ...Object.getOwnPropertyDescriptors(target)
  })
}

global.window = window
global.document = window.document
global.navigator = {
  userAgent: 'node.js'
}
global.requestAnimationFrame = function(callback) {
  return setTimeout(callback, 0)
}
global.cancelAnimationFrame = function(id) {
  clearTimeout(id)
}
copyProps(window, global)
Enzyme.configure({ adapter: new Adapter() })

/**
 * Ignore some expected warnings
 * see: https://jestjs.io/docs/en/tutorial-react.html#snapshot-testing-with-mocks-enzyme-and-react-16
 * see https://github.com/Root-App/react-native-mock-render/issues/6
 */
const originalConsoleError = console.error
console.error = message => {
  if (message.startsWith('Warning:')) {
    return
  }

  originalConsoleError(message)
}
