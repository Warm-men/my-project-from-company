import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import Actions from 'src/app/actions/actions.js'
import TopCard from './top_card'
import FilterCard from './filter_card'
import Affixed from './affix'
import './index.scss'

const getState = state => ({
  allproducts: state.allproducts,
  myCloset: state.myCloset
})
const ClosetHeader = props => {
  const {
    allproducts,
    dispatch,
    perfect_closet_stats,
    perfectCloset,
    location,
    sort,
    onChangeSwitchValue,
    myCloset
  } = props
  const { filters, filters_occasion, the_second_level } = allproducts
  const { perfect_closet_filter, wishing_closet_filter } = myCloset
  const filter_terms = perfectCloset
    ? perfect_closet_filter
    : wishing_closet_filter
  const {
    clothing_count,
    accessory_count,
    product_count
  } = perfect_closet_stats

  const refecthCloset = new_filter_terms => {
    dispatch(Actions.allproducts.clearProductsAndFilterTerms(location.pathname))
    const props = [
      {
        ...filters,
        sort,
        page: 1,
        filter_terms: [],
        color_families: [],
        temperature: []
      },
      filters_occasion,
      the_second_level,
      new_filter_terms
    ]
    if (perfectCloset) {
      dispatch(Actions.mycloset.fetchPerfectCloset(...props))
      dispatch(Actions.mycloset.setPerfectClosetFilter(new_filter_terms))
    } else {
      dispatch(Actions.mycloset.fetchWishingCloset(...props))
      dispatch(Actions.mycloset.setWishingClosetFilter(new_filter_terms))
    }
  }

  const _onChangeSwitchValue = newSort => {
    onChangeSwitchValue && onChangeSwitchValue(newSort)
    dispatch(Actions.allproducts.clearProductsAndFilterTerms(location.pathname))
    const props = [
      { ...filters, sort: newSort, page: 1 },
      filters_occasion,
      the_second_level,
      filter_terms
    ]
    if (perfectCloset) {
      dispatch(Actions.mycloset.fetchPerfectCloset(...props))
    } else {
      dispatch(Actions.mycloset.fetchWishingCloset(...props))
    }
  }

  const showFilterModal = filter_terms => {
    browserHistory.push({
      pathname: '/filter_modal',
      query: { filter_terms }
    })
  }

  const goToPerfectCloset = async filter_terms => {
    await dispatch(
      Actions.allproducts.clearProductsAndFilterTerms(location.pathname)
    )
    await dispatch(Actions.mycloset.setPerfectClosetFilter(filter_terms))
    browserHistory.push({
      pathname: '/perfect_closet',
      query: {
        perfect_filter_terms: filter_terms
      }
    })
  }
  return (
    <div className="Closet">
      <div className="center">
        {!perfectCloset &&
          (product_count !== 0 ||
            clothing_count !== 0 ||
            accessory_count !== 0) && (
            <TopCard
              perfect_closet_stats={perfect_closet_stats}
              goToPerfectCloset={goToPerfectCloset}
            />
          )}
        <Affixed>
          <div className="FilterCard">
            <FilterCard
              refecthCloset={refecthCloset}
              onChangeSwitchValue={_onChangeSwitchValue}
              filter_terms={filter_terms}
              perfectCloset={perfectCloset}
              location={location}
              showFilterModal={showFilterModal}
              sort={sort}
            />
          </div>
        </Affixed>
      </div>
    </div>
  )
}

export default connect(getState)(ClosetHeader)
