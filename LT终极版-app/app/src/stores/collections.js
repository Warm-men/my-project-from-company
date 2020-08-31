import { observable, action } from 'mobx'
import { persist } from 'mobx-persist'

class CollectionsStore {
  @persist('list')
  @observable
  browse_collections = []

  @action
  updateCollections = browse_collections => {
    this.browse_collections = browse_collections ? browse_collections : []
  }
}

export default new CollectionsStore()
