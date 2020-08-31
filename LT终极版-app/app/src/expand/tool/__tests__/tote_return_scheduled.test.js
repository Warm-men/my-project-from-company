import { getBookingInformation, yearReg } from '../tote_return_scheduled'
import dateFns from 'date-fns'

describe('tote return scheduled tools tests', () => {
  describe('get bookings information', () => {
    it('should return exact years', () => {
      const bookings = ['01月01日', '15', '00']
      const defaultMonth = '12'
      const today = '01月01日'
      const thisYear = dateFns.format(new Date(), 'YYYY')
      const result = getBookingInformation(bookings, defaultMonth, today)
      expect(result).toEqual(thisYear + '-01-01 15:00')
    })
  })
  describe('test yearReg, when straddle old and new years, yearReg shuold be addYears', () => {
    it('should return next years reg', () => {
      const bookings = ['01月01日', '15', '00']
      const defaultMonth = '12'
      const today = '12月31日'
      const todayIsLastDayOfMonth = true
      const result = yearReg(
        bookings,
        defaultMonth,
        today,
        todayIsLastDayOfMonth
      )
      const nextYaer = dateFns.format(dateFns.addYears(new Date(), 1), 'YYYY')
      expect(result).toEqual(nextYaer)
    })
  })

  describe('test yearReg, when in same years, yearReg shuold be this year', () => {
    it('should return this years reg', () => {
      const bookings = ['11月02日', '15', '00']
      const defaultMonth = '11'
      const today = '11月01日'
      const result = yearReg(bookings, defaultMonth, today)
      const thisYear = dateFns.format(new Date(), 'YYYY')
      expect(result).toEqual(thisYear)
    })
    it('should return this years reg', () => {
      const bookings = ['12月31日', '15', '00']
      const defaultMonth = '12'
      const today = '12月30日'
      const result = yearReg(bookings, defaultMonth, today)
      const thisYear = dateFns.format(new Date(), 'YYYY')
      expect(result).toEqual(thisYear)
    })
  })
})
