import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList
} from 'react-native'
import Image from '../image'
import p2d from '../../../src/expand/tool/p2d'
import DashLine from '../dashLine'
import dateFns from 'date-fns'

export default class MultipleTransferView extends Component {
  constructor(props) {
    super(props)
    const { data } = props
    this.state = {
      id: data[0].target_subscription_type_id
    }
  }
  _extractUniqueKey(_, index) {
    return index.toString()
  }
  _listHeaderComponent = () => {
    return <Text style={styles.listHeader}>请选择需要升级的套餐</Text>
  }
  _renderItem = ({ item }) => {
    return <ItemView item={item} setId={this.setId} id={this.state.id} />
  }

  setId = id => {
    this.setState({
      id
    })
  }

  subscriptionMigration = () => {
    const { id } = this.state
    const { subscriptionMigration } = this.props
    subscriptionMigration && subscriptionMigration(id)
  }

  render() {
    const { data, customerService } = this.props
    return (
      <View style={styles.container}>
        <Image
          source={require('../../../assets/images/account/multiple_transfer_banner.png')}
        />
        <FlatList
          bounces={false}
          style={styles.flatView}
          keyExtractor={this._extractUniqueKey}
          data={data}
          extraData={this.state.id}
          ListHeaderComponent={this._listHeaderComponent}
          renderItem={this._renderItem}
        />
        <View style={styles.buttonView}>
          <TouchableOpacity
            style={styles.buttonViewLeft}
            onPress={customerService}>
            <Text style={styles.buttonViewLeftText}>咨询客服</Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="subscriptionMigration"
            style={styles.buttonViewRight}
            onPress={this.subscriptionMigration}>
            <Text style={styles.buttonViewRightText}>立即升级</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

export class ItemView extends Component {
  setId = () => {
    const { item, setId } = this.props
    setId && setId(item.target_subscription_type_id)
  }
  render() {
    const { item, id } = this.props
    const time = dateFns.format(item.next_billing_at, 'YYYY.MM.DD')
    const isSelected = item.target_subscription_type_id === id
    const url = isSelected
      ? require('../../../assets/images/me_style/focus_button.png')
      : require('../../../assets/images/me_style/blur_button.png')
    return (
      <TouchableOpacity
        style={[styles.itemView, isSelected && styles.isSelectedItemView]}
        onPress={this.setId}>
        <Image source={url} style={styles.selectedIcon} />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
          <DashLine lineWidth={1} style={styles.dashLine} />
          <View>
            <View style={styles.tipsView}>
              <Image
                style={styles.icon}
                source={require('../../../assets/images/account/transfer_tote_num.png')}
              />
              <Text style={styles.tips}>
                兑换为<Text style={styles.keyword}>{item.tote_count}</Text>
                个衣箱 | 每箱
                <Text style={styles.keyword}>{item.clothing_count}</Text>
                件衣服+
                <Text style={styles.keyword}>{item.accessory_count}</Text>
                件配饰
              </Text>
            </View>
            <View style={[styles.tipsView, { marginBottom: 0 }]}>
              <Image
                style={styles.icon}
                source={require('../../../assets/images/account/multiple_transfer_time.png')}
              />
              <Text style={styles.tips}>
                会员有效期至<Text style={styles.keyword}>{time}</Text>
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  flatView: {
    paddingTop: 32,
    paddingHorizontal: 16,
    width: '100%',
    backgroundColor: '#f7f7f7'
  },
  listHeader: {
    fontSize: 16,
    color: '#242424',
    marginBottom: 16
  },
  itemView: {
    width: p2d(343),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#D9D9D9',
    borderRadius: 4,
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: '#fff',
    paddingVertical: 16
  },
  isSelectedItemView: {
    backgroundColor: '#F9EAE8',
    borderColor: '#E85C40'
  },
  selectedIcon: {
    height: 18,
    width: 18,
    marginHorizontal: p2d(16)
  },
  dashLine: {
    width: p2d(273),
    marginVertical: 10
  },
  title: {
    color: '#242424',
    fontSize: 18,
    fontWeight: '600'
  },
  tipsView: {
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  tips: {
    fontSize: 13,
    color: '#666'
  },
  keyword: {
    color: '#121212',
    fontWeight: '600'
  },
  icon: {
    marginRight: 6
  },
  buttonView: {
    height: 56,
    width: p2d(375),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonViewLeft: {
    height: 40,
    width: 164,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8
  },
  buttonViewLeftText: {
    fontSize: 14,
    color: '#666'
  },
  buttonViewRight: {
    height: 40,
    width: 164,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    backgroundColor: '#EA5C39'
  },
  buttonViewRightText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600'
  }
})
