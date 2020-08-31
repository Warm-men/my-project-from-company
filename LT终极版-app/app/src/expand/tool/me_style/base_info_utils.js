import React from 'react'
import Stores from '../../../stores/stores'
import dateFns from 'date-fns'
import {
  CREATEDATEDATA,
  OCCUPATION,
  MARRIAGE,
  MARRIAGESTATUS
} from '../size/size'

const getBaseInfo = () => {
  const { style } = Stores.currentCustomerStore
  let birthday = []
  let selectBirthday = []
  if (style.birthday) {
    const styleBirthday = dateFns.format(new Date(style.birthday), 'YYYY-MM-DD')
    birthday.push(styleBirthday.slice(0, 5))
    birthday.push(styleBirthday.slice(6, 8))
    birthday.push(styleBirthday.slice(8, 10))
    const styleSelectBirthday = dateFns.format(
      new Date(style.birthday),
      'YYYY-M-D'
    )
    selectBirthday.push(styleSelectBirthday.slice(0, 5))
    selectBirthday.push(styleSelectBirthday.slice(6, 8))
    selectBirthday.push(styleSelectBirthday.slice(9, 11))
  }
  const marriageIndex = MARRIAGESTATUS.findIndex(item => {
    return (
      item.value.mom === style.mom &&
      item.value.marital_status === style.marital_status
    )
  })
  let marriage = []
  if (marriageIndex !== -1) {
    marriage.push(MARRIAGESTATUS[marriageIndex].display)
  }
  return { birthday, selectBirthday, marriage }
}

const formatDate = date => {
  let reportDate = ''
  date &&
    date.split('-').map((item, index) => {
      item =
        index === 0
          ? item + '-'
          : index === 1
          ? item.length !== 1
            ? item + '-'
            : '0' + item + '-'
          : item.length !== 1
          ? item
          : '0' + item
      reportDate = reportDate + item
    })
  return reportDate
}

const getRefreshInfo = data => {
  const { birthday, occupation, marriage } = data
  let str = ''
  birthday.forEach(item => {
    str = str + item
  })
  str = str
    .replace('年', '-')
    .replace('月', '-')
    .replace('日', '')
  const newBirthday = new Date(formatDate(str))
  const marriageIndex = MARRIAGESTATUS.findIndex(item => {
    return item.display === marriage.toString()
  })
  const newOccupation = occupation.toString()
  const newMom =
    marriageIndex !== -1 ? MARRIAGESTATUS[marriageIndex].value.mom : ''
  const newMaritalStatus =
    marriageIndex !== -1
      ? MARRIAGESTATUS[marriageIndex].value.marital_status
      : ''
  const { style } = Stores.currentCustomerStore
  let preBirthday = style.birthday
  let preOccupation = style.occupation
  let preMom = style.mom
  let preMaritalStatus = style.marital_status
  if (
    dateFns.format(newBirthday, 'YYYY-MM-DD') !==
      dateFns.format(preBirthday, 'YYYY-MM-DD') ||
    newOccupation !== preOccupation ||
    newMom !== preMom ||
    newMaritalStatus !== preMaritalStatus
  ) {
    return {
      birthday: newBirthday,
      occupation: newOccupation,
      mom: newMom,
      marital_status: newMaritalStatus
    }
  }
  return null
}
const getCityValue = () => {
  const { shippingAddress } = Stores.currentCustomerStore
  let selectCityValue
  let cityValue
  if (shippingAddress !== null) {
    const { city, state } = shippingAddress
    selectCityValue =
      city === null || state == null ? ['广东省', '深圳市'] : [city, state]
    cityValue = city === null || state == null ? [] : [city, state]
  } else {
    selectCityValue = ['广东省', '深圳市']
    cityValue = []
  }
  return {
    selectCity: selectCityValue,
    city: cityValue
  }
}

const getRefreshShippingAdress = value => {
  const { shippingAddress } = Stores.currentCustomerStore
  const areasArray = require('../city/district.json')
  const zipArray = require('../city/zip_code_data.json')
  let area
  areasArray.map(item => {
    if (item[value[0]]) {
      item[value[0]].map(i => {
        if (i[value[1]]) {
          area = i[value[1]][0]
        }
      })
    }
  })
  // FIXME: 未知处理
  const zipCode = zipArray[value[0] + value[1] + area]
  let zip_code = zipCode ? zipCode : '518001' //defaultZipCode
  if (shippingAddress !== null) {
    const { address_1, address_2, telephone, city, state } = shippingAddress
    if (value[0] === city && value[1] == state) {
      return null
    } else {
      return {
        address_1: address_1 || '',
        address_2: address_2 || '',
        city: value[1],
        state: value[0],
        zip_code: zip_code,
        telephone: telephone || '',
        country: 'CN'
      }
    }
  } else {
    return {
      address_1: '',
      address_2: '',
      city: value[1],
      state: value[0],
      zip_code: zip_code,
      telephone: '',
      country: 'CN'
    }
  }
}

export { getBaseInfo, getRefreshInfo, getCityValue, getRefreshShippingAdress }
