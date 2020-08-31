import { observable, action } from 'mobx'
import { persist } from 'mobx-persist'

class ProductsOccasionStore {
  @persist('object')
  @observable
  clothingListTopBanner = []

  @persist('object')
  @observable
  accessoryListTopBanner = []

  @action
  updateData = (banners, display_position) => {
    if (!banners.length) return null
    let newBanners = banners.slice(0, 4)
    if (newBanners.length !== 4) return null
    if (display_position === 'clothing_list_top') {
      this.clothingListTopBanner = [...newBanners]
    } else {
      this.accessoryListTopBanner = [...newBanners]
    }
  }
}
export default new ProductsOccasionStore()
