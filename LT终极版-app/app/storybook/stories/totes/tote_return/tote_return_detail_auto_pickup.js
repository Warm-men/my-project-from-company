import React, { Component } from 'react'
import { View, StyleSheet, Text, ScrollView } from 'react-native'
import dateFns from 'date-fns'
import ToteReturnScheduleProductsCard from './tote_return_schedule_products_card'
import ToteReturnScheduleFreeServiceDetails from './tote_return_schedule_free_service_detail'

export default class ToteReturnDetailAutoPickup extends Component {
  render() {
    const { tote, isToteScheduledReturn } = this.props
    const { scheduled_auto_pickup, allowed_commands } = isToteScheduledReturn
      ? tote.scheduled_return
      : tote.tote_free_service.scheduled_return
    const toteFreeService = tote.tote_free_service
    const {
      address_1,
      city,
      district,
      requested_pickup_at,
      telephone,
      full_name,
      state,
      shipping_code
    } = scheduled_auto_pickup
    const canScheduleAutoPickup = allowed_commands.includes(
      'schedule_auto_pickup'
    )
    const disabledModifyScheduleAutoPickup = !canScheduleAutoPickup
    const requestedPickupAt =
      requested_pickup_at &&
      dateFns.format(requested_pickup_at, 'YYYY-MM-DD HH:mm')
    return (
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <Text style={styles.title}>{'预约信息'}</Text>
          <View style={styles.infoView}>
            <View style={styles.infobox}>
              <View style={[styles.marginBottom, styles.infocolumn]}>
                <Text style={styles.leftrow}>{'上门时间'}</Text>
                <Text style={styles.rightrow}>{requestedPickupAt}</Text>
              </View>
              <View style={[styles.marginBottom, styles.infocolumn]}>
                <Text style={styles.leftrow}>{'寄件人'}</Text>
                <Text style={styles.rightrow}>{full_name}</Text>
              </View>
              <View style={[styles.marginBottom, styles.infocolumn]}>
                <Text style={styles.leftrow}>{'手机号码'}</Text>
                <Text style={styles.rightrow}>{telephone}</Text>
              </View>
              <View style={styles.infocolumn}>
                <Text style={styles.leftrow}>{'寄件地址'}</Text>
                <Text style={styles.rightrow}>
                  {`${state}${city}${district}${address_1}`}
                </Text>
              </View>
            </View>
            <View style={styles.infobox}>
              <View style={[styles.marginBottom, styles.infocolumn]}>
                <Text style={styles.leftrow}>{'顺丰速运'}</Text>
                <Text style={styles.rightrow}>
                  {shipping_code ? shipping_code : '暂无快递单号'}
                </Text>
              </View>
              <View style={styles.infocolumn}>
                <Text style={styles.leftrow}>{'客服电话'}</Text>
                <Text style={[styles.rightrow, styles.redColor]}>
                  {'95338'}
                </Text>
              </View>
            </View>
          </View>
          {isToteScheduledReturn ? (
            <ToteReturnScheduleProductsCard tote={tote} />
          ) : (
            <ToteReturnScheduleFreeServiceDetails
              toteFreeService={toteFreeService}
            />
          )}
          {disabledModifyScheduleAutoPickup && (
            <View style={styles.disabledView}>
              <Text style={styles.disabledText}>
                {`你已更改过一次，不能再次修改预约信息\n如需帮助请联系顺丰客服或自行寄回`}
              </Text>
            </View>
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
  title: {
    marginHorizontal: 16,
    marginBottom: 24,
    marginTop: 29,
    fontSize: 16,
    color: '#333333',
    fontWeight: '500'
  },
  infoView: {
    marginHorizontal: 15
  },
  infobox: {
    paddingVertical: 16,
    paddingHorizontal: 15,
    backgroundColor: '#F7F7F7',
    borderRadius: 2,
    marginBottom: 16
  },
  infocolumn: {
    flexDirection: 'row'
  },
  leftrow: {
    width: 60,
    textAlign: 'left',
    fontSize: 14,
    marginRight: 24,
    color: '#999999'
  },
  rightrow: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    lineHeight: 22,
    marginTop: -4
  },
  redColor: {
    color: '#EA5C39'
  },
  marginBottom: {
    marginBottom: 15
  },
  navigationBar: {
    borderBottomWidth: 0
  },
  returnBtn: {
    marginHorizontal: 15,
    height: 40,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#B2B2AF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12
  },
  disabledView: {
    borderTopWidth: 7,
    borderTopColor: '#F7F7F7',
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 10
  },
  disabledText: {
    color: '#666',
    fontSize: 12,
    lineHeight: 20,
    textAlign: 'center'
  }
})
