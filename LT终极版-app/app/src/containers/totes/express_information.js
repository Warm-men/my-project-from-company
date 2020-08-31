/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, FlatList, Text } from 'react-native'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'
import { QCacheNetwork, SERVICE_TYPES } from '../../expand/services/services.js'
import Image from '../../../storybook/stories/image'
import dateFns from 'date-fns'
import LinkText from '../../../storybook/stories/link_text'
import Address from '../../../storybook/stories/totes/express_information_address'

export default class ExpressInformationContainer extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      isloading: true,
      shippingAddress: null
    }

    this.iconSF = require('../../../assets/images/express/shunfeng.png')
    this.iconMessageNormal = require('../../../assets/images/express/message_normal.png')
    this.iconMessageFocus = require('../../../assets/images/express/message_focus.png')
  }
  componentDidMount() {
    this._queryInformation()
  }
  _queryInformation = () => {
    const { tracking_code, toteId } = this.props.navigation.state.params
    QCacheNetwork(
      SERVICE_TYPES.express.QUERY_LABEL_SCANS,
      {
        tracking_code,
        id: toteId
      },
      response => {
        this.setState({
          data: response.data.label_scans,
          isloading: false,
          shippingAddress: response.data.tote.tote_shipping_address
        })
      },
      () => {
        this.setState({ isloading: false })
      }
    )
  }
  _extractUniqueKey = (item, index) => {
    return index.toString()
  }

  _renderItem = ({ item, index }) => {
    const { carrier_message, carrier_updated_at } = item
    return (
      <View style={styles.cell}>
        <View style={styles.cellLeft}>
          {index ? (
            <Image source={this.iconMessageNormal} />
          ) : (
            <Image source={this.iconMessageFocus} />
          )}
          {index !== this.state.data.length - 1 && <View style={styles.line} />}
        </View>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={[styles.messageTime, index && styles.oldMessage]}>
            {dateFns.format(carrier_updated_at, 'YYYY-MM-DD HH:mm:ss')}
          </Text>
          <LinkText style={[styles.message, index && styles.oldMessage]}>
            {carrier_message}
          </LinkText>
        </View>
      </View>
    )
  }
  _goBack = () => {
    this.props.navigation.goBack()
  }
  _listHeaderComponent = () => {
    const { shippingAddress } = this.state
    return (
      <View>
        <Text style={styles.headerTitle}>查看物流</Text>
        <View style={styles.expressInfo}>
          <Image source={this.iconSF} style={styles.iconSF} />
          <View>
            <Text style={styles.expressMessage}>快递公司: 顺丰速运</Text>
            <Text style={styles.expressMessage}>
              快递单号: {this.props.navigation.state.params.tracking_code}
            </Text>
          </View>
        </View>
        {shippingAddress && (
          <Address testID="shipping-address" address={shippingAddress} />
        )}
      </View>
    )
  }

  _listEmptyComponent = () => {
    const { isloading } = this.state
    return isloading ? (
      <View>
        <Text>loading...</Text>
      </View>
    ) : (
      <View style={styles.emptyView}>
        <Image
          source={require('../../../assets/images/express/express_icon.png')}
        />
        <Text style={styles.emptyTitle}>暂无物流信息</Text>
        <Text style={styles.emptyMessage}>因顺丰揽件和扫描快递需要时间</Text>
        <Text style={styles.emptyMessage}>快递信息通常会延迟几个小时显示</Text>
      </View>
    )
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          style={styles.navigationbar}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <FlatList
          keyExtractor={this._extractUniqueKey}
          data={this.state.data}
          extraData={this.state.isloading}
          renderItem={this._renderItem}
          ListHeaderComponent={this._listHeaderComponent}
          ListEmptyComponent={this._listEmptyComponent}
          style={styles.contentView}
        />
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  navigationbar: {
    borderBottomWidth: 0
  },
  contentView: {
    paddingLeft: 20,
    paddingRight: 21
  },
  headerTitle: {
    fontWeight: '600',
    fontSize: 20,
    color: '#333',
    marginTop: 30,
    marginBottom: 30
  },
  iconSF: {
    width: 34,
    height: 34,
    marginRight: 10
  },
  expressInfo: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 15,
    marginBottom: 15
  },
  expressMessage: {
    fontWeight: '400',
    fontSize: 13,
    color: '#333',
    lineHeight: 14,
    paddingBottom: 6
  },
  cell: {
    paddingTop: 15,
    flexDirection: 'row',
    flex: 1,
    marginLeft: 12
  },
  cellLeft: {
    marginRight: 15,
    alignItems: 'center'
  },
  line: {
    width: 1,
    height: '102%',
    backgroundColor: '#e7e7e7'
  },
  messageTime: {
    fontWeight: '400',
    fontSize: 12,
    color: '#666',
    paddingBottom: 6
  },
  message: {
    lineHeight: 20,
    fontWeight: '400',
    fontSize: 14,
    color: '#333',
    paddingBottom: 15
  },
  oldMessage: {
    color: '#bbb'
  },
  emptyView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80
  },
  emptyTitle: {
    fontWeight: '400',
    fontSize: 16,
    color: '#333',
    paddingTop: 20,
    paddingBottom: 10
  },
  emptyMessage: {
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
    color: '#999'
  }
})
