/**
 * 预约归还时间
 */
import dateFns from 'date-fns'

const booking = (deadline, hour, minute) => {
  return {
    bookingDate: date(deadline, hour, minute)
  }
}

// NOTE：后台没有的时间，都采用17:00
const defaultDeadLine = '17:00'

const date = (deadline, hour, minute) => {
  //add hour, minute just for test
  let getHours = hour ? hour : new Date().getHours() //小时
  let getMinutes = minute ? minute : new Date().getMinutes() //分钟
  let timeData = []
  const minutes = ['00分', '30分']
  // NOTE:有传入使用传入截止日期，没有使用默认的
  const deadlineList = deadline
    ? deadline.split(':')
    : defaultDeadLine.split(':')

  // NOTE:截止的时间
  const lastTime = parseInt(deadlineList[0], 10)
  const lastMoment = parseInt(deadlineList[1], 10)

  // NOTE:最后下单时间的分钟list
  const lastMomentList = lastMoment === 30 ? minutes : ['00分']

  for (let i = 0; i < 2; i++) {
    let hours = [] //今天剩下的小时组合

    let days = {}
    if (i === 0 && getHours + 1 >= lastTime && getMinutes >= lastMoment) {
      timeData = []
    } else {
      const hoursStartAt = i === 1 || getHours < 9 ? 9 : getHours + 1
      for (let h = hoursStartAt; h <= lastTime; h++) {
        let hoursObject = {}
        let hoursName = `${h}时`
        if (h === lastTime) {
          hoursObject[hoursName] = ['00分']
        } else if (h === getHours + 1) {
          if (getMinutes < 30 && getMinutes > 0) {
            hoursObject[hoursName] = ['30分']
          } else {
            hoursName = `${h + 1}时`
            if (h + 1 == lastTime) {
              hoursObject[hoursName] = ['00分']
            } else {
              hoursObject[hoursName] = minutes
            }
            h++
          }
        } else {
          hoursObject[hoursName] = h < lastTime ? minutes : lastMomentList
        }
        hours.push(hoursObject)
      }

      let dayName = dateFns.format(dateFns.addDays(new Date(), i), 'MM月DD日')

      days[dayName] = hours

      timeData.push(days)

      hours = []
    }
  }
  return timeData
}

export default booking
