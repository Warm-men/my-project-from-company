import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { inject, observer } from 'mobx-react'
import Image from '../../image'
@inject('currentCustomerStore')
@observer
class ProductSeason extends Component {
  translateSeason = () => {
    const {
      selected_option
    } = this.props.currentCustomerStore.season_sort_switch
    return translateSeason(selected_option)
  }

  render() {
    const {
      selected_option,
      options
    } = this.props.currentCustomerStore.season_sort_switch
    if (!selected_option || !options.length) {
      return null
    }
    const selectedOption = this.translateSeason()
    return (
      <View style={styles.seasonView}>
        <Image
          style={styles.seasonTips}
          source={require('../../../../assets/images/product_list/season_tips.png')}
        />
        <TouchableOpacity
          style={styles.seasonButton}
          onPress={this.props.selectedSeasonView}>
          <Text style={styles.seasonButtonText}>{selectedOption}</Text>
          <Icon size={18} name="expand-more" color={'#333'} />
        </TouchableOpacity>
      </View>
    )
  }
}

const translateSeason = selected_option => {
  switch (selected_option) {
    case 'winter_spring':
      return '春季优先'
    case 'spring':
      return '春季优先'
    case 'spring_summer':
      return '夏季优先'
    case 'summer':
      return '夏季优先'
    case 'summer_fall':
      return '秋季优先'
    case 'fall':
      return '秋季优先'
    case 'fall_winter':
      return '冬季优先'
    case 'winter':
      return '冬季优先'
  }
}
@inject('currentCustomerStore', 'panelStore')
@observer
class SelectedSeason extends Component {
  returnOptions = () => {
    const { selectedSeason, currentCustomerStore } = this.props
    const { selected_option, options } = currentCustomerStore.season_sort_switch
    let Item = []
    options.map((item, index) => {
      const selected = selected_option === item
      Item.push(
        <TouchableOpacity
          style={[
            styles.optionsView,
            !index && { borderBottomColor: '#F3F3F3', borderBottomWidth: 0.5 }
          ]}
          key={index}
          onPress={() => {
            selectedSeason(item)
          }}>
          <Text
            style={[styles.optionsViewText, selected && { color: '#F26043' }]}>
            {translateSeason(item)}
          </Text>
        </TouchableOpacity>
      )
    })
    Item.push(
      <TouchableOpacity
        key={options.length}
        style={[
          styles.optionsView,
          { borderTopWidth: 8, borderTopColor: '#F7F7F7' }
        ]}
        onPress={this.hidePanel}>
        <Text style={styles.optionsViewText}>取消</Text>
      </TouchableOpacity>
    )
    return Item
  }

  hidePanel = () => {
    this.props.panelStore.hide()
  }
  render() {
    return <View>{this.returnOptions()}</View>
  }
}

const styles = StyleSheet.create({
  seasonView: {
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  seasonTips: {
    width: 51,
    height: 20,
    marginRight: 3
  },
  seasonButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  seasonButtonText: {
    fontSize: 12,
    color: '#5E5E5E',
    marginHorizontal: 4
  },
  optionsView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 48
  },
  optionsViewText: {
    fontSize: 14,
    color: '#5E5E5E'
  }
})

export { ProductSeason, SelectedSeason }
