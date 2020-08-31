import { SERVICE_TYPES, QNetwork } from '../../expand/services/services'
const getCreditAccount = (page, per_page) => {
  return new Promise((resolve, reject) => {
    QNetwork(
      SERVICE_TYPES.me.QUERY_ME_CREDIT_ACCOUNT,
      { page, per_page },
      response => {
        resolve(response)
      },
      error => {
        reject(error)
      }
    )
  })
}
const getBalance = () => {
  return new Promise((resolve, reject) => {
    QNetwork(
      SERVICE_TYPES.me.QUERY_ME_BALANCE,
      {},
      response => {
        resolve(response)
      },
      error => {
        reject(error)
      }
    )
  })
}
export { getCreditAccount, getBalance }
