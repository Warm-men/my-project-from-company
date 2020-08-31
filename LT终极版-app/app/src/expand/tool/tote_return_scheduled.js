/* @flow */
import dateFns from 'date-fns'

const getBookingInformation = (bookings, defaultMonth, today) => {
  let bookingsData = bookings
  const year = yearReg(bookings, defaultMonth, today)
  const reg = /[\u4e00-\u9fa5]/g
  return bookingsData.length
    ? year +
        '-' +
        bookingsData[0].replace('月', '-').replace(reg, '') +
        ' ' +
        bookingsData[1].replace(reg, '') +
        ':' +
        bookingsData[2].replace(reg, '')
    : ''
}

const getCityDeadLine = (shippingAddress, cityTime) => {
  let defaultTime = '17:00'
  if (!cityTime) {
    return defaultTime
  } else {
    if (!shippingAddress) {
      return defaultTime
    }
    const { state, city, district } = shippingAddress
    for (let key in cityTime) {
      if (state.match(key) || city.match(key) || district.match(key)) {
        defaultTime = cityTime[key]
      }
    }
    return defaultTime
  }
}

const yearReg = (bookings, defaultMonth, defaultDay, todayIsLastDayOfMonth) => {
  const isLastDayOfMonth = todayIsLastDayOfMonth
    ? todayIsLastDayOfMonth
    : dateFns.isLastDayOfMonth(new Date())
  const isLastMonthOfYears = defaultMonth
    ? defaultMonth === '12'
    : dateFns.format(new Date(), 'MM') === '12'
  const selectedDay = bookings[0]
  const today = defaultDay || dateFns.format(new Date(), 'MM月DD日')
  const thisYear = dateFns.format(new Date(), 'YYYY')
  const nextYaer = dateFns.format(dateFns.addYears(new Date(), 1), 'YYYY')
  if (isLastMonthOfYears && isLastDayOfMonth && selectedDay !== today) {
    return nextYaer
  } else {
    return thisYear
  }
}

const getReturnTime = bookings => {
  let bookingsData = bookings
  if (!bookingsData || !bookingsData.length) {
    return null
  }
  const timeReg = new RegExp(/[^0-9]/g)
  const newDay = bookingsData[0].replace('月', '-').replace('日', ''),
    newTime = bookingsData[1].replace(timeReg, ''),
    newMoment = bookingsData[2].replace(timeReg, '')
  const year = yearReg(bookings)
  const bookingReg = `${year}-${newDay} ${
    newTime < 10 ? `0${newTime}` : newTime
  }:${newMoment < 10 ? `0${newMoment}` : newMoment}`
  return bookingReg
}

export { getBookingInformation, getCityDeadLine, getReturnTime, yearReg }
