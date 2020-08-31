/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'

const MAX_LENGTH = 300

export default class ContentContainer extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { content: '' }
  }

  _onChangeText = content => {
    this.setState({ content })
    const { updateComment } = this.props
    updateComment(content)
  }

  render() {
    const { content } = this.state
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          placeholderTextColor={'#ccc'}
          maxLength={MAX_LENGTH}
          multiline={true}
          autoCorrect={false}
          value={content}
          textAlignVertical={'top'}
          underlineColorAndroid={'transparent'}
          placeholder={'其他评价请留言'}
          onChangeText={this._onChangeText}
        />
        <Text style={styles.wordNum}>
          {content.length}/{MAX_LENGTH}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 10,
    height: 130,
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#efefef'
  },
  textInput: { flex: 1, fontSize: 14, lineHeight: 20 },
  wordNum: { color: '#989898', fontSize: 12, alignSelf: 'flex-end' }
})
