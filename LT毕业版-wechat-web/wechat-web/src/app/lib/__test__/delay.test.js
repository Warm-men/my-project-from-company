import delay from '../delay'

describe('test promise delay func', () => {
  it('test delay 3000ms resolve', async () => {
    const resolveResult = await delay(3000)
    expect(resolveResult).toBe(undefined)
  })
  it('test delay 3000ms rejects', () => {
    expect(delay(3000)).rejects.toBe('')
  })
})
