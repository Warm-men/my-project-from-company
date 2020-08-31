import React, { PureComponent } from 'react'
import { StyleSheet, ScrollView, View } from 'react-native'
import PropTypes from 'prop-types'
import p2d from '../../../src/expand/tool/p2d'
import AlertPartsInToteItem from './parts_in_tote_item'

class AlertPartsInTote extends PureComponent {
  render() {
    const { message } = this.props
    const { current, history } = message
    let Label = View
    if (current.product_parts.length + history.product_parts.length > 8) {
      Label = ScrollView
    }
    return (
      <Label
        style={styles.scrollViewContainer}
        showsHorizontalScrollIndicator={false}>
        <AlertPartsInToteItem
          content={current}
          title="归还衣箱时，请不要遗漏以下商品的配件，以免影响新衣箱发出"
        />
        <AlertPartsInToteItem
          content={history}
          title="之前衣箱遗留商品配件"
          hasBorder={true}
        />
      </Label>
    )
  }
}

AlertPartsInTote.propTypes = {
  message: PropTypes.object,
  title: PropTypes.string
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    maxHeight: p2d(400)
  }
})

export default AlertPartsInTote
