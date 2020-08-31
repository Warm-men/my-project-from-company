import _ from 'lodash'
import Stores from '../../../stores/stores'
import { QNetwork, SERVICE_TYPES } from '../../services/services'
//获取关联单品
const getRelatedProducts = (photos, filterProduct) => {
  let array = []
  photos.forEach(item => {
    const { stickers } = item
    if (stickers) {
      array = [...array, ...stickers]
    }
  })
  const relatedProducts = []
  _.uniqBy(array, item => {
    return item.product.id
  }).forEach(i => {
    if (filterProduct) {
      if (filterProduct.id !== i.product.id) {
        relatedProducts.push(i.product)
      }
    } else {
      relatedProducts.push(i.product)
    }
  })
  return relatedProducts
}

// 检查是否可以提交
const checkSubmit = (content, photos) => {
  if (content.length === 0) {
    Stores.appStore.showToastWithOpacity('请填写晒单内容')
    return
  }
  if (content.length < 6) {
    Stores.appStore.showToastWithOpacity('需要超过6个字')
    return
  }
  if (!photos.length) {
    Stores.appStore.showToastWithOpacity('请先上传至少一张图片')
    return
  }
  const uploadingPhotos = photos.filter(item => {
    return !item.upload_url
  })
  if (uploadingPhotos.length) {
    return
  }
  return true
}

//更新锚点
const updateStickers = (array, customerPhotos) => {
  const photos = [...customerPhotos]
  array.forEach(item => {
    const { uri, stickers } = item
    const index = photos.findIndex(i => {
      return i.uri === uri
    })
    if (index !== -1) {
      const newPhoto = { ...photos[index], stickers }
      photos.splice(index, 1, newPhoto)
    }
  })
  return photos
}

//更新标签
const updateSelectedStyleTags = (tag, tags, maxLength = 2) => {
  let array = [...tags]
  const index = tags.findIndex(item => tag.id === item.id)

  if (index === -1) {
    if (maxLength === -1 || array.length < maxLength) {
      array.push(tag)
    } else {
      Stores.appStore.showToastWithOpacity(`最多只能选择${maxLength}个风格标签`)
    }
  } else {
    array.splice(index, 1)
  }
  return array
}

const getCreateCustomerPhotoInput = (params, success, error) => {
  const { content, topicId, tags, customerPhotos } = params

  //照片
  const photos = []
  customerPhotos.forEach(item => {
    const { upload_url, width, height, stickers } = item
    const obj = { width, height, url: upload_url }

    const array =
      stickers &&
      stickers.map(i => {
        const { degree, anchor_x, anchor_y, product } = i
        return { degree, anchor_x, anchor_y, product_id: product.id }
      })
    obj.stickers = array
    photos.push(obj)
  })
  //关联单品
  const { toteProduct, toteProducts } = params
  let products = []

  if (toteProduct && toteProducts) {
    products = [{ tote_product_id: toteProduct.id }]
    const relatedProducts = getRelatedProducts(
      customerPhotos,
      toteProduct.product
    )
    relatedProducts.forEach(item => {
      const a = toteProducts.find(i => {
        return item.id === i.product.id
      })
      if (a) {
        products.push({ tote_product_id: a.id })
      } else {
        products.push({ product_id: item.id })
      }
    })
  } else {
    const relatedProducts = getRelatedProducts(customerPhotos)
    relatedProducts.forEach(item => {
      products.push({ product_id: item.id })
    })
  }

  //标签
  const style_tag_ids = []
  tags.forEach(item => {
    style_tag_ids.push(item.id)
  })
  //话题
  const share_topic_id = topicId

  const input = { content, photos, products, style_tag_ids, share_topic_id }
  return input
}

const updateCustomerPhotoCenterData = () => {
  QNetwork(
    SERVICE_TYPES.customerPhotos.QUERY_MY_CUSTOMER_CENTER,
    {},
    response => {
      const { me } = response.data
      if (me) {
        Stores.currentCustomerStore.customer_photo = me.customer_photo
      }
    }
  )
}

export {
  getRelatedProducts,
  checkSubmit,
  updateStickers,
  updateSelectedStyleTags,
  getCreateCustomerPhotoInput,
  updateCustomerPhotoCenterData
}
