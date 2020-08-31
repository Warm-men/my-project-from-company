import React, { PureComponent } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { RatingStar } from './index'

export default class StarAndRating extends PureComponent {
  returnTitle = () => {
    const { type } = this.props
    let title
    switch (type) {
      case 'style':
        title = `款式`
        break
      case 'quality':
        title = `质量`
        break
      case 'expensiveness':
        title = `品质感`
        break
    }
    return title
  }

  returnName = () => {
    const { type, islike } = this.props
    let name
    switch (type) {
      case 'style':
        if (islike) {
          name = `喜欢的地方`
        } else {
          name = `不喜欢的地方`
        }
        break
      case 'quality':
        if (islike) {
          name = `满意的地方`
        } else {
          name = `不满意的地方`
        }
        break
    }
    return name
  }

  render() {
    const { data, rating, type } = this.props
    if (type == `expensiveness` && !rating) {
      return null
    }
    if (type !== `expensiveness` && !data.length && !rating) {
      return null
    }
    const showSubTitle =
      !!rating && !!data && !!data.length && type !== `expensiveness`
    const title = this.returnTitle()
    const name = this.returnName()
    return (
      <View style={styles.subComponent}>
        <Text testID="title" style={styles.subTitle}>
          {title}
        </Text>
        <View style={{ flex: 1 }}>
          {!!rating && <RatingStar rating={rating} style={styles.stars} />}
          {showSubTitle && (
            <Text testID="TitleName" style={styles.tips}>
              {name}
            </Text>
          )}
          <View style={styles.wrap}>
            {!!data &&
              !!data.length &&
              type !== `expensiveness` &&
              data.map(item => {
                return (
                  <Text testID="item" key={item} style={styles.itemTitle}>
                    {item}
                  </Text>
                )
              })}
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  itemTitle: {
    color: '#5e5e5e',
    fontSize: 12,
    borderRadius: 13,
    lineHeight: 26,
    marginRight: 8,
    marginBottom: 10,
    backgroundColor: '#f7f7f7',
    overflow: 'hidden',
    paddingHorizontal: 12
  },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', flex: 1 },
  subTitle: { color: '#242424', fontSize: 16, marginRight: 20, lineHeight: 26 },
  subComponent: { flexDirection: 'row', marginTop: 20 },
  stars: { marginTop: 2 },
  tips: {
    fontSize: 12,
    color: '#999',
    marginTop: 16,
    marginBottom: 12
  }
})
