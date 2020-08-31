import { differenceInHours, differenceInMinutes, addDays } from 'date-fns'
const getDeathLineText = delivered_at => {
  const dayOfEnding = addDays(delivered_at, 2)
  const currentDifferenceInHours = differenceInHours(dayOfEnding, new Date())
  let text = null
  if (currentDifferenceInHours === 0) {
    const currentDifferenceInMinutes = differenceInMinutes(
      dayOfEnding,
      new Date()
    )
    text = `${currentDifferenceInMinutes}分钟`
  } else {
    text = `${currentDifferenceInHours}小时`
  }
  return text
}

const inToteFreeServiceReturnTime = delivered_at => {
  if (!delivered_at) return null
  const dayOfEnding = addDays(delivered_at, 2)
  const currentDifferenceInMinutes = differenceInMinutes(
    dayOfEnding,
    new Date()
  )
  return currentDifferenceInMinutes > 0
}

export { getDeathLineText, inToteFreeServiceReturnTime }
