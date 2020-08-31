import Stores from '../../../stores/stores'
import { Client } from '../../services/client'
import { Column } from '../add_to_closet_status'
/*
   内存存储数据上限
*/
const DAQ_SENDER_COUNT = 1000

const DAQ_URL =
  Client.ORIGIN.indexOf('wechat-staging') !== -1
    ? 'https://r-staging.letote.cn'
    : Client.ORIGIN.indexOf('wechat-dev') !== -1
    ? 'https://r-dev.letote.cn'
    : 'https://r.letote.cn'

const DAQ_TYPE = {
  Product: 'Product',
  Look: 'Look',
  CustomerPhoto: 'CustomerPhoto',
  Collection: 'Collection'
}

const isEnableTrackScreen = screenName => {
  let bool = false
  switch (screenName) {
    case 'Clothing':
    case 'Accessory':
    case 'MyCloset':
    case 'Details':
    case 'ProductsOccasion':
    case 'SwapCollection':
    case 'SwapCloset':
    case 'SelectionProducts':
    case 'OccasionCollection':
    case 'Brand':
    case 'Collection':
    case 'NewArrivalHomeDetail':
    case 'CustomerPhotoDetails':
    case 'SatisfiedCloset':
    case 'SwapSatisfiedCloset':
    case 'LookBooks':
    case 'SearchProductResult':
    case 'Home':
      bool = true
      break
    default:
      bool = false
      break
  }
  return bool
}

const getCurrentItemKey = (id, index, column) => {
  const key = id + '_' + index
  return key
}

const viewableItemsChanged = (changed, getReportData) => {
  const { currentCustomerStore, daqStore } = Stores
  if (!currentCustomerStore.enableAutoTrack) {
    return
  }
  const currentRecordCount = daqStore.viewableItemsRecord.length
  if (currentRecordCount >= DAQ_SENDER_COUNT) {
    const currentTime = new Date()
    postRecord(currentTime)
  }

  const array = changed.map(i => {
    const typename = i.item.__typename
    switch (typename) {
      case 'BrowseCollection':
        return { ...i, type: DAQ_TYPE.Collection }
        break
      case 'Look':
        return { ...i, type: DAQ_TYPE.Look }
        break
      case 'CustomerPhotoV2':
        return { ...i, type: DAQ_TYPE.CustomerPhoto }
        break
      default:
        return i
    }
  })
  daqStore.updateViewableItems(array, currentCustomerStore.id, getReportData)
}

const viewableDetails = (id, column) => {
  const { currentCustomerStore, daqStore } = Stores
  if (!currentCustomerStore.enableAutoTrack) {
    return
  }
  const currentRecordCount = daqStore.viewableItemsRecord.length
  if (currentRecordCount >= DAQ_SENDER_COUNT) {
    const currentTime = new Date()
    postRecord(currentTime)
  }
  const data = { id, column, userId: currentCustomerStore.id }
  daqStore.viewableDetails(data)
}

const viewableItemsCustomerPhotos = (changed, getReportData) => {
  const { currentCustomerStore, daqStore } = Stores
  if (!currentCustomerStore.enableAutoTrack) {
    return
  }
  const currentRecordCount = daqStore.viewableItemsRecord.length
  if (currentRecordCount >= DAQ_SENDER_COUNT) {
    const currentTime = new Date()
    postRecord(currentTime)
  }
  const array = []
  changed.forEach(i => {
    const { index, isViewable, item } = i
    item.products &&
      item.products.forEach(cp => {
        const key = getCurrentItemKey(cp.product.id, index)
        const object = { index, isViewable, key, item: cp.product }
        array.push(object)
      })
  })
  daqStore.updateViewableItems(array, currentCustomerStore.id, getReportData)
}

const viewableItemsLookBooks = changed => {
  const { currentCustomerStore, daqStore } = Stores
  if (!currentCustomerStore.enableAutoTrack) {
    return
  }
  const currentRecordCount = daqStore.viewableItemsRecord.length
  if (currentRecordCount >= DAQ_SENDER_COUNT) {
    const currentTime = new Date()
    postRecord(currentTime)
  }

  const viewableItems = changed.filter(item => {
    const needIndex = item.index !== null
    const isClose = item.section.footerStatus === 'CLOSED'
    const isDisplay = isClose ? item.index < 3 : true
    return needIndex && isDisplay
  })

  const array = []
  viewableItems.forEach(i => {
    array.push({ ...i, type: DAQ_TYPE.Look })
  })
  daqStore.updateViewableItems(array, currentCustomerStore.id, () => {
    return { column: Column.LookBooks }
  })
}

const viewableItemsInProductDetails = (changed, product) => {
  const { currentCustomerStore, daqStore } = Stores
  if (!currentCustomerStore.enableAutoTrack) {
    return
  }
  const currentRecordCount = daqStore.viewableItemsRecord.length
  if (currentRecordCount >= DAQ_SENDER_COUNT) {
    const currentTime = new Date()
    postRecord(currentTime)
  }

  let look,
    otherProducts,
    similarProducts = []
  changed.forEach(i => {
    const { item, isViewable } = i
    const isString = typeof item === 'string'
    if (isString) {
      if (item === 'OtherProducts') {
        otherProducts = i
      }
      if (item === 'Look') {
        look = i
      }
    } else {
      const { key, index, items } = item
      if (key === 'SimilarProduct') {
        items.map((p, j) => {
          const currentIndex = index * 2 + j
          const type = DAQ_TYPE.Product
          const key = p.id
          const object = { key, isViewable, type, index: currentIndex, item: p }
          similarProducts.push(object)
        })
      }
    }
  })
  if (product) {
    const { other_products_in_catalog_photos, primary_looks } = product
    if (
      otherProducts &&
      other_products_in_catalog_photos &&
      other_products_in_catalog_photos.length
    ) {
      const array = other_products_in_catalog_photos.map((item, index) => {
        const { isViewable } = otherProducts
        const type = DAQ_TYPE.Product
        const object = { item, isViewable, index, type, key: item.id }
        return object
      })

      daqStore.updateViewableItems(array, currentCustomerStore.id, () => {
        //返回相关信息
        return { column: Column.Outfits }
      })
    }

    if (look && primary_looks && primary_looks.length) {
      const item = primary_looks[0]
      const { isViewable } = look
      const type = DAQ_TYPE.Look
      const array = [{ item, isViewable, type, key: item.id }]
      daqStore.updateViewableItems(array, currentCustomerStore.id, () => {
        //返回相关信息
        return { column: Column.ProductLookBook }
      })
    }
  }
  if (similarProducts.length) {
    daqStore.updateViewableItems(
      similarProducts,
      currentCustomerStore.id,
      () => {
        //返回相关信息
        return { column: Column.SimilarProducts }
      }
    )
  }
}

//上传数据到服务器
const postRecord = endTime => {
  if (!Stores.currentCustomerStore.enableAutoTrack) {
    return
  }
  let array
  // 如果有数据筛选条件 endtime ,则只上报endtime之前的数据 没有截止时间 就全部上报
  if (endTime) {
    array = Stores.daqStore.viewableItemsRecord.filter(item => {
      return item.endTime <= endTime
    })
  } else {
    array = Stores.daqStore.viewableItemsRecord
  }
  if (array.length) {
    //删除本地数据
    Stores.daqStore.deleteRecordByEndTime(endTime)
    POSTRecord({ data: array })
  }
}

// 更新一条统计信息的状态
const updateViewableItemStatus = (keyword, item, attributes) => {
  const { enableAutoTrack, id } = Stores.currentCustomerStore
  if (!enableAutoTrack) {
    return
  }
  let data = attributes ? { ...attributes, userId: id } : { userId: id }
  Stores.daqStore.updateViewableItemStatus(keyword, item, data)
}

// 完成当前进行中的所有统计
const finishAllOfViewableItems = () => {
  if (!Stores.currentCustomerStore.enableAutoTrack) {
    return
  }
  Stores.daqStore.finishAllOfViewableItems()
}

const POSTRecord = variables => {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Content-Encoding': 'gzip',
    'X-REQUESTED_WITH': 'XMLHttpRequest'
  }

  fetch(DAQ_URL, {
    headers,
    body: JSON.stringify(variables),
    method: 'POST',
    credentials: 'include'
  })
    .then(() => {})
    .catch(() => {})
}

const initViewableItemsOnFocus = array => {
  Stores.daqStore.viewableArray = array ? array : []
}

export {
  DAQ_TYPE,
  getCurrentItemKey,
  isEnableTrackScreen,
  viewableItemsChanged,
  updateViewableItemStatus,
  finishAllOfViewableItems,
  initViewableItemsOnFocus,
  postRecord,
  viewableDetails,
  viewableItemsCustomerPhotos,
  viewableItemsLookBooks,
  viewableItemsInProductDetails
}
