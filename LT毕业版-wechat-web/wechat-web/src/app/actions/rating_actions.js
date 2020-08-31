import {
  rateToteQuery,
  rateProductQuery,
  rateProductsQuery,
  rateProductsV2Query,
  updateRatingImage,
  creatCustomerPhotoQuery
} from 'src/app/queries/queries.js'

const rateTote = (tote_rating, toteId, success) => {
  const { ...rest } = tote_rating
  return {
    type: 'API:RATINGS:SUBMIT_TOTE_RATING',
    API: true,
    method: 'POST',
    url: '/api/query',
    data: {
      query: rateToteQuery,
      variables: {
        tote_rating: {
          ...rest,
          tote_id: toteId
        }
      }
    },
    success
  }
}

const updateToteRating = toteRating => {
  return {
    type: 'RATINGS:UPDATE_TOTE_RATING',
    data: {
      toteRating
    }
  }
}

const rateProduct = (rating, product_id, tote_id, tote_product_id, success) => {
  return {
    type: 'API:RATINGS:RATE_PRODUCT',
    API: true,
    method: 'POST',
    url: '/api/query',
    data: {
      query: rateProductQuery,
      variables: {
        rating: {
          ...rating,
          product_id,
          tote_id,
          tote_product_id
        }
      }
    },
    success
  }
}

const rateProducts = (ratings, tote_id, success, other_product_feedback) => {
  const data = {
    tote_id,
    ratings,
    other_product_feedback
  }
  return {
    type: 'API:RATINGS:RATE_PRODUCTS',
    API: true,
    method: 'POST',
    url: '/api/query',
    data: {
      query: rateProductsQuery,
      variables: {
        input: data
      }
    },
    success
  }
}

const rateProductsV2 = (ratings, tote_id, success) => {
  const data = {
    tote_id,
    ratings
  }
  return {
    type: 'API:RATINGS:RATE_PRODUCTS',
    API: true,
    method: 'POST',
    url: '/api/query',
    data: {
      query: rateProductsV2Query,
      variables: {
        input: data
      }
    },
    success
  }
}

const updateImage = (input, tote_id, success, error) => {
  return {
    type: 'API:UPDATE:IMAGE',
    API: true,
    method: 'POST',
    url: '/api/query',
    data: {
      tote_id,
      query: updateRatingImage,
      variables: {
        input: input
      }
    },
    success,
    error
  }
}

const createCustomerPhoto = (input, data, success, error) => {
  return {
    type: 'API:CREATE:CUSTOMER:PHOTO',
    API: true,
    method: 'POST',
    url: '/api/query',
    data: {
      query: creatCustomerPhotoQuery,
      tote_id: data.tote_id,
      tote_product_id: data.tote_product_id,
      variables: {
        input: input
      }
    },
    success,
    error
  }
}

const setRatingToteId = id => {
  return {
    type: 'RATINGS:SET_RATING_TOTEID',
    id
  }
}

const resetRatingStore = () => ({
  type: 'RESET:RATING:STORE'
})

export default {
  rateProduct,
  rateTote,
  updateToteRating,
  updateImage,
  setRatingToteId,
  rateProducts,
  resetRatingStore,
  rateProductsV2,
  createCustomerPhoto
}
