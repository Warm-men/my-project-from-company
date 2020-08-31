import { connect } from 'react-redux'
import { useEffect } from 'react'
import Actions from 'src/app/actions/actions.js'
import ToteSwapCollections from './tote_swap_collections'
import * as storage from 'src/app/lib/storage.js'

function ToteSwapCollectionsContainer(props) {
  useEffect(() => {
    const { collections, dispatch } = props
    if (_.isEmpty(collections)) {
      storage.remove('CollectionsSelectId')
      dispatch(Actions.searchProductContext.searchProduct('tote_swap_20181211'))
    }
    dispatch(Actions.allproducts.clearProducts('/customize/closet'))
    dispatch(Actions.allproducts.resetFilters())
  }, [])
  return <ToteSwapCollections {...props} />
}

function mapStateToProps(state) {
  return {
    collections: state.toteSwap.collections,
    closetProductIds: state.closet.productIds,
    collectionsProducts: state.toteSwap.collectionsProducts,
    customer: state.customer
  }
}

export default connect(mapStateToProps)(ToteSwapCollectionsContainer)
