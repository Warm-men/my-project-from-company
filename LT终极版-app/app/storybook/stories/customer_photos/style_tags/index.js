/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, Image, FlatList } from 'react-native'
import PropTypes from 'prop-types'
import StyleTag from './style_tag'

export default class StyleTags extends PureComponent {
  _renderItem = ({ item }) => {
    const { defaultSelected, selectedStyleTags, didSelectedItem } = this.props
    const isSelected = defaultSelected
      ? true
      : selectedStyleTags && selectedStyleTags.length
      ? selectedStyleTags.find(tag => {
          return tag.id === item.id
        })
      : false

    return (
      <StyleTag
        key={item.name}
        data={item}
        style={[styles.styleTag]}
        onClick={didSelectedItem}
        title={item.name}
        disabled={defaultSelected}
        isSelected={isSelected}
      />
    )
  }
  _keyExtractor = (item, index) => index.toString()
  render() {
    const { array, selectedStyleTags, hasBottomLine } = this.props
    if (!array || !array.length) {
      return null
    }
    return (
      <View style={styles.container}>
        <View style={styles.styleListTitle}>
          <Image
            style={styles.styleListIcon}
            source={require('../../../../assets/images/customer_photos/style_list_icon.png')}
          />
          <Text style={styles.title}>选择风格</Text>
        </View>
        <FlatList
          extraData={selectedStyleTags}
          data={array}
          style={styles.flatlist}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
        />
        {hasBottomLine ? <View style={styles.bottomLine} /> : null}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingLeft: 15 },
  styleListTitle: { flexDirection: 'row', alignItems: 'center' },
  styleListIcon: { width: 14, height: 14, marginRight: 6 },
  title: { fontSize: 14, color: '#989898', lineHeight: 50 },
  items: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  styleTag: {
    marginRight: 12,
    paddingHorizontal: 20
  },
  fixTagMargin: {
    marginLeft: 22
  },
  bottomLine: {
    flex: 1,
    height: 1,
    marginRight: 12,
    marginTop: 1,
    backgroundColor: '#F2F2F2'
  },
  flatlist: {
    paddingVertical: 5,
    marginLeft: 20
  }
})

StyleTag.defaultProps = {
  array: [],
  defaultSelected: false
}

StyleTag.propTypes = {
  array: PropTypes.array,
  defaultSelected: PropTypes.bool
}
