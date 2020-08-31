import React from 'react'
import StarAndRating from '../tote_rating_details/star_and_rating'
import { shallow } from 'enzyme'
describe('test star and rating', () => {
  beforeEach(() => {
    wrapper = shallow(
      <StarAndRating data={['123']} rating={5} islike={true} type={`style`} />
    )
  })

  it('款式 满意', () => {
    expect(wrapper.find({ testID: 'title' }).prop('children')).toEqual(`款式`)
    expect(wrapper.find({ testID: 'TitleName' }).prop('children')).toEqual(
      `喜欢的地方`
    )
    expect(wrapper.find({ testID: 'item' }).length).toBe(1)
  })

  it('款式 满意 不显示副标题', () => {
    wrapper = shallow(
      <StarAndRating data={[]} rating={5} islike={false} type={`style`} />
    )
    expect(wrapper.find({ testID: 'title' }).prop('children')).toEqual(`款式`)
    expect(wrapper.find({ testID: 'TitleName' }).length).toBe(0)
    expect(wrapper.find({ testID: 'item' }).length).toBe(0)
  })

  it('款式 不满意', () => {
    wrapper = shallow(
      <StarAndRating data={['123']} rating={5} islike={false} type={`style`} />
    )
    expect(wrapper.find({ testID: 'title' }).prop('children')).toEqual(`款式`)
    expect(wrapper.find({ testID: 'TitleName' }).prop('children')).toEqual(
      `不喜欢的地方`
    )
    expect(wrapper.find({ testID: 'item' }).length).toBe(1)
  })

  it('款式 不满意 不显示副标题', () => {
    wrapper = shallow(
      <StarAndRating data={[]} rating={5} islike={false} type={`style`} />
    )
    expect(wrapper.find({ testID: 'title' }).prop('children')).toEqual(`款式`)
    expect(wrapper.find({ testID: 'TitleName' }).length).toBe(0)
    expect(wrapper.find({ testID: 'item' }).length).toBe(0)
  })

  it('质量 满意', () => {
    wrapper = shallow(
      <StarAndRating data={['123']} rating={5} islike={true} type={`quality`} />
    )
    expect(wrapper.find({ testID: 'title' }).prop('children')).toEqual(`质量`)
    expect(wrapper.find({ testID: 'TitleName' }).prop('children')).toEqual(
      `满意的地方`
    )
    expect(wrapper.find({ testID: 'item' }).length).toBe(1)
  })

  it('质量 满意 不显示副标题', () => {
    wrapper = shallow(
      <StarAndRating data={[]} rating={5} islike={true} type={`quality`} />
    )
    expect(wrapper.find({ testID: 'title' }).prop('children')).toEqual(`质量`)
    expect(wrapper.find({ testID: 'TitleName' }).length).toBe(0)
    expect(wrapper.find({ testID: 'item' }).length).toBe(0)
  })

  it('质量 不满意', () => {
    wrapper = shallow(
      <StarAndRating
        data={['123']}
        rating={5}
        islike={false}
        type={`quality`}
      />
    )
    expect(wrapper.find({ testID: 'title' }).prop('children')).toEqual(`质量`)
    expect(wrapper.find({ testID: 'TitleName' }).prop('children')).toEqual(
      `不满意的地方`
    )
    expect(wrapper.find({ testID: 'item' }).length).toBe(1)
  })

  it('质量 不满意 不显示副标题', () => {
    wrapper = shallow(
      <StarAndRating data={[]} rating={5} islike={false} type={`quality`} />
    )
    expect(wrapper.find({ testID: 'title' }).prop('children')).toEqual(`质量`)
    expect(wrapper.find({ testID: 'TitleName' }).length).toBe(0)
    expect(wrapper.find({ testID: 'item' }).length).toBe(0)
  })

  it('品质感 就算data有值都不会显示副标题 ', () => {
    wrapper = shallow(
      <StarAndRating
        data={['123']}
        rating={5}
        islike={false}
        type={`expensiveness`}
      />
    )
    expect(wrapper.find({ testID: 'title' }).prop('children')).toEqual(`品质感`)
    expect(wrapper.find({ testID: 'TitleName' }).length).toBe(0)
    expect(wrapper.find({ testID: 'item' }).length).toBe(0)
  })

  it('品质感 旧数据不显示 ', () => {
    wrapper = shallow(
      <StarAndRating
        data={[]}
        rating={null}
        islike={false}
        type={`expensiveness`}
      />
    )
    expect(wrapper.find({ testID: 'title' }).length).toBe(0)
    expect(wrapper.find({ testID: 'TitleName' }).length).toBe(0)
    expect(wrapper.find({ testID: 'item' }).length).toBe(0)
  })
})
