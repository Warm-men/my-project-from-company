import React, { PureComponent } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import p2d from '../../../../src/expand/tool/p2d'
import Image from '../../../../storybook/stories/image'
export default class WelfareIntroduction extends PureComponent {
  render() {
    const { title, logoUrl, description, subDescription } = this.props
    return (
      <View style={styles.introItemView}>
        <Image
          style={styles.logoImage}
          resizeMode={'contain'}
          source={{ uri: logoUrl }}
        />
        <View style={styles.itemView}>
          <Text style={styles.introItemTitle}>{title}</Text>
          <Text style={styles.introItemDescriptiom}>
            {description}
            {!!subDescription && (
              <Text style={styles.subDescription}>
                {'\n'}
                {subDescription}
              </Text>
            )}
          </Text>
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  introItemView: {
    paddingHorizontal: p2d(25),
    flexDirection: 'row',
    marginBottom: p2d(30)
  },
  logoImage: {
    marginTop: 10,
    marginRight: 15,
    width: p2d(48),
    height: p2d(48)
  },
  itemView: {
    flex: 1,
    marginLeft: p2d(15)
  },
  introItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#242424',
    marginVertical: p2d(8)
  },
  introItemDescriptiom: {
    color: '#5E5E5E',
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '400'
  },
  subDescription: {
    fontSize: 12,
    color: '#000000'
  }
})
