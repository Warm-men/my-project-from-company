import Actions from 'src/app/actions/actions.js'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { useState, useEffect } from 'react'
import NoneShare from './NoneShare'
import ShareList from './share_list'
import PageHelmet from 'src/app/lib/pagehelmet'
import GotoPagesHoc from 'src/app/containers/share_list/HOC/goto-pages'
import initScrollTop from 'src/app/lib/init_scroll_to_top.js'
import './index.scss'

function getSttae(state) {
  return { ...state.share_list, customer: state.customer }
}

export default connect(getSttae)(GotoPagesHoc(ShareListContainer))
function ShareListContainer(props) {
  const [isFinishFetch, setIsFinishFetch] = useState(false)
  const { dispatch, page, location } = props
  const { tote_id, isTotesPgae } = location.query

  useEffect(() => {
    initShareListProductData()
    fetchDeliverTotes()
    fetchPastDeliverTotes()
    fetchCustomerPhotoInput()
  }, [])

  const goToShareProduct = (
    id,
    product_id,
    tote_id,
    hasShare,
    customer_photo_id
  ) => async () => {
    await dispatch(Actions.totes.resetToteProduct())
    await dispatch(Actions.relatedProduct.updateRelatedProduct([]))
    await dispatch(Actions.customerPhotosSummary.resetCustomerPhotosDetails())
    if (hasShare) {
      if (customer_photo_id !== null) {
        browserHistory.push({
          pathname: '/customer_photos',
          query: { customer_photo_id: customer_photo_id }
        })
      }
    } else {
      browserHistory.push({
        pathname: `/share_photo/${id}/${product_id}/${tote_id}`,
        query: { product_id, tote_id, id }
      })
    }
  }
  const onScrollToBottom = () => {
    dispatch(Actions.totes.fetchPastDeliverTotes({ page, filter: 'delivered' }))
  }

  const linkToProducts = (id, column_name) => () => {
    browserHistory.push({ pathname: `/products/${id}`, state: { column_name } })
  }

  const initShareListProductData = () => {
    dispatch(Actions.customerPhotosSummary.setCustomerPhotoData({}))
  }

  const fetchDeliverTotes = () => {
    dispatch(
      Actions.totes.fetchDeliverTotes({ page: 1, filter: 'delivered' }, () =>
        setIsFinishFetch(true)
      )
    )
  }

  const fetchPastDeliverTotes = () => {
    dispatch(
      Actions.totes.fetchPastDeliverTotes({ page, filter: 'delivered' }, () =>
        initScrollTop(0)
      )
    )
  }

  const fetchCustomerPhotoInput = () => {
    dispatch(
      Actions.customerPhotosSummary.queryCustomerPhoto(
        {},
        () => {},
        fetchCustomerPhotoInput
      )
    )
  }

  const getNewCurrentTotes = (current_totes = []) => {
    if (_.isEmpty(current_totes)) {
      return []
    }
    if (tote_id && !_.isEmpty(current_totes)) {
      return current_totes.filter(v => v.id === Number(tote_id))
    } else {
      return [current_totes[0]]
    }
  }

  const {
    current_totes,
    delivered_totes,
    additional_past_totes_available
  } = props
  const past_totes = isTotesPgae ? [] : delivered_totes
  return (
    <div>
      <PageHelmet title="晒单" link="/share_list" />
      {!isFinishFetch ? null : _.isEmpty(current_totes) &&
        _.isEmpty(delivered_totes) ? (
        <NoneShare />
      ) : (
        <ShareList
          additional_past_totes_available={additional_past_totes_available}
          isLoading={props.isLoading}
          past_totes={past_totes}
          current_totes={getNewCurrentTotes(current_totes)}
          onScrollToBottom={onScrollToBottom}
          linkToProducts={linkToProducts}
          goToShareProduct={goToShareProduct}
        />
      )}
    </div>
  )
}
