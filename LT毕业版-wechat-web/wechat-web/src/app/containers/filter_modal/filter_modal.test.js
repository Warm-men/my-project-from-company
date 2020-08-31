// import { shallow } from 'src/utilsTests'
import { shallow } from 'enzyme'
import configureStore from 'redux-mock-store'
import OccasionFilter from './occsion_filter'
import FilterModal from './index'
import TheSecondLevelFilter from './the_second_level_filter'
import thunk from 'src/app/store/thunk_middleware.js'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('test FilterModal component', () => {
  let wrapper, dispatch
  beforeEach(() => {
    dispatch = jest.fn()
    const mock = mockStore({
      allproducts: {
        filters: {
          page: 1,
          filter_terms: [411],
          color_families: [],
          temperature: [],
          sort: `season_first_and_swappable_newest`
        },
        the_second_level: [],
        filters_occasion: []
      },
      app: {
        productsFilters: [
          {
            id: 52,
            name: '品类',
            parent_slot_id: null,
            product_search_slots: [
              {
                clothing: true,
                id: 411,
                name: '连衣裙',
                selected: false,
                sign: null,
                slug: null
              }
            ]
          },
          {
            id: 53,
            name: '裙型',
            parent_slot_id: 411,
            product_search_slots: [
              {
                clothing: true,
                id: 430,
                name: 'A字裙',
                selected: false,
                sign: null,
                slug: null
              }
            ]
          }
        ]
      }
    })
    wrapper = shallow(
      <FilterModal
        store={mock}
        location={{
          query: { isOccation: true }
        }}
        dispatch={dispatch}
      />
    ).dive()
  })

  it('test component render', () => {
    expect(wrapper.find('.browse-collection-filter-modal').length).toBe(1)
  })

  it('品类只有一个时显示二级分类', () => {
    expect(wrapper.containsMatchingElement(<TheSecondLevelFilter />)).toBe(true)
  })

  it('filter occasion items', () => {
    expect(wrapper.containsMatchingElement(<OccasionFilter />)).toBe(false)
    wrapper.setProps({
      allproducts: {
        filters: {
          page: 1,
          filter_terms: [],
          color_families: [],
          temperature: [],
          sort: `season_first_and_swappable_newest`
        }
      }
    })
    expect(wrapper.containsMatchingElement(<TheSecondLevelFilter />)).toBe(
      false
    )
  })

  it('当没有选择的时候重置不能点击', () => {
    expect(wrapper.find('.not-reset').length).toBe(0)
  })

  it('当有选择的时候重置点击', () => {
    expect(wrapper.find('.not-reset').length).toBe(0)
    expect(wrapper.find('.reset-btn').length).toBe(1)
    wrapper.find('.reset-btn').simulate('click')
  })
})
