import { getMonth } from 'date-fns'

export default (() => {
  const currentMonth = getMonth(new Date()) + 1
  let season = []
  if (currentMonth >= 3 && currentMonth <= 5) {
    season.push('spring')
  } else if (currentMonth >= 6 && currentMonth <= 8) {
    season.push('summer')
  } else if (currentMonth >= 9 && currentMonth <= 10) {
    season.push('fall')
  } else {
    season.push('winter')
  }
  return season
})()
