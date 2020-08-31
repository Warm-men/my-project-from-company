import { observable, action } from 'mobx'
import { getAbFlag } from '../components/ab_testing'
import Stories from './stores'

class PopupsStore {
  @observable popups = []
  @observable isPopupLoading = false

  @action
  updatePopups = popups => {
    this.popups = popups ? popups : []
  }

  @action
  removePopup = id => {
    const popup = this.popups.find(item => {
      return item.id === id
    })
    if (popup) {
      this.popups.remove(popup)
    }
  }

  @action
  resetPopup = () => {
    this.popups = []
  }

  @action
  showPopup = (currentRoute, callback) => {
    if (
      !this.popups.length ||
      currentRoute === 'Guide' ||
      currentRoute === 'BindPhone' ||
      !currentRoute
    ) {
      return
    }
    const popup = this.popups.find(item => {
      if (!item.routes.length) {
        return true
      }
      return !!item.routes.find(route => {
        return route === currentRoute
      })
    })

    if (Stories.currentCustomerStore.isSubscriber) {
      callback && callback(popup)
    } else {
      getAbFlag('popup_in_home', 1, result => {
        if (result === 1) {
          callback && callback(popup)
        }
      })
    }
  }
}

export default new PopupsStore()
