import React from 'react'
import renderer from 'react-test-renderer'
import SelectButton from '../tote_return_free_service_select_button'

describe('select button in tote return free service', () => {
  it('should render correctly when focus', () => {
    const tree = renderer
      .create(
        <SelectButton text={'全部留下'} type="focus" selectStatus="focus" />
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('should render correctly when focus', () => {
    const tree = renderer
      .create(
        <SelectButton text={'全部留下'} type="focus" selectStatus="not-focus" />
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })
})
