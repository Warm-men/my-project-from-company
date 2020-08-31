import { observable, action } from 'mobx'
import { persist } from 'mobx-persist'
import { ToastStyles } from '../../storybook/stories/toast'
class AppStore {
  @persist
  @observable
  isInstall = false

  @observable
  inApplication = {
    Wechat: false
  }
  @observable
  isOpenJverification = true

  @observable
  isPreLoginSuccess = false

  @persist
  @observable
  isGuided = false

  @persist('object')
  @observable
  lastShowNotifycationDialogTime = null //上一次开启通知提示的时间点

  @observable tagLogin = false

  @persist
  @observable
  guid = null

  @observable barStyleColor = 'default'

  @observable currentVersion = '3.30.0'

  @persist('object')
  @observable
  versionData = null

  @persist('object')
  @observable
  latestCheckVersionTime = null

  @observable toastMessage = null

  @persist('list')
  @observable
  searchHistory = []

  @action
  showToast = (message, type, duration) => {
    this.toastMessage = type
      ? {
          text: message,
          styles: ToastStyles[type].styles,
          icon: ToastStyles[type].icon,
          duration: duration ? duration : 3000
        }
      : {
          text: message
        }
  }
  @action
  showToastWithOpacity = (message, duration) => {
    this.toastMessage = {
      text: message,
      showType: 'opacity',
      duration: duration ? duration : 1500
    }
  }

  @action
  signOut = () => {
    this.isGuided = false
    this.toastMessage = null
  }

  @action
  getGUID = () => {
    let id
    if (this.guid) {
      id = this.guid
    } else {
      id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
        .replace(/[xy]/g, function(c) {
          var r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8
          return v.toString(16)
        })
        .toUpperCase()
      this.guid = id
    }
    return id
  }
}

export default new AppStore()
