import { format, addDays } from 'date-fns'

const GetDateStr = num => format(addDays(new Date(), num), 'YYYY年MM月DD日')

export default (() => {
  let times = []
  for (let i = 1; i <= 30; i++) {
    times.push(GetDateStr(i))
  }
  return times
})()
