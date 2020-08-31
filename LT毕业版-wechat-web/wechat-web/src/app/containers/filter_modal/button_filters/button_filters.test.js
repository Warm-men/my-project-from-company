import { shallow } from 'src/utilsTests'
import { WEATHER_LABELS, ALL_FAMILIES_LABELS } from 'src/app/lib/filters.js'
import ButtonFilters, { ColorSwatch } from './index'

describe('test button filter component, color', () => {
  let wrapper, setFilters
  beforeEach(() => {
    setFilters = jest.fn()
    wrapper = shallow(ButtonFilters, {
      title: '颜色',
      options: ALL_FAMILIES_LABELS,
      selectedOptions: [],
      setFilters,
      filterType: 'color_families'
    })
  })

  it('test render, .title text', () => {
    expect(wrapper.find('.title').length).toBe(1)
    expect(wrapper.find('.title').text()).toBe('颜色')
  })
  it('test render, .title filter-swatch', () => {
    expect(wrapper.find('.filter-swatch').length).toBe(15)
  })
  it('test selected elements', () => {
    expect(wrapper.find('.selected').exists()).toBe(false)
    wrapper.setProps({
      selectedOptions: ['black']
    })
    expect(wrapper.find('.selected').exists()).toBe(true)
  })

  it('test color options click func---setFilters', () => {
    wrapper
      .find('.filter-swatch')
      .at(0)
      .simulate('click')

    expect(setFilters.mock.calls.length).toBe(15)
  })
})

describe('test button filter component, filter terms', () => {
  let wrapper, setFilters
  beforeEach(() => {
    setFilters = jest.fn()
    wrapper = shallow(ButtonFilters, {
      title: '品类',
      options: [
        {
          clothing: false,
          id: 411,
          name: '连衣裙',
          selected: false,
          sign: null,
          slug: null
        }
      ],
      selectedOptions: [],
      setFilters,
      filterType: 'filter_terms'
    })
  })

  it('test render, .title text', () => {
    expect(wrapper.find('.title').length).toBe(1)
    expect(wrapper.find('.title').text()).toBe('品类')
  })
  it('test render, .title filter-term', () => {
    expect(wrapper.find('.filter-term').length).toBe(1)
    expect(
      wrapper
        .find('.filter-term')
        .at(0)
        .text()
    ).toBe('连衣裙')
  })
  it('test selected elements', () => {
    expect(wrapper.find('.selected').exists()).toBe(false)
    wrapper.setProps({
      selectedOptions: [411]
    })
    expect(wrapper.find('.selected').exists()).toBe(true)
  })

  it('test filter terms options click func---setFilters', () => {
    wrapper
      .find('.filter-term')
      .at(0)
      .simulate('click')
    expect(setFilters.mock.calls.length).toBe(1)
  })
})

describe('test button filter component, tem', () => {
  let wrapper, setFilters
  beforeEach(() => {
    setFilters = jest.fn()
    wrapper = shallow(ButtonFilters, {
      title: '天气',
      options: WEATHER_LABELS,
      selectedOptions: [],
      setFilters,
      filterType: 'temperature'
    })
  })

  it('test render, .title text', () => {
    expect(wrapper.find('.title').length).toBe(1)
    expect(wrapper.find('.title').text()).toBe('天气')
  })
  it('test render, .title filter-term', () => {
    expect(wrapper.find('.filter-term').length).toBe(3)
    expect(
      wrapper
        .find('.filter-term')
        .at(0)
        .text()
    ).toBe('寒冷')
  })
  it('test selected elements', () => {
    expect(wrapper.find('.selected').exists()).toBe(false)
    wrapper.setProps({
      selectedOptions: ['cold']
    })
    expect(wrapper.find('.selected').exists()).toBe(true)
  })

  it('test filter terms options click func---setFilters', () => {
    wrapper
      .find('.filter-term')
      .at(0)
      .simulate('click')
    expect(setFilters.mock.calls.length).toBe(3)
  })
})

describe('test ColorSwatch component render', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(ColorSwatch, {
      option: 'mild',
      value: '寒冷'
    })
  })

  it('test filter-swatch-mild', () => {
    expect(wrapper.find('.filter-swatch-mild').exists()).toBe(true)
    expect(wrapper.find('.filter-swatch-color').exists()).toBe(true)
  })

  it('test filter-swacht-label className text', () => {
    expect(wrapper.find('.filter-swatch-label').text()).toEqual('寒冷')
  })
})
