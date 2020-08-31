import React, { PureComponent } from 'react'
import { ScrollView, StyleSheet, View, Text } from 'react-native'

const weather = { cold: '寒冷', mild: '舒适', warm: '炎热' }
export default class StickyFilter extends PureComponent {
  render() {
    const { filter } = this.props
    if (!filter || !this.showStickyView()) {
      return null
    }
    return (
      <View style={styles.filterSticky}>
        <ScrollView
          horizontal={true}
          contentContainerStyle={styles.scroll}
          showsHorizontalScrollIndicator={false}>
          {Object.entries(filter).map(categories => {
            return filter[categories[0]].map((item, index) => {
              return (
                <View style={styles.filterCellSelect} key={index}>
                  <Text style={styles.filterContentSelect}>
                    {weather[item] ? weather[item] : item}
                  </Text>
                </View>
              )
            })
          })}
          <View style={styles.line} />
        </ScrollView>
      </View>
    )
  }

  showStickyView = () => {
    const { filter } = this.props
    return Object.entries(filter).filter(
      categories => filter[categories[0]].length > 0
    ).length
  }
}

const styles = StyleSheet.create({
  filterSticky: {
    height: 44,
    position: 'absolute',
    zIndex: 1000,
    width: '100%',
    backgroundColor: 'white'
  },
  filterCellSelect: {
    height: 20,
    margin: 12,
    marginLeft: 5,
    marginRight: 7,
    paddingLeft: 5,
    paddingRight: 5,
    justifyContent: 'center',
    backgroundColor: '#000',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  filterContentSelect: {
    fontSize: 12,
    color: 'white'
  },
  scroll: {
    paddingHorizontal: 12,
    alignItems: 'center'
  }
})
