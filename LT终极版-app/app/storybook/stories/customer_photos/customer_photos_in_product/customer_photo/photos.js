/* @flow */

import React, { PureComponent } from 'react'
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import p2d from '../../../../../src/expand/tool/p2d'
import Image from '../../../image'

export default class Photos extends PureComponent {
  _extractUniqueKey(_, index) {
    return index.toString()
  }

  _renderItem = ({ item, index }) => {
    return <Photo item={item} index={index} onClick={this.props.onClick} />
  }

  render() {
    const { photos } = this.props
    return (
      <View style={styles.container}>
        <FlatList
          bounces={false}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          keyExtractor={this._extractUniqueKey}
          data={photos}
          renderItem={this._renderItem}
        />
      </View>
    )
  }
}

class Photo extends PureComponent {
  onClick = () => {
    const { onClick, index } = this.props
    onClick && onClick(index)
  }

  render() {
    const { item } = this.props
    return (
      <TouchableOpacity onPress={this.onClick}>
        <Image style={styles.photo} source={{ uri: item && item.mobile_url }} />
      </TouchableOpacity>
    )
  }
}

Photos.defaultProps = {
  photos: [{ mobile_url: '' }]
}

Photos.propTypes = {
  photos: PropTypes.array,
  onClick: PropTypes.func
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingLeft: 15 },
  photo: {
    width: p2d(167),
    height: p2d(222),
    borderRadius: 4,
    marginRight: 8,
    overflow: 'hidden',
    backgroundColor: '#f3f3f3'
  }
})
