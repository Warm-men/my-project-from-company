import { observable, action } from 'mobx'
import Stores from './stores'

class DaqStore {
  @observable
  viewableItemsRecord = []

  @observable
  viewableItems = {}

  @observable
  viewableArray = []

  @action
  updateViewableItems = (items, userId, getReportData) => {
    if (!items) return
    items.forEach(a => {
      const { item, index, isViewable, key, type } = a
      const keyword = key
      const viewableItem = this.viewableItems[keyword]
      if (viewableItem) {
        this.addViewableItemRecord(viewableItem, keyword)
      } else {
        // 如果当前统计内没有当前商品，但是状态变化出现了改商品消失，不计入统计数据
        if (!isViewable) {
          return
        }
        const { variables, column } = getReportData(index)
        const params = { userId, index, variables, column, type, id: item.id }
        const newViewableItem = new ViewableItem(params)
        this.viewableItems[keyword] = newViewableItem
      }
    })
  }

  @action
  viewableDetails = data => {
    if (!data) return
    const newViewableItem = new ViewableItem(data)
    const keyword = data.id
    this.viewableItems[keyword] = newViewableItem
  }

  @action
  finishAllOfViewableItems = () => {
    this.viewableArray = []
    for (var keyword in this.viewableItems) {
      if (this.viewableItems.hasOwnProperty(keyword)) {
        this.addViewableItemRecord(this.viewableItems[keyword], keyword)
      }
    }
  }

  @action
  addViewableItemRecord = (item, keyword) => {
    if (!item) return
    item.endTime = new Date()
    if (keyword) {
      delete this.viewableItems[keyword]
    }
    this.viewableItemsRecord.push(item)
  }

  @action
  deleteRecordByEndTime = endTime => {
    if (endTime) {
      this.viewableItemsRecord = this.viewableItemsRecord.filter(item => {
        return item.endTime > endTime
      })
    } else {
      this.viewableItemsRecord = []
    }
  }

  @action
  updateViewableItemStatus = (keyword, object, attributes) => {
    const data = this.viewableItems[keyword]
    if (data) {
      this.viewableItems[keyword] = { ...data, ...object }
    } else {
      // 如果上报的更新数据不在当前记录内，创建一条完成的记录
      const newViewableItem = new ViewableItem(attributes)
      const newRecord = { ...newViewableItem, ...object }
      this.addViewableItemRecord(newRecord)
    }
  }
}

class ViewableItem {
  constructor(props) {
    const { id, index, column, variables, userId, type } = props
    this.id = id
    this.variables = variables
    this.column = column
    this.userId = userId
    if (index === null || index === undefined) {
      this.list = false
    } else {
      this.index = index + 1
    }
    if (type) {
      this.type = type
    }
  }
  id = null
  userId = null
  beginTime = new Date()
  endTime = null
  index = null
  list = true
  variables = null
  column = null
  pushToDetail = false
  addToShoppingCar = false
  closet = false
  type = 'Product'
  version = Stores.appStore.currentVersion
}
export default new DaqStore()
