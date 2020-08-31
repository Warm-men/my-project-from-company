import React, { PureComponent } from 'react'
import { StyleSheet, Dimensions, View, Text } from 'react-native'
import { AttributePreferences } from '../index.js'
import Title from './title.js'

export default class Preferences extends PureComponent {
  constructor(props) {
    super(props)
    this.array = props.attribute_preferences.map(item => {
      return item.name
    })
    this.state = {
      selectedType: [...this.array],
      isDone: this.array ? (this.array.length ? true : false) : false
    }
  }

  UNSAFE_componentWillMount() {
    this.isDone()
  }

  isDone = () => {
    if (!this.state.selectedType.length) {
      this.setState({
        isDone: false
      })
      return
    }
    this.setState({
      isDone: true
    })
  }

  updateData = updateAttributePreferences => {
    if (this.state.selectedType.length) {
      const style = {
        preferences: this.state.selectedType
      }
      updateAttributePreferences(style)
      return true
    }
    return false
  }

  didSelectedAttributePreferences = items => {
    this.setState({ selectedType: items }, () => {
      this.isDone()
    })
  }

  render() {
    return (
      <View>
        <Title title={'品类偏好'} />
        <Text style={styles.desc}>
          选择你喜欢的品类，这只是个开始，我们会帮助你发现时尚真我
        </Text>
        <AttributePreferences
          defaultTypes={this.state.selectedType}
          didSelectedType={this.didSelectedAttributePreferences}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 20,
    width: Dimensions.get('window').width
  },
  meStyleCommonTitle: {
    marginHorizontal: 40
  },
  desc: { color: '#999999', fontSize: 14, lineHeight: 23 }
})
