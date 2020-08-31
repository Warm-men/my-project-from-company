import Stores from '../../../stores/stores'
import { getBalance } from '../../../request'

/**
 * 刷新信用账户金额
 */

const updateBalance = async balance => {
  let response
  if (balance === undefined || balance === null) {
    response = await getBalance()
    balance = response.data.me.credit_account.balance
  }
  Stores.currentCustomerStore.updateBalance(balance)
}
export { updateBalance }
