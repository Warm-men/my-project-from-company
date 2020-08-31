import { mount } from 'src/utilsTests'
import HighlightWords from '../index.jsx'

describe('HighlightWords 划词组件测试', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(HighlightWords, { text: '', index: [] })
  })

  it('case1: 正常高亮', () => {
    wrapper.setProps({ text: '0123456789', index: [{ start: 1, end: 4 }] })
    expect(
      HighlightWords.getSplitedTextByIndex(
        wrapper.props().text,
        wrapper.props().index
      )
    ).toStrictEqual([
      { text: '0', highLight: false },
      { text: '1234', highLight: true },
      { text: '56789', highLight: false }
    ])
    expect(wrapper.find('.highlighted-words').length).toBe(1)
    expect(wrapper.find('.highlighted-words').text()).toBe('1234')
  })

  it('case2: 多组重叠高亮', () => {
    wrapper.setProps({
      text: '0123456789',
      index: [{ start: 2, end: 4 }, { start: 3, end: 5 }, { start: 7, end: 8 }]
    })
    expect(
      HighlightWords.getSplitedTextByIndex(
        wrapper.props().text,
        wrapper.props().index
      )
    ).toStrictEqual([
      { text: '01', highLight: false },
      { text: '2345', highLight: true },
      { text: '6', highLight: false },
      { text: '78', highLight: true },
      { text: '9', highLight: false }
    ])
    expect(wrapper.find('.highlighted-words').length).toBe(2)
  })

  it('case3: 多组重叠高亮2', () => {
    wrapper.setProps({
      text: '0123456789',
      index: [{ start: 1, end: 7 }, { start: 4, end: 7 }, { start: 6, end: 7 }]
    })
    expect(
      HighlightWords.getSplitedTextByIndex(
        wrapper.props().text,
        wrapper.props().index
      )
    ).toStrictEqual([
      { text: '0', highLight: false },
      { text: '1234567', highLight: true },
      { text: '89', highLight: false }
    ])
    expect(wrapper.find('.highlighted-words').length).toBe(1)
  })
})
