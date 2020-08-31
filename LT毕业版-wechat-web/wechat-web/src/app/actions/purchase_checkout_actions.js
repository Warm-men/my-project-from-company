import {
  checkoutToteProducts,
  totesCheckoutpreview
} from 'src/app/queries/queries'

const setPurchaseIds = ids => ({
  type: 'SET:PURCHASE:CHECKOUT:IDS',
  data: ids
})

const reSetPurchaseIds = () => ({
  type: 'RESET:PURCHASE:CHECKOUT:IDS'
})

const toteCheckoutProducts = ({
  tote_id,
  tote_product_ids,
  payment_method_id,
  promo_code,
  success
}) => ({
  type: 'API:CHECKOUT:TOTE:PRODUCTS',
  API: true,
  method: 'POST',
  url: '/api/query',
  success,
  data: {
    query: checkoutToteProducts,
    variables: {
      input: {
        tote_id,
        tote_product_ids,
        payment_method_id,
        promo_code
      }
    }
  }
})

const totesCheckoutPreview = ({
  promo_code = '',
  tote_id,
  tote_product_ids,
  order_id = '',
  disable_promo_code = false,
  success = () => {}
}) => {
  let variables = {
    promo_code,
    tote_id,
    tote_product_ids,
    order_id,
    disable_promo_code
  }
  if (_.isEmpty(order_id)) {
    delete variables['order_id']
  }
  return {
    type: 'API:TOTE:TRANSACTION:PREVIEW',
    API: true,
    method: 'POST',
    url: '/api/query',
    success,
    data: {
      query: totesCheckoutpreview,
      variables
    }
  }
}

export default {
  toteCheckoutProducts,
  totesCheckoutPreview,
  setPurchaseIds,
  reSetPurchaseIds
}
