import { withRouter, browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { useEffect } from 'react'
import Actions from 'src/app/actions/actions.js'
import PageHelmet from 'src/app/lib/pagehelmet'
import Gallery from 'src/app/containers/tote_swap/tote_swap_gallery_container/tote_swap_gallery'
import './index.scss'

function mapStateToProps(state) {
  return {
    closetProductIds: state.closet.productIds,
    collectionsProducts: state.toteSwap.collectionsProducts,
    customer: state.customer
  }
}

export default connect(mapStateToProps)(withRouter(ToteSwapGalleryContainer))
function ToteSwapGalleryContainer(props) {
  const filters = { page: 1, per_page: 20 }
  const { params, location, dispatch } = props

  useEffect(() => {
    const { collectionsProducts } = props
    if (_.isEmpty(collectionsProducts[params.id]) && params.id) {
      fetchProducts()
    }
  }, [])

  const toggleCloset = (id, reportData) => {
    const inCloset = _.includes(props.closetProductIds, id)
    if (inCloset) {
      dispatch(Actions.closet.remove([id]))
    } else {
      dispatch(Actions.closet.add([id], reportData))
    }
  }

  const fetchProducts = () => {
    dispatch(
      Actions.collectionsProducts.collectionsProducts(
        {
          product_search_sections: [
            {
              product_search_slots: [{ id: Number(params.id), selected: true }]
            }
          ]
        },
        filters
      )
    )
  }

  const getLinkUrl = id => `/customize/product/${id}`

  const { collectionsProducts, closetProductIds } = props
  const { query } = location
  return (
    <div className="collections-products">
      <PageHelmet title={query ? query.title : '换装'} />
      <Gallery
        {...props}
        toggleCloset={toggleCloset}
        closetProductIds={closetProductIds}
        primaryGallery={collectionsProducts[params.id]}
        fetchProducts={() => {}}
        getLinkUrl={getLinkUrl}
        loading={false}
        iscollectionsList={true}
        gallery="collections"
        filters={filters}
        more={false}
        handleGoback={browserHistory.goBack}
        analyzeSlug={location.query ? location.query.slug : null}
        isHideHelmet={!_.isEmpty(query)}
      />
    </div>
  )
}
