import JudgeAddress from 'src/app/components/wx_address/utils.json'

const excludeCity = ['三沙市', '铁门关市']
const isIncludeSpecial = (city, district) => {
  let include = false
  for (let index = 0; index < excludeCity.length; index++) {
    if (city === excludeCity[index] || district === excludeCity[index]) {
      include = true
      break
    }
  }
  return include
}

const specialDistrict = {
  定州市: {
    city: '保定市'
  },
  辛集市: {
    city: '石家庄市'
  }
}

const validAddress = shipping_address => {
  // NOTE：如果是包含特殊城市就返回空
  if (isIncludeSpecial(shipping_address.city, shipping_address.district)) {
    return {
      ...shipping_address,
      isUnValid: true
    }
  }
  if (shipping_address.city === '县') {
    return {
      ...shipping_address,
      state: shipping_address.state,
      city: shipping_address.state
    }
  }
  if (JudgeAddress[shipping_address.state]) {
    let newAddress = shipping_address
    if (
      shipping_address.city === '省直辖县级行政区划' ||
      shipping_address.city === '自治区直辖县级行政区划'
    ) {
      const newDistrict = specialDistrict[shipping_address.district]
      if (newDistrict) {
        newAddress = {
          ...shipping_address,
          city: newDistrict.city
        }
      }
      newAddress = {
        ...shipping_address,
        city: shipping_address.district,
        district: shipping_address.district
      }
      return newAddress
    }
    const judgeCity = JudgeAddress[shipping_address.state]
    judgeCity &&
      judgeCity.map(v => {
        if (v.weCity === shipping_address.city) {
          newAddress.city = v.city
        }
        return null
      })
    return newAddress
  }
  if (
    shipping_address.city === '省直辖县级行政区划' ||
    shipping_address.city === '自治区直辖县级行政区划'
  ) {
    const newDistrict = specialDistrict[shipping_address.district]
    if (newDistrict) {
      return {
        ...shipping_address,
        city: newDistrict.city
      }
    }
    return {
      ...shipping_address,
      city: shipping_address.district,
      district: shipping_address.district
    }
  }
  return shipping_address
}

export default validAddress
