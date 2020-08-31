import React from 'react'
import { useEffect } from 'react'
import memoize from 'memoize-one'
import Swiper from 'react-id-swiper'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import Actions from 'src/app/actions/actions'
import { Column } from 'src/app/constants/column'
import { getCategoryListWithSeason, getCategories } from 'src/app/lib/season'
import { FetchSeaonSummary } from '../../../actions/season'
import FilterTermItem from 'src/app/containers/filter_terms/filter_term_item'

import '../index.scss'
import 'src/assets/stylesheets/mobile/homepage.scss'
import 'src/assets/stylesheets/components/desktop/filter_terms/filter_terms.scss'

export function HomepageCategories(props) {
  const { collections, customer, dispatch } = props

  const getCategoryList = memoize((array, season) => {
    const order = getCategoryListWithSeason(season)
    const itemMap = array.reduce((p, c) => p.set(c.name, c), new Map())
    return order.map(row =>
      row.map(itemName => itemMap.get(itemName)).filter(a => !!a)
    )
  })

  if (_.isEmpty(collections) || !customer.id) return null

  let swiperDom = null
  const cacheId = 'HomepageStylesSwiper'

  useEffect(() => {
    dispatch(FetchSeaonSummary())
  }, [])

  const setTouchPosition = () => {
    if (swiperDom) {
      const initPosition = swiperDom.childNodes[0].style.transform
      sessionStorage.setItem(cacheId, initPosition)
    }
  }

  const params = {
    slidesPerView: '4.5',
    spaceBetween: 14,
    freeMode: true,
    on: {
      touchEnd: _.debounce(setTouchPosition, 100, { leading: true }),
      transitionEnd: _.debounce(setTouchPosition, 100, { leading: true })
    },
    observer: true,
    rebuildOnUpdate: true
  }

  const handleClick = (style, id) => async () => {
    const pathname = `/filterTerms/${style}/filterTerm/${id}`

    await dispatch(Actions.allproducts.clearProducts(pathname))
    const data = collections.find(i => i.id === id)
    const column = data && data.clothing ? Column.Clothing : Column.Accessory
    browserHistory.push({ pathname, query: { column } })
  }

  const getSwiper = swiper => {
    if (!swiper) return

    swiperDom = swiper.$el[0]
    const cacheStyle = sessionStorage.getItem(cacheId)
    if (cacheStyle && swiperDom) {
      swiperDom.childNodes[0].style.transform = cacheStyle
    }
  }

  const { season_summary, hideTitleIcon, showTitle } = props
  const currentSeason = season_summary && season_summary.basic_season_state

  const categoryList = getCategoryList(collections, currentSeason)
  const categories = getCategories(currentSeason)

  return (
    <div className="homepage-products-list clear-margin">
      {showTitle && (
        <div className="title-box">
          <div className="title">
            <span className="title-border" />
            <span className="title-text">热门分类</span>
            <span className="title-border" />
          </div>
          {!hideTitleIcon && <div className="title-img">CATEGORIES</div>}
        </div>
      )}
      <div className="styles-containers">
        <Swiper {...params} getSwiper={getSwiper}>
          {_.map(
            Array.from({
              length: Math.max(...categoryList.map(a => a.length))
            }),
            (__, index) => {
              const first = categoryList[0][index] || {}
              const last = categoryList[1][index] || {}
              const firstItem = categories[first.name]
              const secondItem = categories[last.name]
              return (
                <div key={index} className="styles-box">
                  {_.isEmpty(firstItem) ? (
                    <div className="placeholder-img" />
                  ) : (
                    <FilterTermItem
                      className={`styles-item ${
                        index === categoryList[0].length - 1 ? 'last' : ''
                      }`}
                      name={first.name}
                      handleClick={handleClick(firstItem.filterTerm, first.id)}
                      icon={firstItem.img}
                    />
                  )}
                  {!_.isEmpty(secondItem) ? (
                    <FilterTermItem
                      className={`styles-item ${
                        index === categoryList[1].length - 1 ? 'last' : ''
                      }`}
                      name={last.name}
                      handleClick={handleClick(secondItem.filterTerm, last.id)}
                      icon={secondItem.img}
                    />
                  ) : (
                    <React.Fragment key={index} />
                  )}
                </div>
              )
            }
          )}
        </Swiper>
      </div>
    </div>
  )
}

export default connect(state => {
  const { app, customer, season } = state
  const array = _.find(app.productsFilters, v => v.name === '品类')
  return {
    customer,
    season_summary: season.season_summary,
    collections: (array && array.product_search_slots) || []
  }
})(HomepageCategories)
