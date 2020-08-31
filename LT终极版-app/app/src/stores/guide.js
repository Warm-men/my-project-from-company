import { observable, action } from 'mobx'
import { persist } from 'mobx-persist'

class GuideStore {
  @persist
  @observable
  toteCartGuideShowed = false

  @persist
  @observable
  closetGuideShowed = false

  @persist
  @observable
  firstOrderGuideShowed = false

  @persist
  @observable
  oldToteCartGuideShowed = false

  @persist
  @observable
  productGuideShowed = false

  @persist
  @observable
  isHiveBoxGuideShowed = null

  @persist
  @observable
  buyClothesGuideShowed = false

  @persist
  @observable
  rateToteGuideShowed = false

  @persist
  @observable
  taggingCustomerPhotosGuideShowed = false

  @persist
  @observable
  toteCartFreeService = false

  @persist
  @observable
  photosTaggingBubble = false

  @persist
  @observable
  productSeasonGuide = false
}

export default new GuideStore()
