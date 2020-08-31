import { observable, action } from 'mobx'
import { persist } from 'mobx-persist'

class BannerHomeStore {
  @persist('list')
  @observable
  topBannersData = []

  @persist('list')
  @observable
  bottomBannersData = []

  @persist('list')
  @observable
  introduceBannersData = []

  @persist('list')
  @observable
  secondaryBannersData = []

  @persist('list')
  @observable
  occasionBannersData = []

  @persist('list')
  @observable
  nonMemberTopBanner = []

  @persist('list')
  @observable
  nonMemberActivityBanner = []

  @persist('list')
  @observable
  nonMemberListBanner = []

  @persist('list')
  @observable
  floatHoverBanner = []

  @action
  updateBanners = (type, array) => {
    const banners = array ? array : []

    switch (type) {
      case 'app_top_banner':
      case 'app_top_subscriber':
        this.topBannersData = [...banners]
        break
      case 'app_btm_banner':
        this.bottomBannersData = [...banners]
        break
      case 'intro_app_banner':
        this.introduceBannersData = [...banners]
        break
      case 'secondary_banner':
        this.secondaryBannersData = [...banners]
        break
      case 'occasionBanner':
        this.occasionBannersData = [...banners]
        break
      case 'app_top_banner_300':
        this.nonMemberTopBanner = [...banners]
        break
      case 'app_activity_banner_300':
        this.nonMemberActivityBanner = [...banners]
        break
      case 'app_list_banner_300':
        this.nonMemberListBanner = [...banners]
        break
      case 'floathover':
        this.floatHoverBanner = [...banners]
        break
    }
  }
}

export default new BannerHomeStore()
