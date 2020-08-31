import React, { PureComponent } from 'react'
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native'

export default class SearchProductHeader extends PureComponent {
  getFilterViews = categories => {
    const { filter, filterList, onPressItem } = this.props
    return (
      <View>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {filterList[categories[0]] instanceof Array
            ? filterList[categories[0]].map((item, index) => {
                return (
                  <FilterItem
                    filterCategory={categories[0]}
                    key={index}
                    item={item}
                    onPressItem={onPressItem}
                    select={
                      filter &&
                      filter[categories[0]] &&
                      filter[categories[0]].length &&
                      filter[categories[0]].filter(key => key === item.key)
                        .length
                    }
                  />
                )
              })
            : null}
        </ScrollView>
        {filterList[categories[0]] instanceof Array ? (
          <View style={styles.line} />
        ) : null}
      </View>
    )
  }

  render() {
    const { filterList } = this.props
    if (!filterList) {
      return null
    }
    return (
      <View style={styles.container}>
        {Object.entries(filterList).map(categories => {
          return this.getFilterViews(categories)
        })}
      </View>
    )
  }
}

class FilterItem extends PureComponent {
  didSelectedItem = () => {
    const { onPressItem, filterCategory, item } = this.props
    onPressItem && onPressItem(item.key, filterCategory)
  }
  render() {
    const { item, select } = this.props
    return (
      <View>
        <TouchableOpacity activeOpacity={0.6} onPress={this.didSelectedItem}>
          <View style={select ? styles.filterCellSelect : styles.filterCell}>
            <Text
              style={
                select ? styles.filterContentSelect : styles.filterContent
              }>
              {item.text}
            </Text>
            {select ? (
              <Image
                style={styles.cancelIcon}
                source={require('../../../assets/images/closet/close.png')}
              />
            ) : null}
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  line: {
    backgroundColor: '#F3F3F3',
    height: 0.5,
    flex: 1,
    marginLeft: 16
  },
  filterCell: {
    height: 20,
    margin: 12,
    paddingLeft: 5,
    paddingRight: 5,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center'
  },
  filterCellSelect: {
    height: 20,
    margin: 12,
    marginLeft: 7,
    marginRight: 7,
    paddingLeft: 5,
    paddingRight: 5,
    justifyContent: 'center',
    backgroundColor: '#000',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  filterContent: {
    fontWeight: '400',
    fontSize: 12,
    color: '#666'
  },
  filterContentSelect: {
    fontSize: 12,
    color: 'white'
  },
  cancelIcon: {
    height: 6,
    width: 6,
    marginLeft: 4
  }
})
