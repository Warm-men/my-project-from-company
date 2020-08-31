const getFreeServicePrice = () => {
  return new Promise(resolve => {
    resolve({
      data: {
        me: {
          free_service: {
            free_service_type: { price: 100, type: 'FreeServiceContractType' }
          }
        }
      }
    })
  })
}

const getCreditAccount = () => {
  return new Promise(resolve => {
    resolve({ data: {} })
  })
}
export { getFreeServicePrice, getCreditAccount }
