import { observable, action } from 'mobx'
import { persist } from 'mobx-persist'
class SearchStore {
  @persist('list')
  @observable
  searchHistory = []
}

export default new SearchStore()
