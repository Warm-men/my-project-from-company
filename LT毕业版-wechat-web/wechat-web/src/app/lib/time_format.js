import { differenceInDays, format as forMat } from 'date-fns'

export const format = (time, type = 'YYYY-MM-DD') => forMat(time, type)

export const distance_hold_days = time => {
  const hold_time = format(time),
    current_time = format(new Date()),
    diffInDays = differenceInDays(current_time, hold_time)
  return diffInDays > 0 ? diffInDays : -diffInDays
}

export const newMembershipDays = time => {
  const vipTime = format(time, 'YYYY-MM-DD')
  const currentTime = format(new Date(), 'YYYY-MM-DD')
  return differenceInDays(vipTime, currentTime) > 0
    ? differenceInDays(vipTime, currentTime)
    : 0
}
