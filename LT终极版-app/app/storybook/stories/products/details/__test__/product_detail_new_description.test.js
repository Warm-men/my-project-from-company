import React from 'react'
import { shallow } from 'enzyme'
import { Description } from '../product_detail_new_description'
describe('描述加底', () => {
  let wrapper, product_digests, description
  beforeEach(() => {
    product_digests = [
      {
        text: '经典的时髦元素',
        start: 29,
        stop: 36
      },
      {
        text: '俏皮的小精灵',
        start: 41,
        stop: 47
      },
      {
        text: '复古韵味十足的连衣裙',
        start: 2,
        stop: 12
      },
      {
        text: '打造出具有线条感的高挑形象',
        start: 86,
        stop: 99
      }
    ]
    description =
      '这款复古韵味十足的连衣裙以清新的米色为主，点缀其上的波点是经典的时髦元素，像一个个俏皮的小精灵带来活力与甜美。别致的方形领口让锁骨和天鹅颈一览无余，X廓形搭配及膝长度的剪裁打造出具有线条感的高挑形象。'
    wrapper = shallow(
      <Description data={product_digests} description={description} />
    )
  })

  it('有描底', () => {
    expect(wrapper.find({ testID: 'digests' }).length).toBe(36)
  })

  it('没有有描底', () => {
    wrapper.setProps({ data: [] })
    expect(wrapper.find({ testID: 'digests' }).length).toBe(0)
  })
})
