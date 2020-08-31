import { hash_sha256 } from '../hash'

describe('test hash_sha256 func', () => {
  it('test when value === 2121, hash sha256 value', async () => {
    const results = await hash_sha256('2121')
    expect(results).toEqual(
      'b8dc2c143be8994682b08461f46487e05874e59dd9ab65cf973e3a3c67a763aa'
    )
  })
})
