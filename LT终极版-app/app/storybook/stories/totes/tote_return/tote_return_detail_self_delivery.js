import React, { PureComponent } from 'react'
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import ToteReturnScheduleProductsCard from './tote_return_schedule_products_card'
import dateFns from 'date-fns'
import Icon from 'react-native-vector-icons/EvilIcons'
import ToteReturnScheduleFreeServiceDetails from './tote_return_schedule_free_service_detail'

export default class ToteReturnDetailSelfDelivery extends PureComponent {
  render() {
    const {
      gotoSeflDeliveryGuide,
      tote,
      copyContent,
      isToteScheduledReturn
    } = this.props
    const { scheduled_self_delivery } = isToteScheduledReturn
      ? tote.scheduled_return
      : tote.tote_free_service.scheduled_return
    const toteFreeService = tote.tote_free_service
    const latestReturnAt =
      !!scheduled_self_delivery &&
      dateFns.format(
        scheduled_self_delivery.latest_return_at,
        'YYYY年MM月DD日 HH:mm'
      )
    const shippingCode =
      !!scheduled_self_delivery && scheduled_self_delivery.shipping_code
    const deathLineText =
      latestReturnAt &&
      `请在${latestReturnAt}前务必上传顺丰快递单号，否则会影响新衣箱的下单或者产生商品滞还金`
    return (
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <View style={styles.detailContent}>
            <View style={styles.viewWrapper}>
              <View style={styles.titleView}>
                <Text style={styles.titleText}>{'寄回地址'}</Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={copyContent}
                  style={styles.buttonView}>
                  <Text style={styles.buttonText}>{'复制'}</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.descriptionText}>{tote.fc_address}</Text>
            </View>
            {!!deathLineText && !shippingCode && (
              <View style={styles.viewWrapper}>
                <View style={styles.titleView}>
                  <Text style={styles.titleText}>{'寄回时间'}</Text>
                </View>
                <Text style={styles.descriptionText}>{deathLineText}</Text>
              </View>
            )}
            <View style={styles.viewWrapper}>
              <View style={styles.titleView}>
                <Text style={styles.titleText}>{'寄回方式'}</Text>
              </View>
              <View style={styles.guideView}>
                <Text style={styles.descriptionText}>
                  {'可自行联系顺丰或使用丰巢智能柜自助寄回'}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={gotoSeflDeliveryGuide}
                  style={styles.guideButtonView}>
                  <Text style={styles.guideText}>{'丰巢寄回指南'}</Text>
                  <Icon name={'chevron-right'} size={28} style={styles.icon} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.viewWrapper}>
              <View style={styles.titleView}>
                <Text style={styles.titleText}>{'快递公司'}</Text>
              </View>
              <Text style={styles.descriptionText}>
                {'顺丰快递运费到付，其他快递不接受到付'}
              </Text>
            </View>
          </View>
          {isToteScheduledReturn ? (
            <ToteReturnScheduleProductsCard tote={tote} />
          ) : (
            <ToteReturnScheduleFreeServiceDetails
              toteFreeService={toteFreeService}
            />
          )}
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  viewWrapper: {
    paddingBottom: 15,
    marginHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2'
  },
  detailContent: {
    marginTop: 15
  },
  titleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 17
  },
  titleText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500'
  },
  buttonView: {
    width: 48,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    borderColor: '#B2B2AF',
    borderWidth: StyleSheet.hairlineWidth
  },
  buttonText: {
    fontSize: 13,
    color: '#666'
  },
  descriptionText: {
    marginTop: 10,
    fontSize: 13,
    color: '#999',
    lineHeight: 24,
    marginRight: 7
  },
  guideView: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  guideText: {
    color: '#EA5C39',
    lineHeight: 24,
    fontSize: 13
  },
  guideButtonView: {
    marginTop: 10,
    flexDirection: 'row'
  },
  icon: {
    marginTop: 1,
    marginLeft: -9,
    color: '#EA5C39'
  }
})
