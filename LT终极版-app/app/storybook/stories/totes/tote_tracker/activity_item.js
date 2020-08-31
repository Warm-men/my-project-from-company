/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import Image from '../../image'

export default class ActivityItem extends PureComponent {
  _didSelectedItem = () => {
    const { didSelectedActivityItem } = this.props
    didSelectedActivityItem && didSelectedActivityItem()
  }

  render() {
    const { index } = this.props
    return (
      <View style={[!index && styles.productFirstItem, styles.productItem]}>
        <TouchableOpacity onPress={this._didSelectedItem}>
          <Image
            source={require('../../../../assets/images/activities/gift_placeholder.png')}
            style={styles.cataloguePhotos}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  productFirstItem: {
    marginLeft: 8
  },
  productItem: {
    marginRight: 8,
    paddingTop: 20
  },
  cataloguePhotos: {
    width: 76,
    height: 110
  }
})
