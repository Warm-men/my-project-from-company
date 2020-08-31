/* @flow */

import React, { Component } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import p2d from '../../../../src/expand/tool/p2d'
import SelectButton from './tote_return_free_service_select_button'
import { inject } from 'mobx-react'

@inject('totesStore')
export default class ToteReturnFreeService extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectStatus: 'allLeft'
    }
  }
  _didSelectedItem = type => {
    const { updateSelectedItem } = this.props
    if (type === this.state.selectStatus) {
      return
    }
    this.setState(
      {
        selectStatus: type
      },
      () => {
        updateSelectedItem(type)
      }
    )
  }
  _isShowTopBanner = () => {
    const { isOnlyReturnToteFreeService, currentTote, totesStore } = this.props
    const { current_totes } = totesStore
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
  _getBottomBannerText = () => {
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
    const { isOnlyReturnToteFreeService } = this.props
    const title = isOnlyReturnToteFreeService ? '归还自在选' : '新衣箱自在选'
    const isShowTopBanner = this._isShowTopBanner()
    const {
      purchase_slots,
      bannerText,
      purchaseSlotsText,
      purchaseSlotsTextSub
    } = this._getBottomBannerText()
    return (
      <View
        style={[
          styles.container,
          !isOnlyReturnToteFreeService && styles.border
        ]}>
        {isShowTopBanner && (
          <View testID={'top-banner'} style={styles.freeServiceBannerView}>
            <Text style={styles.freeServiceBannerText}>
              {`为节约你的宝贵时间\n新衣箱自在选请跟随旧衣箱同时寄回`}
            </Text>
          </View>
        )}
        <View style={styles.descriptionView}>
          <Text style={styles.descriptionTitle}>{title}</Text>
          <Text style={styles.descriptionText}>
            {
              '你已启用自在选，每个衣箱多2个衣位，如果满意可留下继续穿，或在签收48小时内寄回并确认顺丰取件'
            }
          </Text>
        </View>
        <View style={styles.buttonView}>
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
        </View>
        <View style={styles.bottomBannerView}>
          {purchase_slots === 1 ? (
            <Text style={styles.bottomBannerText}>
              <Text style={styles.highLight}>{purchaseSlotsText}</Text>
              {purchaseSlotsTextSub}
            </Text>
          ) : (
            <Text style={styles.bottomBannerText}>{bannerText}</Text>
          )}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  border: {
    borderBottomColor: '#F7F7F7',
    borderBottomWidth: p2d(7)
  },
  freeServiceBannerView: {
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEF8F2'
  },
  freeServiceBannerText: {
    fontSize: 12,
    color: '#BD8846',
    textAlign: 'center',
    letterSpacing: 0.4,
    lineHeight: 17
  },
  descriptionView: {
    marginVertical: 24,
    paddingHorizontal: 16
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 10
  },
  descriptionText: {
    fontSize: 13,
    color: '#999',
    lineHeight: 22
  },
  buttonView: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'space-between',
    paddingHorizontal: p2d(76)
  },
  bottomBannerView: {
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: '#E9E9E9',
    backgroundColor: '#F7F7F7'
  },
  bottomBannerText: {
    fontSize: 12,
    color: '#5E5E5E',
    letterSpacing: 0.4,
    lineHeight: 22
  },
  highLight: {
    fontWeight: '500',
    color: '#242424'
  }
})
