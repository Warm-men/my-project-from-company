// NOTE：默认最晚下单时间
export const LAST_CITYTIME = '17:00'

// NOTE:获取城市预约时间表
export const getCityTime = () => {
  return fetch('/sf/citytime.json', {
    method: 'GET',
    headers: {
      Accept: 'application/json', // needed for request.format.json?
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin'
  })
    .then(res => res.json())
    .then(json => Promise.resolve(json))
}

// NOTE:处理用户最晚城市时间
export const getLastTime = async info => {
  const cityTime = await lib.getCityTime()
  let lastCityTime = LAST_CITYTIME
  const validAddress = info.addressInfo,
    { state, city, district } = validAddress
  _.mapKeys(cityTime, (value, key) => {
    if (
      (state && state.match(key)) ||
      (city && city.match(key)) ||
      (district && district.match(key))
    ) {
      lastCityTime = value
    }
  })
  return lastCityTime
}

export const lib = {
  getCityTime
}
