import { shallow } from 'src/utilsTests'
import TheSecondLevelFilter from './index'

describe('test second level filter component', () => {
  let wrapper, setFilters
  beforeEach(() => {
    setFilters = jest.fn()
    wrapper = shallow(TheSecondLevelFilter, {
      title: '裙类',
      ITEMS: [
        {
          id: 1,
          name: '风衣'
        },
        {
          id: 2,
          name: '大衣'
        },
        {
          id: 3,
          name: '外套'
        }
      ],
      selectedOptions: [],
      setFilters
    })
  })

  it('test render, .title text', () => {
    expect(wrapper.find('.title').length).toBe(1)
    expect(wrapper.find('.title').text()).toBe('裙类')
  })
  it('test render, .title filter-term', () => {
    expect(wrapper.find('.filter-term').length).toBe(3)
    expect(
      wrapper
        .find('.filter-term')
        .at(0)
        .text()
    ).toBe('风衣')
    expect(
      wrapper
        .find('.filter-term')
        .at(1)
        .text()
    ).toBe('大衣')
    expect(
      wrapper
        .find('.filter-term')
        .at(2)
        .text()
    ).toBe('外套')
  })
  it('test selected elements', () => {
    expect(wrapper.find('.selected').exists()).toBe(false)
    wrapper.setProps({
      selectedOptions: [1]
    })
    expect(wrapper.find('.selected').exists()).toBe(true)
  })

  it('test options click func---setFilters', () => {
    wrapper
      .find('.filter-term')
      .at(0)
      .simulate('click')

    expect(setFilters.mock.calls.length).toBe(3)

    expect(setFilters.mock.calls[0][0]).toEqual({
      filter_flag: 'second_level',
      id: 1
    })
    expect(setFilters.mock.calls[1][0]).toEqual({
      filter_flag: 'second_level',
      id: 2
    })
    expect(setFilters.mock.calls[2][0]).toEqual({
      filter_flag: 'second_level',
      id: 3
    })
  })
})
