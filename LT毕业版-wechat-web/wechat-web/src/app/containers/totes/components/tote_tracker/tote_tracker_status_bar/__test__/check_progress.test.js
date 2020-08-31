import { checkProgress } from 'src/app/containers/totes/components/tote_tracker/tote_tracker_status_bar/utils/check_progress.js'

describe('Test Tote Status Progress', () => {
  it('Tote Status Progress Locked', () => {
    expect(checkProgress('locked')).toEqual({
      progress: '14.8%',
      completedStep: 1
    })
  })
  it('Tote Status Progress styled', () => {
    expect(checkProgress('styled')).toEqual({
      progress: '14.8%',
      completedStep: 1
    })
  })
  it('Tote Status Progress shipped', () => {
    expect(checkProgress('shipped')).toEqual({
      progress: '39%',
      completedStep: 2
    })
  })
  it('Tote Status Progress delivered', () => {
    expect(checkProgress('delivered')).toEqual({
      progress: '63%',
      completedStep: 3
    })
  })
  it('Tote Status Progress scheduled_return', () => {
    expect(checkProgress('scheduled_return')).toEqual({
      progress: '87%',
      completedStep: 4
    })
  })
})
