/* @flow */

import React, { PureComponent } from 'react'
import { View, Dimensions, StyleSheet } from 'react-native'
import { CustomerPhotoItem } from '../customer_photos/customer_photos_in_home'

export default class CustomerPhotosItem extends PureComponent {
  _didSelectedItem = data => {
    const { navigation, hiddenRelated } = this.props
    const id = data.id
    navigation.navigate('CustomerPhotoDetails', { data, hiddenRelated, id })
  }

  render() {
    const { items, onSignIn } = this.props

    const width = Dimensions.get('window').width / 2 - 13
    const leftStyle = { width, marginLeft: 9, marginRight: 4 }
    const rightStyle = { width, marginLeft: 4, marginRight: 9 }
    return (
      <View style={styles.container}>
        <CustomerPhotoItem
          style={leftStyle}
          data={items[0]}
          onSignIn={onSignIn}
          didSelectedItem={this._didSelectedItem}
        />
        {items[1] ? (
          <CustomerPhotoItem
            style={rightStyle}
            data={items[1]}
            onSignIn={onSignIn}
            didSelectedItem={this._didSelectedItem}
          />
        ) : null}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row' }
})
