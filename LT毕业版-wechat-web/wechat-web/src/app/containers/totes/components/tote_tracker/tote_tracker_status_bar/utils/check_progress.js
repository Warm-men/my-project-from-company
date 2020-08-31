export const checkProgress = status => {
  let progress = '0%'
  let completedStep = 0
  if (status === 'locked' || status === 'styled') {
    progress = '14.8%'
    completedStep = 1
  } else if (status === 'shipped') {
    progress = '39%'
    completedStep = 2
  } else if (status === 'delivered') {
    progress = '63%'
    completedStep = 3
  } else if (status === 'scheduled_return') {
    progress = '87%'
    completedStep = 4
  }
  return { progress, completedStep }
}
