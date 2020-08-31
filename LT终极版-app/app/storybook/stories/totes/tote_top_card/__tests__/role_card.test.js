import React from 'react'
import ImageTouchCard from '../image_touch_card'
import renderer from 'react-test-renderer'

describe('role card', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(<ImageTouchCard type={'role_card'} onClick={jest.fn()} />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
