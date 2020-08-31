import { mount } from 'src/utilsTests'
import Title from './index'

describe('test Title component render dom', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(Title, {
      title: 'test title',
      src: ''
    })
  })

  it('title text', () => {
    expect(wrapper.find('.title-text').text()).toEqual('test title')
  })

  it('.title', () => {
    expect(wrapper.find('.title').length).toBe(1)
  })

  it('.title-border', () => {
    expect(wrapper.find('.title-border').length).toBe(2)
  })

  it('.title-img', () => {
    expect(wrapper.find('.title-img').length).toBe(1)
  })
})
