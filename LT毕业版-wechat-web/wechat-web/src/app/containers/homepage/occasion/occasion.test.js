import { mount, shallow } from 'src/utilsTests'
import Occasion, { SliderItem } from './index'

describe('test occasion', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(Occasion, {
      occasion: []
    })
  })

  it('not have data, render nothing', () => {
    expect(wrapper.find('.homepage-products-list').exists()).toBe(false)
  })

  it('have data, render list', () => {
    wrapper.setProps({
      occasion: [
        {
          slug: 'tailor',
          name: '正装',
          log: 'https://static.letote.cn/xxx.png',
          photo: 'https://static.letote.cn/xxx.png',
          description: '正装xxx',
          themes: [
            {
              slug: 'exclusive',
              name: '知性优雅',
              log: 'https://static.letote.cn/xxx.png',
              photo: 'https://static.letote.cn/xxx.png',
              description: '知性优雅xxx'
            },
            {
              slug: 'professional office',
              name: '商务精英',
              log: 'https://static.letote.cn/xxx.png',
              photo: 'https://static.letote.cn/xxx.png',
              description: '商务精英xxx'
            }
          ]
        },
        {
          slug: 'causal',
          name: '休闲',
          log: 'https://static.letote.cn/xxx.png',
          photo: 'https://static.letote.cn/xxx.png',
          description: '休闲xxx',
          themes: [
            {
              slug: 'exclusive',
              name: '知性优雅',
              log: 'https://static.letote.cn/xxx.png',
              photo: 'https://static.letote.cn/xxx.png',
              description: '知性优雅xxx'
            },
            {
              slug: 'professional office',
              name: '商务精英',
              log: 'https://static.letote.cn/xxx.png',
              photo: 'https://static.letote.cn/xxx.png',
              description: '商务精英xxx'
            }
          ]
        }
      ]
    })
    expect(wrapper.containsMatchingElement(<SliderItem />)).toBe(true)
  })
})

jest.dontMock('./index')
describe('test SliderItem', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(SliderItem, {
      occasion_item: {
        name: 'one',
        slug: 'slug',
        themes: [
          {
            slug: 'exclusive',
            name: '知性优雅',
            log: 'https://static.letote.cn/xxx.png',
            photo: 'https://static.letote.cn/xxx.png',
            description: '知性优雅xxx'
          },
          {
            slug: 'professional office',
            name: '商务精英',
            log: 'https://static.letote.cn/xxx.png',
            photo: 'https://static.letote.cn/xxx.png',
            description: '商务精英xxx'
          }
        ]
      },
      linkToOccasionDetail: jest.fn()
    })
  })
  it('test render slider item dom ---- slider-item', () => {
    expect(wrapper.find('.slider-item').exists()).toBe(true)
  })
})
