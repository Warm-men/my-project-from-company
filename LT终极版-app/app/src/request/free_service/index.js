import { SERVICE_TYPES, QNetwork } from '../../expand/services/services'
const getFreeService = () => {
  return new Promise((resolve, reject) => {
    QNetwork(
      SERVICE_TYPES.me.QUERY_FREESERVICE,
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
const getFreeServicePrice = () => {
  return new Promise((resolve, reject) => {
    QNetwork(
      SERVICE_TYPES.freeService.FREE_SERVICE_TYPE,
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
export { getFreeService, getFreeServicePrice }
