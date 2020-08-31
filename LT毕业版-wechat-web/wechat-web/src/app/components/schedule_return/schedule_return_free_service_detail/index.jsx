/* @flow */

import React, { PureComponent } from 'react'
import './index.scss'

const freeServiceAllLeft = {
  title: '你已选择：全部留下',
  content: [
    '1. 期间仍可变更选择，仓库将以实际寄回的的衣位数为准',
    '2. 自在选租赁金50元/衣位，全部留下需100元',
    '3. 如果产生租赁金会在7天内给你发送费用通知',
    '4. 如果要归还，请保留完整吊牌并装入粉袋'
  ]
}
const freeServiceAllReturn = {
  title: '你已选择：我要归还',
  content: [
    '1. 期间仍可变更选择，仓库将以实际寄回的的衣位数为准',
    '2. 自在选租赁金50元/衣位，全部留下需100元',
    '3. 如果产生租赁金会在7天内给你发送费用通知',
    '4. 如果要归还，请保留完整吊牌并装入粉袋'
  ]
}
export default class ToteReturnScheduleFreeServiceDetails extends PureComponent {
  render() {
    const { return_slot_count } = this.props.toteFreeService
    const renderData =
      return_slot_count === 0 ? freeServiceAllLeft : freeServiceAllReturn
    return (
      <div className={'toteFreeServiceDetails'}>
        <div className={'subTitleVeiw'}>
          <div className={'subTitleText'}>{'新衣箱自在选'}</div>
        </div>
        <div className={'returnTypeVeiw'}>
          <div className={'returnText'}>{renderData.title}</div>
          {renderData.content.map((item, index) => {
            return (
              <div className={'text'} key={index}>
                {item}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}
