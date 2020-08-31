import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Image from '../../../storybook/stories/image'
// import { GET, QNetwork, SERVICE_TYPES } from '../../expand/services/services'
export default class UnlikeButtonList extends PureComponent {
  constructor(props) {
    super(props)
    this.Array = this.props.array
    this.lastOne
  }

  render() {
    return (
      <UnlikeButton
        dataType={this.props.dataType}
        array={this.Array}
        value={this.props.value}
        onPress={this.props.onPress}
        maxNumber={this.props.maxNumber}
      />
    )
  }
}

export class UnlikeButton extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      array: this.props.array,
      maxNumber: this.props.maxNumber - 1
    }
  }

  selectItem = item => {
    let value = this.props.value.slice()
    let findIndex = value.findIndex(function(i) {
      return i === item.value
    })
    if (findIndex === -1) {
      if (value.length < this.props.maxNumber) {
        value.push(item.value)
      } else {
        value.splice(0, 1)
        value.push(item.value)
      }
    } else {
      value.splice(findIndex, 1)
    }
    const { dataType } = this.props
    this.props.onPress(dataType ? { dataType, value } : { value })
  }

  selectUnlike = findIndex => {
    if (findIndex !== -1) {
      return (
        <Image
          source={require('../../../assets/images/account/Group.png')}
          style={styles.selectLine}
          resizeMode="cover"
        />
      )
    }
  }

  unlikeButton = () => {
    let unlikeButton = []
    const { array } = this.state
    const { value } = this.props
    array.map((item, index) => {
      const findIndex = value.findIndex(valueItem => {
        return valueItem === item.value
      })
      unlikeButton.push(
        <TouchableOpacity
          key={index}
          style={[
            findIndex !== -1
              ? styles.selectUnlikeView
              : styles.unSelectUnlikeView,
            styles.unlikeView
          ]}
          onPress={() => {
            this.selectItem(item)
          }}>
          <View style={styles.unlikeViewText}>
            <Text
              style={[
                findIndex !== -1
                  ? styles.selectUnlikeText
                  : styles.unSelectUnlikeText,
                styles.unlikeText
              ]}>
              {item.text}
            </Text>
          </View>
          {this.selectUnlike(findIndex)}
        </TouchableOpacity>
      )
    })
    return unlikeButton
  }

  render() {
    return <View style={styles.unlikeButton}>{this.unlikeButton()}</View>
  }
}

const styles = StyleSheet.create({
  blackText: {
    color: '#333333',
    letterSpacing: 0
  },
  unlikeButton: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  unlikeView: {
    height: 33,
    width: 95,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    borderStyle: 'solid',
    marginRight: 5,
    marginBottom: 12
  },
  selectUnlikeView: {
    borderWidth: 0
  },
  unSelectUnlikeView: {
    borderColor: '#999999',
    borderWidth: StyleSheet.hairlineWidth
  },
  unlikeText: {
    fontSize: 12
  },
  unlikeViewText: {
    zIndex: 3,
    height: 33,
    width: 95,
    justifyContent: 'center',
    alignItems: 'center'
  },
  selectUnlikeText: {
    color: '#EA5C39'
  },
  unSelectUnlikeText: {
    color: '#999999'
  },
  selectLine: {
    zIndex: 1,
    marginTop: -33,
    overflow: 'visible'
  }
})
