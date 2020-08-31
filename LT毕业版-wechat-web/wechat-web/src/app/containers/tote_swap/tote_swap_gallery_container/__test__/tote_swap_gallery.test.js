import { shallow } from 'src/utilsTests'
import { Link } from 'react-router'
import PageHelmet from 'src/app/lib/pagehelmet'
import ToteSwapGallery from '../tote_swap_gallery'

describe('tote swap gallery test', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(ToteSwapGallery, {
      primaryGallery: [],
      gallery: '',
      filters: {
        filter_terms: []
      },
      more: false,
      router: {
        location: {
          state: {}
        }
      },
      loading: false,
      isInCloset: false,
      showFilterModal: jest.fn(),
      fetchProducts: jest.fn(),
      clearProducts: jest.fn(),
      handleGoback: jest.fn(),
      iscollectionsList: false,
      analyzeSlug: 'collections',
      changeAnalyzeSlug: '',
      isHideHelmet: false,
      location: {
        pathname: '/closet'
      },
      customer: {
        subscription: {
          id: 2
        }
      },
      isVacation: false
    })
  })

  it('render classname === tote-swap-products-container', () => {
    expect(wrapper.find('.tote-swap-products-container').exists()).toBe(true)
  })

  it('PageHelmet render', () => {
    expect(
      wrapper.containsMatchingElement(
        <PageHelmet title="帮我推荐" link="/closet" />
      )
    ).toBe(true)
    wrapper.setProps({
      isHideHelmet: true
    })
    expect(
      wrapper.containsMatchingElement(
        <PageHelmet title="帮我推荐" link="/closet" />
      )
    ).toBe(false)
  })

  it('classname === corporation-btn-container', () => {
    expect(wrapper.find('.corporation-btn-container').length).toBe(1)
  })

  it('test Link url === /new_totes', () => {
    const link = (
      <Link to={'/new_totes'} className="corporation-btn">
        <span className="corporation-btn-text">关闭</span>
      </Link>
    )
    expect(wrapper.containsMatchingElement(link)).toBe(true)
  })

  it('test Link url === /isVacation', () => {
    wrapper.setProps({
      isVacation: true
    })
    const link = (
      <Link to={'/new_totes'} className="corporation-btn">
        <span className="corporation-btn-text">结束换装</span>
      </Link>
    )
    expect(wrapper.containsMatchingElement(link)).toBe(true)
  })

  it('test Link url === /home', () => {
    const link = (
      <Link to={'/home'} className="corporation-btn">
        <span className="corporation-btn-text">关闭</span>
      </Link>
    )
    wrapper.setProps({
      customer: {}
    })
    expect(wrapper.containsMatchingElement(link)).toBe(true)
  })

  it('collections list show goback button', () => {
    wrapper.setProps({
      iscollectionsList: true,
      gallery: 'collections'
    })
    expect(wrapper.find('.goback').exists()).toBe(true)
  })

  it('not collections list show .collections-btn button', () => {
    wrapper.setProps({
      iscollectionsList: false,
      gallery: 'collections'
    })
    expect(wrapper.find('.collections-btn').exists()).toBe(true)
  })

  it('collections list show scroll top button', () => {
    wrapper.setProps({
      gallery: 'collections'
    })
    expect(wrapper.find('.scroll-to-top').exists()).toBe(true)
  })
})
