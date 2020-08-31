import { differenceInHours, endOfDay } from 'date-fns'

export const HOLDDATE_TODAY = '今天'
export const HOLDDATE_TOMORROW = '明天'

export const HoldDate = hold_date => {
  if (differenceInHours(new Date(), endOfDay(hold_date)) > 0) {
    return HOLDDATE_TODAY
  } else {
    return HOLDDATE_TOMORROW
  }
}
