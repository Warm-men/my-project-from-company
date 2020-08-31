import React, { PureComponent } from 'react'
import { Text, StyleSheet, View, Image } from 'react-native'
import Products from './products'
import p2d from '../../../../src/expand/tool/p2d'
import { Column } from '../../../../src/expand/tool/add_to_closet_status'
export default class ProductsLookItem extends PureComponent {
  openProductDetail = item => {
    const { navigation } = this.props
    const column = Column.ProductLooks
    navigation.push('Details', { item, column })
  }
  render() {
    const { data, navigation, index, onPressAllowButton } = this.props
    return (
      <View style={styles.container}>
        <View style={styles.lookContainer}>
          <View style={styles.looks}>
            <Products
              onPressAllowButton={onPressAllowButton}
              navigation={navigation}
              data={data}
              showCloset
              useLookMainPhoto
              mainProduct={styles.mainProduct}
              onPress={this.openProductDetail}
              column={Column.ProductLooks}
            />
          </View>
          <View style={styles.titleContainer}>
            <Image
              source={require('../../../../assets/images/lookbook/dress.png')}
            />
            <Text style={styles.title}>搭配指南</Text>
          </View>
          <Text style={styles.desc}>{data.description}</Text>
        </View>
        {index !== 0 && <View style={styles.lightLine} />}
        {index === 0 && <View style={styles.line} />}
        {index === 0 && <Text style={styles.relative}>相关LOOK</Text>}
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingBottom: 40
  },
  lookContainer: {
    marginHorizontal: p2d(15)
  },
  looks: {
    height: p2d(395),
    borderColor: '#F3F3F3',
    borderWidth: 1,
    borderBottomLeftRadius: 30,
    borderTopRightRadius: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  mainProduct: {
    justifyContent: 'center',
    alignItems: 'center',
    width: p2d(180),
    height: p2d(300),
    marginTop: 30,
    marginBottom: 15
  },
  titleContainer: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    marginLeft: 10,
    fontSize: 14,
    color: '#242424',
    fontWeight: '500'
  },
  desc: {
    color: '#666666',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 13
  },
  line: { backgroundColor: '#F7F7F7', height: 7, marginTop: 32 },
  relative: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: p2d(15),
    marginTop: 16
  },
  lightLine: {
    borderBottomWidth: 0.7,
    borderBottomColor: '#F2F2F2',
    marginTop: 24
  }
})
