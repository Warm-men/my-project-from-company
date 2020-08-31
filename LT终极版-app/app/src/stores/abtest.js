import { observable } from 'mobx'
import { persist } from 'mobx-persist'

class AbTestStore {
  @persist
  @observable
  non_member_in_home_bottom = 1 //已结束

  @persist
  @observable
  on_scroll_animated_list = 1
}

export default new AbTestStore()
