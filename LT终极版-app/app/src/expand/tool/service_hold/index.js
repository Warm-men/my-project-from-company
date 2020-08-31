import dateFns from 'date-fns'

const getDateStr = num =>
  dateFns.format(dateFns.addDays(new Date(), num), 'YYYY年MM月DD日')

export default function SERVICE_TIME() {
  let times = []
  for (let i = 1; i <= 30; i++) {
    times.push(getDateStr(i))
  }
  return times
}
