import {
  queryCustomerPhotoInput,
  queryHomeCustomerPhotos,
  mutationLikeCustomerPhotos,
  mutationDislikeCustomerPhotos,
  queryCustomerPhotosDetailsFirst,
  queryTheRelatedCustomerPhotos,
  queryCustomerPhotosInProduct,
  queryWebCustomerPhotosToteProduct,
  queryMyCustomerPhotos,
  queryMyCustomerPhotoInfo
} from 'src/app/queries/queries.js'

const setCustomerPhotoData = data => {
  return {
    type: 'SET:CUSTOMER:PHOTOT:DATA',
    data
  }
}

const queryCustomerPhoto = (input, success, error) => {
  return {
    type: 'API:QUERY:CUSTOMER:PHOTOT:INPUT',
    API: true,
    method: 'POST',
    url: '/api/query',
    success,
    error,
    data: {
      query: queryCustomerPhotoInput,
      variables: {
        ...input
      }
    }
  }
}

const getHomeCustomerPhotos = (input, success, error) => {
  return {
    type: 'API:QUERY:HOME:CUSTOMER:PHOTO',
    API: true,
    method: 'POST',
    url: '/api/query',
    success,
    error,
    data: {
      query: queryHomeCustomerPhotos,
      variables: {
        ...input
      }
    }
  }
}

const likeCustomerPhotos = (input, success, error) => {
  return {
    type: 'API:MUTATION:LIKE:CUSTOMER:PHOTO',
    API: true,
    method: 'POST',
    url: '/api/query',
    success,
    error,
    data: {
      query: mutationLikeCustomerPhotos,
      variables: {
        ...input
      }
    }
  }
}

const dislikeCustomerPhotos = (input, success, error) => {
  return {
    type: 'API:MUTATION:DISLIKE:CUSTOMER:PHOTO',
    API: true,
    method: 'POST',
    url: '/api/query',
    success,
    error,
    data: {
      query: mutationDislikeCustomerPhotos,
      variables: {
        ...input
      }
    }
  }
}

const fetchCustomerPhotosDetailsFirst = (input, success, error) => {
  return {
    type: 'API:UPDATE_CUSTOMSER_PHOTOS_DETAILS_FIRST',
    API: true,
    method: 'POST',
    url: '/api/query',
    success,
    error,
    data: {
      query: queryCustomerPhotosDetailsFirst,
      variables: {
        ...input
      }
    }
  }
}

const fetchTheRelatedCustomerPhotos = (input, success, error) => {
  return {
    type: 'API:UPDATE_CUSTOMSER_PHOTOS_DETAILS_LIST',
    API: true,
    method: 'POST',
    url: '/api/query',
    success,
    error,
    data: {
      query: queryTheRelatedCustomerPhotos,
      variables: {
        ...input
      }
    }
  }
}

const fetchCustomerPhotosInProduct = (input, success, error) => {
  return {
    type: 'API:CUSTOMER_PHOTOS_IN_PRODUCT',
    API: true,
    method: 'POST',
    url: '/api/query',
    success,
    error,
    data: {
      query: queryCustomerPhotosInProduct,
      variables: {
        ...input
      }
    }
  }
}

const fetchWebCustomerPhotosToteProduct = (input, success, error) => {
  return {
    type: 'API:CUSTOMER_PHOTOS_TOTE_PRODUCT',
    API: true,
    method: 'POST',
    url: '/api/query',
    success,
    error,
    data: {
      query: queryWebCustomerPhotosToteProduct,
      variables: {
        ...input
      }
    }
  }
}

const fetchMyCustomerPhotosInit = (input, success, error) => {
  return {
    type: 'API:MY_CUSTOMER_PHOTOS_INIT',
    API: true,
    method: 'POST',
    url: '/api/query',
    success,
    error,
    data: {
      query: queryMyCustomerPhotos,
      variables: {
        ...input
      }
    }
  }
}

const fetchMyCustomerPhotos = (input, success, error) => {
  return {
    type: 'API:MY_CUSTOMER_PHOTOS',
    API: true,
    method: 'POST',
    url: '/api/query',
    success,
    error,
    data: {
      query: queryMyCustomerPhotos,
      variables: {
        ...input
      }
    }
  }
}

const fetchMyCustomerPhotosInfo = (success, error) => {
  return {
    type: 'API:MY_CUSTOMER_PHOTO_INFO',
    API: true,
    method: 'POST',
    url: '/api/query',
    success,
    error,
    data: { query: queryMyCustomerPhotoInfo }
  }
}

const resetCustomerPhotosDetails = () => {
  return {
    type: 'RESET_CUSTOMSER_PHOTOS'
  }
}

export default {
  queryCustomerPhoto,
  getHomeCustomerPhotos,
  likeCustomerPhotos,
  dislikeCustomerPhotos,
  fetchCustomerPhotosDetailsFirst,
  fetchTheRelatedCustomerPhotos,
  resetCustomerPhotosDetails,
  setCustomerPhotoData,
  fetchCustomerPhotosInProduct,
  fetchWebCustomerPhotosToteProduct,
  fetchMyCustomerPhotos,
  fetchMyCustomerPhotosInit,
  fetchMyCustomerPhotosInfo
}
