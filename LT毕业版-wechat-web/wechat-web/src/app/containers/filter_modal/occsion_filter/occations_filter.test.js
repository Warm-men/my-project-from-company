import { shallow } from 'src/utilsTests'
import OccasionFilter from './index'

describe('test occation filter component', () => {
  let wrapper, setFilters
  beforeEach(() => {
    setFilters = jest.fn()
    wrapper = shallow(OccasionFilter, {
      title: '场合',
      options: [
        {
          clothing: false,
          id: 455,
          name: '高端商务',
          selected: false,
          sign: null,
          slug: null
        }
      ],
      selectedOptions: [],
      setFilters
    })
  })

  it('test render, .title text', () => {
    expect(wrapper.find('.title').length).toBe(1)
    expect(wrapper.find('.title').text()).toBe('场合')
  })
  it('test render, .title filter-term', () => {
    expect(wrapper.find('.filter-term').length).toBe(1)
    expect(
      wrapper
        .find('.filter-term')
        .at(0)
        .text()
    ).toBe('高端商务')
  })
  it('test selected elements', () => {
    expect(wrapper.find('.selected').exists()).toBe(false)
    wrapper.setProps({
      selectedOptions: [455]
    })
    expect(wrapper.find('.selected').exists()).toBe(true)
  })

  it('test options click func---setFilters', () => {
    wrapper
      .find('.filter-term')
      .at(0)
      .simulate('click')

    expect(setFilters.mock.calls.length).toBe(1)

    expect(setFilters.mock.calls[0][0]).toEqual({
      filter_flag: 'occasion_filter',
      id: 455
    })
  })
})
