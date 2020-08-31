import booking from '../../../expand/tool/booking'
import dateFns from 'date-fns'

describe('Test LastTime: 17:00 hour: 4, minute: 20', () => {
  let LAST_CITYTIME = '17:00'
  let hour = 2
  let minute = 20
  beforeEach(() => {
    hour = 0
    minute = 0
  })
  it('Test LAST_CITYTIME shoudle work', () => {
    hour = 12
    minute = 30
    LAST_CITYTIME = '20:00'
    const { bookingDate } = booking(LAST_CITYTIME, hour, minute)
    const today = dateFns.format(new Date(), 'MM月DD日')
    const lastTime = { '20时': ['00分'] }
    const hoursLength = Object.keys(bookingDate[0][today]).length
    const LastHoursName = Object.keys(bookingDate[0][today])[hoursLength - 1]
    const resLastTime = bookingDate[0][today][LastHoursName]
    return expect(resLastTime).toEqual(lastTime)
  })
  it('Test 4:20 for hoursName', () => {
    hour = 4
    minute = 20
    const { bookingDate } = booking(LAST_CITYTIME, hour, minute)
    const today = dateFns.format(new Date(), 'MM月DD日')
    const hoursName = '9时'
    const hoursObject = Object.keys(bookingDate[0][today][0])[0]
    return expect(hoursObject).toEqual(hoursName)
  })
  it('Test 4:20 for minuteName', () => {
    hour = 4
    minute = 20
    const { bookingDate } = booking(LAST_CITYTIME, hour, minute)
    const today = dateFns.format(new Date(), 'MM月DD日')
    const hoursName = '9时'
    const minuteName = '00分'
    const responseMinuteName = bookingDate[0][today][0][hoursName][0]
    return expect(responseMinuteName).toEqual(minuteName)
  })
  it('Test 10:40 for hoursName', () => {
    hour = 10
    minute = 40
    const { bookingDate } = booking(LAST_CITYTIME, hour, minute)
    const today = dateFns.format(new Date(), 'MM月DD日')
    const hoursName = '12时'
    const hoursObject = Object.keys(bookingDate[0][today][0])[0]
    return expect(hoursObject).toEqual(hoursName)
  })
  it('Test 10:40 for minuteName', () => {
    hour = 10
    minute = 40
    const { bookingDate } = booking(LAST_CITYTIME, hour, minute)
    const today = dateFns.format(new Date(), 'MM月DD日')
    const hoursName = '12时'
    const minuteName = '00分'
    const responseMinuteName = bookingDate[0][today][0][hoursName][0]
    return expect(responseMinuteName).toEqual(minuteName)
  })
  it('Overtime for the last city titme, Test 22:10 for hoursName, shoulde response tomorrow booking at 09AM 00', () => {
    hour = 22
    minute = 40
    const { bookingDate } = booking(LAST_CITYTIME, hour, minute)
    const today = dateFns.format(dateFns.addDays(new Date(), 1), 'MM月DD日')
    const hoursName = '9时'
    const hoursObject = Object.keys(bookingDate[0][today][0])[0]
    return expect(hoursObject).toEqual(hoursName)
  })
  it('Overtime for the last city time, Test 22:10 for minuteName, shoulde response tomorrow booking at 09AM 00', () => {
    hour = 22
    minute = 40
    const { bookingDate } = booking(LAST_CITYTIME, hour, minute)
    const today = dateFns.format(dateFns.addDays(new Date(), 1), 'MM月DD日')
    const hoursName = '9时'
    const minuteName = '00分'
    const responseMinuteName = bookingDate[0][today][0][hoursName][0]
    return expect(responseMinuteName).toEqual(minuteName)
  })
})
