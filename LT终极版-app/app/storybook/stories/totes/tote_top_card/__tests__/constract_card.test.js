import React from 'react'
import ImageTouchCard from '../image_touch_card'
import renderer from 'react-test-renderer'

describe('constract card', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(<ImageTouchCard type={'constract'} onClick={jest.fn()} />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
