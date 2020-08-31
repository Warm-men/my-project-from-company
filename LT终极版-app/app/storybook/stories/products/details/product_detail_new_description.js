/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Image from '../../image'

export default class ProductDescription extends PureComponent {
  render() {
    const { pushToBrandDetail, product, rhytidectomyTricks } = this.props
    const { attributes, brand, product_digests, description } = product
    return (
      <View style={styles.container}>
        <View style={styles.detailTitle}>
          <Text style={styles.detailsSubTitle}>商品信息</Text>
        </View>
        <Description data={product_digests} description={description} />
        <Attributes
          attributes={attributes}
          rhytidectomyTricks={rhytidectomyTricks}
        />
        <Brand brand={brand} onClick={pushToBrandDetail} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f3f3'
  },
  detailTitle: {
    marginTop: 32,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  detailsSubTitle: { fontWeight: '600', fontSize: 18, color: '#242424' }
})

class Attributes extends PureComponent {
  render() {
    const { attributes, rhytidectomyTricks } = this.props
    if (!attributes || !attributes.length) {
      return null
    }
    return (
      <View style={attributesStyles.attributes}>
        {attributes.map(item => {
          const { title, options, value } = item
          let array = []
          if (options) {
            options.forEach(item => {
              const obj = { value: item, isSelected: item === value }
              array.push(obj)
            })
          } else {
            array = [{ value, isSelected: true }]
          }
          return (
            <View style={attributesStyles.row} key={title}>
              <View style={attributesStyles.title}>
                <Text style={attributesStyles.titleText}>{title}</Text>
              </View>
              <AttributeValues array={array} onPress={rhytidectomyTricks} />
            </View>
          )
        })}
      </View>
    )
  }
}

const attributesStyles = StyleSheet.create({
  attributes: { borderRadius: 4, overflow: 'hidden' },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#fff' },
  title: {
    width: 88,
    backgroundColor: '#F2F3F5',
    borderRightWidth: 1,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleText: {
    fontSize: 14,
    color: '#242424',
    lineHeight: 14,
    paddingVertical: 13,
    fontWeight: '500'
  },
  value: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    flexWrap: 'wrap',
    flexDirection: 'row',
    paddingLeft: 16,
    paddingVertical: 10
  },
  tipsView: { position: 'absolute', right: 16, top: 5 },
  tipsText: { fontSize: 12, color: '#5e5e5e', lineHeight: 30 },
  valueText: {
    lineHeight: 20,
    paddingRight: 16,
    fontSize: 14,
    fontWeight: '400'
  },
  normalValue: { color: '#ccc' },
  selectedValue: { color: '#242424' }
})

class AttributeValues extends PureComponent {
  render() {
    const { array, onPress } = this.props
    const hasTag = !!array.find(i => i.value === '容易褶皱')

    return (
      <View style={attributesStyles.value}>
        {array.map(item => {
          const { value, isSelected } = item
          return (
            <Text
              key={value}
              style={[
                attributesStyles.valueText,
                isSelected
                  ? attributesStyles.selectedValue
                  : attributesStyles.normalValue
              ]}>
              {value}
            </Text>
          )
        })}
        {hasTag && (
          <TouchableOpacity onPress={onPress} style={attributesStyles.tipsView}>
            <Text style={attributesStyles.tipsText}>除皱小妙招 ></Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }
}

class Brand extends PureComponent {
  render() {
    const { onClick, brand } = this.props
    if (!brand) return null
    const { image_url, name } = brand
    return (
      <TouchableOpacity style={brandStyles.container} onPress={onClick}>
        <Image
          style={brandStyles.image}
          source={{ uri: image_url ? image_url : 'default' }}
        />
        <Text style={brandStyles.name}>{name}</Text>
        <Text style={brandStyles.button}>{'进入品牌'}</Text>
      </TouchableOpacity>
    )
  }
}

const brandStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 30
  },
  image: { width: 54, height: 54, borderRadius: 27, overflow: 'hidden' },
  name: {
    paddingLeft: 12,
    fontSize: 14,
    color: '#242424',
    fontWeight: '400',
    flex: 1
  },
  button: {
    lineHeight: 30,
    width: 85,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 13,
    borderRadius: 2,
    color: '#242424',
    fontWeight: '400'
  }
})

export class Description extends PureComponent {
  _renderDescription = () => {
    const { data, description } = this.props
    if (!data) {
      return <Text style={descriptionStyles.text}>{description}</Text>
    }

    let digestsIndexs = []
    const digests = data.filter(item => description.indexOf(item.text) !== -1)

    digests.map(item => {
      for (i = item.start; i < item.stop; i++) {
        digestsIndexs.push(i)
      }
    })

    let descriptions = []
    const array = description ? description.split('') : []

    array.map((text, index) => {
      const digests = digestsIndexs.find(item => item === index)
      descriptions.push(
        <View key={index}>
          <Text style={descriptionStyles.text}>{text}</Text>
          {(!!digests || digests === 0) && (
            <View testID="digests" style={descriptionStyles.line} />
          )}
        </View>
      )
    })
    return descriptions
  }

  render() {
    const descriptions = this._renderDescription()
    return <View style={descriptionStyles.container}>{descriptions}</View>
  }
}

const descriptionStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    marginTop: 5
  },
  text: {
    fontWeight: '400',
    fontSize: 14,
    color: '#5e5e5e',
    lineHeight: 26
  },
  line: {
    height: 8,
    backgroundColor: '#FCDFD9',
    width: '100%',
    position: 'absolute',
    bottom: 4,
    zIndex: -1
  }
})
