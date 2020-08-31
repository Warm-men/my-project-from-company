import { observable, action } from 'mobx'
import { persist } from 'mobx-persist'
import _ from 'lodash'

class CollectionsHotStore {
  @persist('list')
  @observable
  collections = []

  @action
  updateHot = newCollection => {
    this.collections = _.sortBy(newCollection, function(collection) {
      return collection.activated_since
    }).reverse()
  }
}

export default new CollectionsHotStore()
