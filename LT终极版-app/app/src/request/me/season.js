import { SERVICE_TYPES, QNetwork } from '../../expand/services/services'
import Stores from '../../stores/stores'
const getSeason = () => {
  QNetwork(SERVICE_TYPES.me.QUERY_SEASON, {}, response => {
    const { season_sort_switch, season_change_prompt } = response.data
    if (
      season_change_prompt.option !==
      Stores.currentCustomerStore.season_change_prompt
    ) {
      Stores.guideStore.productSeasonGuide = false
    }
    Stores.currentCustomerStore.updateSeasonSortSwitch(
      season_sort_switch,
      season_change_prompt
    )
  })
}

export { getSeason }
