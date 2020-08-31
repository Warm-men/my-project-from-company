import React, { PureComponent } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import PropTypes from 'prop-types'
import p2d from '../../../src/expand/tool/p2d'

export default class AlertPartsInToteItem extends PureComponent {
  render() {
    const { content, title, hasBorder } = this.props
    if (!content.product_parts.length) return null
    return (
      <View
        style={[styles.partsWrapView, hasBorder && styles.partsWrapViewBorder]}>
        <Text style={styles.partsTitleText}>{title}</Text>
        <View style={styles.partsContentView}>
          {content.product_parts.map(item => {
            return (
              <View key={item.product_title} style={styles.partItemView}>
                <Text numberOfLines={1} style={styles.partItemTitle}>
                  {'• ' + item.product_title}
                </Text>
                <View style={styles.partItemViewWrap}>
                  {item.part_titles.map((part, index) => {
                    return (
                      <Text key={index} style={styles.partTitle}>
                        {part}
                      </Text>
                    )
                  })}
                </View>
              </View>
            )
          })}
          {!!content.bag_tips && (
            <View style={styles.partItemView}>
              <Text style={styles.partItemTitleSub}>
                {'* '}
                {content.bag_tips}
              </Text>
            </View>
          )}
        </View>
      </View>
    )
  }
}

AlertPartsInToteItem.propTypes = {
  content: PropTypes.object,
  title: PropTypes.string,
  hasBorder: PropTypes.bool
}

const styles = StyleSheet.create({
  partsWrapView: {
    width: p2d(314),
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 10
  },
  partsWrapViewBorder: {
    borderTopColor: '#F3F3F3',
    borderTopWidth: 1
  },
  partsTitleText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 24
  },
  partsContentView: {
    marginVertical: 10
  },
  partItemView: {
    height: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  partItemTitle: { fontSize: 14, color: '#666', flex: 1 },
  partItemTitleSub: {
    fontSize: 12,
    color: '#666',
    flex: 1
  },
  partTitle: {
    marginLeft: 8,
    paddingHorizontal: 5,
    lineHeight: 20,
    backgroundColor: '#FDF9F2',
    fontSize: 12,
    borderRadius: 3,
    color: '#DBA956'
  },
  partItemViewWrap: {
    flexDirection: 'row-reverse',
    alignItems: 'center'
  }
})
