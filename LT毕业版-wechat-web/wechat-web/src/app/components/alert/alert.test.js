import { mount } from 'src/utilsTests'
import Alert from './index.jsx'

describe('test hint ', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(Alert, {
      icon: '',
      title: '成功',
      content: 'Content内容',
      handleClick: jest.fn(),
      btnText: '好的',
      children: null
    })
  })
  it('test render classname === icon', () => {
    expect(wrapper.find('.icon').length).toBe(0)
  })
  it('test render classname === top-content', () => {
    expect(wrapper.find('.top-content').length).toBe(1)
  })
  it('test render classname === alert-btn', () => {
    expect(wrapper.find('.alert-btn').length).toBe(1)
  })
  it('test render p text', () => {
    expect(wrapper.find('p').text()).toEqual('成功')
  })
  it('test render span text', () => {
    expect(wrapper.find('.top-content').text()).toEqual('Content内容')
  })
})
