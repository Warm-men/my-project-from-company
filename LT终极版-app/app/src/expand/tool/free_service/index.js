import Stores from '../../../stores/stores'
import { getFreeService } from '../../../request'

const updateFreeService = async () => {
  let response = await getFreeService()
  const { free_service, tote_cart } = response.data.me
  Stores.currentCustomerStore.updateFreeService(free_service)
  Stores.toteCartStore.updateToteCart(tote_cart)
}
export { updateFreeService }
