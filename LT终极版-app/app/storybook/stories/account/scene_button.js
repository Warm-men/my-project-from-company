import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
export default class SceneButtonList extends Component {
  constructor(props) {
    super(props)
    this.Array = [
      { text: '很少', value: -1 },
      { text: '有时', value: 0 },
      { text: '经常', value: 1 }
    ]
  }

  render() {
    return (
      <SceneButton
        dataType={this.props.dataType}
        sceneArray={this.Array}
        value={this.props.value}
        sceneChange={this.props.sceneChange}
      />
    )
  }
}

export class SceneButton extends Component {
  constructor(props) {
    super(props)
    this.sceneArray = this.props.sceneArray
  }

  selectScene = value => {
    const { dataType } = this.props
    this.props.sceneChange(dataType ? { dataType, value } : { value })
    this.setState({
      value
    })
  }

  sceneButton = () => {
    let sceneButton = []
    const { sceneArray, value } = this.props
    sceneArray.map((item, index) => {
      sceneButton.push(
        <TouchableOpacity
          key={index}
          style={[
            value === item.value ? styles.selectSceneView : null,
            styles.sceneView
          ]}
          onPress={() => {
            this.selectScene(item.value)
          }}>
          <Text
            style={[
              value === item.value ? styles.selectText : styles.unSelectText,
              styles.sceneViewText
            ]}>
            {item.text}
          </Text>
        </TouchableOpacity>
      )
    })
    return sceneButton
  }

  render() {
    return <View style={styles.sceneButton}>{this.sceneButton()}</View>
  }
}

const styles = StyleSheet.create({
  blackText: {
    color: '#333333',
    letterSpacing: 0
  },
  sceneButton: {
    flexDirection: 'row',
    width: 295,
    height: 41,
    borderRadius: 100,
    backgroundColor: '#F5F5F2'
  },
  sceneView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 98,
    height: 41
  },
  selectSceneView: {
    backgroundColor: '#F3BF78',
    borderRadius: 100
  },
  sceneViewText: {
    fontSize: 12,
    letterSpacing: 0
  },
  selectText: {
    color: '#FFFFFF'
  },
  unSelectText: {
    color: '#666666'
  }
})
