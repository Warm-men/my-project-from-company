import { observable, action } from 'mobx'
import { persist } from 'mobx-persist'

class LookBookStore {
  @persist('list')
  @observable
  lookbooks = []

  @action
  updateLookBooks = lookbooks => {
    this.lookbooks = lookbooks ? lookbooks : []
  }
}

export default new LookBookStore()
