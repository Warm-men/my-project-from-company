import { SERVICE_TYPES, QNetwork } from '../../expand/services/services'
import Stores from '../../stores/stores'

const queryClothingOccasionBanner = display_position => {
  const variable = { display_position }
  QNetwork(SERVICE_TYPES.banner.QUERY_NEW_BANNER_GROUP, variable, response => {
    const data = response.data.banner_group
    if (data && data.banners) {
      Stores.productsOccasionStore.updateData(data.banners, display_position)
    }
  })
}

export default { queryClothingOccasionBanner }
