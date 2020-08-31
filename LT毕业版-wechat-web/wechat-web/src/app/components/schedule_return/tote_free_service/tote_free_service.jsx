/* @flow */

import React, { Component } from 'react'
import SelectButton from './tote_free_service_select_button'
import './index.scss'

export default class ToteReturnFreeService extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectStatus: 'allLeft'
    }
  }
  _didSelectedItem = type => {
    const { updatefreeServiceReturnType } = this.props
    if (type === this.state.selectStatus) {
      return
    }
    this.setState(
      {
        selectStatus: type
      },
      updatefreeServiceReturnType(type)
    )
  }
  isShowTopBanner = () => {
    const {
      isOnlyReturnToteFreeService,
      totes: { current_totes },
      currentTote
    } = this.props
    if (!!isOnlyReturnToteFreeService) {
      return false
    } else {
      if (!currentTote.tote_free_service) {
        return false
      } else if (
        current_totes.length > 1 &&
        current_totes[1].progress_status.status !== 'scheduled_return'
      ) {
        return true
      } else {
        return false
      }
    }
  }
  getBottomBannerText = () => {
    const { isOnlyReturnToteFreeService, currentTote } = this.props
    const { tote_free_service } = isOnlyReturnToteFreeService
      ? currentTote
      : currentTote.scheduled_return
    const {
      hint: { schedule_page_keep, schedule_page_return },
      purchase_slots
    } = tote_free_service
    const bannerText =
      this.state.selectStatus === 'allLeft'
        ? '自在选租赁金50元/衣位，全部留下需100元，如果产生租赁金会在7天内给你发送费用通知'
        : '成功归还2个衣位的衣服无需租赁金，只归还1个衣位的衣服将产生50元租赁金，请将要归还的衣服保留完整吊牌装入粉袋内归还。'
    const purchaseSlotsText =
      purchase_slots === 1 && this.state.selectStatus === 'allLeft'
        ? schedule_page_keep
        : schedule_page_return
    const purchaseSlotsTextSub =
      purchase_slots === 1 && this.state.selectStatus === 'allLeft'
        ? '如果产生租赁金会在7天内给你发送费用通知'
        : '请将要归还的衣服保留完整吊牌装入粉袋内归还'
    return {
      purchase_slots,
      bannerText,
      purchaseSlotsText,
      purchaseSlotsTextSub
    }
  }
  render() {
    const {
      purchase_slots,
      bannerText,
      purchaseSlotsText,
      purchaseSlotsTextSub
    } = this.getBottomBannerText()
    const { isOnlyReturnToteFreeService } = this.props
    const title = isOnlyReturnToteFreeService ? '归还自在选' : '新衣箱自在选'
    const isShowTopBanner = this.isShowTopBanner()
    return (
      <div>
        {isShowTopBanner && (
          <div className={'freeServiceBannerView'}>
            <div className={'freeServiceBannerText'}>
              为节约你的宝贵时间
              <br />
              新衣箱自在选请跟随旧衣箱同时寄回
            </div>
          </div>
        )}
        <div className={'descriptionView'}>
          <div className={'descriptionTitle'}>{title}</div>
          <div className={'descriptionText'}>
            你已启用自在选，每个衣箱多2个衣位，如果满意可留下继续穿，或在签收48小时内寄回并确认顺丰取件
          </div>
        </div>
        <div className={'buttonView'}>
          <SelectButton
            onPress={this._didSelectedItem}
            type={'allLeft'}
            text={'全部留下'}
            selectStatus={this.state.selectStatus}
          />
          <SelectButton
            onPress={this._didSelectedItem}
            type={'allReturn'}
            text={'我要归还'}
            selectStatus={this.state.selectStatus}
          />
        </div>
        <div className={'bottomBannerView'}>
          {purchase_slots === 1 ? (
            <div className="bottomBannerText">
              <span className="highLight">{purchaseSlotsText}</span>
              {purchaseSlotsTextSub}
            </div>
          ) : (
            <div className="bottomBannerText">{bannerText}</div>
          )}
        </div>
      </div>
    )
  }
}
