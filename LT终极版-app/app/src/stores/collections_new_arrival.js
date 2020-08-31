import { observable } from 'mobx'
import { persist } from 'mobx-persist'

class CollectionsNewArrivalStore {
  @persist('list')
  @observable
  collections = []

  @persist('list')
  @observable
  newProducts = []
}

export default new CollectionsNewArrivalStore()
