import ImageView from '../../image'
import AddToClosetButton from '../../../../src/containers/closet/add_to_closet_button'
import React, { PureComponent } from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import ToteSlot from '../../products/tote_slot'
import p2d from '../../../../src/expand/tool/p2d'

export default class ProductItem extends PureComponent {
  render() {
    const { data, column, getReportData } = this.props
    const { title, catalogue_photos, tote_slot } = data
    const description = column + '-' + title
    const uri = catalogue_photos[0] ? catalogue_photos[0].full_url : ''
    const showToteSlot = tote_slot >= 2
    return (
      <TouchableOpacity
        testID="test-product-item"
        style={styles.touch}
        activeOpacity={0.6}
        delayPressIn={100}
        onPress={this._didSelectedItem}>
        <ImageView
          description={description}
          style={styles.imageViewItem}
          source={{ uri }}
        />
        <AddToClosetButton
          buttonStyle={styles.closetButton}
          getReportData={getReportData}
          product={data}
        />
        {showToteSlot && (
          <ToteSlot
            testID="tote-slot"
            slotNum={tote_slot}
            style={styles.toteSlot}
            type={data.type}
          />
        )}
      </TouchableOpacity>
    )
  }

  _didSelectedItem = () => {
    const { didSelectedItem, data } = this.props
    didSelectedItem && didSelectedItem(data)
  }
}

const styles = StyleSheet.create({
  imageViewItem: {
    width: p2d(114),
    height: p2d(171),
    marginTop: 1
  },
  touch: {
    marginBottom: 24,
    marginRight: p2d(8)
  },
  closetButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 8,
    transform: [{ scale: 0.8 }]
  },
  toteSlot: {
    position: 'absolute',
    left: 4,
    top: 8
  }
})
