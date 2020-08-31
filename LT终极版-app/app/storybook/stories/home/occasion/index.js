import React, { Component, PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import Image from '../../image'
import { TitleView, NonMemberCommonTitle } from '../titleView'
import p2d from '../../../../src/expand/tool/p2d'
import { Column } from '../../../../src/expand/tool/add_to_closet_status'
export default class Occasion extends Component {
  constructor(props) {
    super(props)
  }

  didSelectedProductItem = occasion => {
    const { didSelectedProductItem } = this.props
    didSelectedProductItem && didSelectedProductItem(occasion)
  }

  prettier = (name, slug) => {
    let title
    title = name + ' ' + slug.replace('_', ' ').toUpperCase()
    return title
  }

  render() {
    const { data, imageStyle, type } = this.props
    return (
      <View>
        {type && type === 'non_member' ? (
          <NonMemberCommonTitle title={'场景风格'} />
        ) : (
          <TitleView
            title={'场景风格'}
            style={styles.titleView}
            subTitle={'OCCASION'}
          />
        )}

        <View style={styles.occasionView}>
          {data.map((item, index) => {
            const isLastItem = item.length === index + 1
            return (
              <Item
                imageStyle={imageStyle}
                key={index}
                isLastItem={isLastItem}
                data={item}
                didSelectedItem={this.didSelectedProductItem}
              />
            )
          })}
        </View>
      </View>
    )
  }
}

class Item extends PureComponent {
  _onPress = () => {
    this.props.didSelectedItem(this.props.data)
  }

  render() {
    const { data } = this.props
    const description = Column.OccasionCollection + '-' + data.name
    const url =
      typeof data.image_url === 'number'
        ? data.image_url
        : { uri: data.image_url }
    return (
      <TouchableOpacity
        style={[styles.touch]}
        activeOpacity={0.6}
        delayPressIn={100}
        onPress={this._onPress}>
        <Image
          description={description}
          resizeMode={'contain'}
          style={[styles.imageViewItem]}
          source={url}
        />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  touch: {
    marginLeft: p2d(8),
    marginBottom: 9,
    width: p2d(109),
    height: p2d(145)
  },
  imageViewItem: {
    width: p2d(109),
    height: p2d(145)
  },
  titleView: {
    marginTop: 48
  },
  occasionView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: p2d(8)
  }
})
