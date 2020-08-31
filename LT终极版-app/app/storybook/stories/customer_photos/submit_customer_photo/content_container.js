/* @flow */

import React, { PureComponent } from 'react'
import { View, TextInput, Text, StyleSheet, Image } from 'react-native'
import PropTypes from 'prop-types'
import StyleTag from '../style_tags/style_tag'

export default class ContentContainer extends PureComponent {
  constructor(props) {
    super(props)
    const { shareTopics, updateContent, updateTopic } = this.props
    let topicTitle = ''
    if (shareTopics && shareTopics.length) {
      topicTitle = shareTopics[0].title ? shareTopics[0].title : ''
    }
    this.state = { topicTitle, content: '', isSelectedTopic: !!topicTitle }
    updateContent('', !!topicTitle ? shareTopics[0].id : null)
    updateTopic(this.state.isSelectedTopic ? shareTopics[0].id : null)
  }

  _onChangeText = content => {
    const obj = { content }
    if (this.state.isSelectedTopic) {
      if (content.length < this.state.topicTitle.length) {
        obj.isSelectedTopic = false
        obj.content = ''
      } else {
        obj.content = content.substring(this.state.topicTitle.length)
      }
    }
    this.setState(obj, () => {
      const { updateContent } = this.props
      updateContent(obj.content)
    })
  }

  _switchTopicStatus = () => {
    this.setState({ isSelectedTopic: !this.state.isSelectedTopic }, () => {
      const { updateTopic, shareTopics } = this.props
      updateTopic(this.state.isSelectedTopic ? shareTopics[0].id : null)
    })
  }

  render() {
    const { placeholder, maxLength, onfocus } = this.props
    const { topicTitle, isSelectedTopic } = this.state
    return (
      <View style={[styles.container, !!topicTitle && styles.containerBorder]}>
        <View style={styles.contentView}>
          <TextInput
            textAlignVertical={'top'}
            style={styles.textInput}
            multiline={true}
            underlineColorAndroid="transparent"
            maxLength={maxLength + (isSelectedTopic ? topicTitle.length : 0)}
            placeholder={placeholder}
            onFocus={onfocus}
            onChangeText={this._onChangeText}>
            <Text style={styles.content}>
              <Text style={styles.topic}>
                {isSelectedTopic ? topicTitle : ''}
              </Text>
              {this.state.content}
            </Text>
          </TextInput>
          <Text style={styles.fontLength}>
            {this.state.content.length}/{maxLength}
          </Text>
        </View>
        {!!topicTitle && (
          <View style={styles.topicView}>
            <View style={styles.topicWrapper}>
              <Image
                style={styles.joinIcon}
                source={require('../../../../assets/images/customer_photos/join_activity_icon.png')}
              />
              <Text style={styles.alert}>{'参与活动'}</Text>
            </View>
            <StyleTag
              onClick={this._switchTopicStatus}
              style={styles.topicButton}
              title={topicTitle}
              isSelected={isSelectedTopic}
            />
          </View>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15
  },
  containerBorder: {
    borderBottomColor: '#F2F2F2',
    borderBottomWidth: 1
  },
  contentView: {
    flex: 1,
    height: 160,
    paddingHorizontal: 15,
    marginTop: 5,
    marginVertical: 12,
    paddingTop: 5,
    paddingBottom: 30,
    backgroundColor: '#fcfcfc',
    borderWidth: 1,
    borderColor: '#efefef'
  },
  textInput: { flex: 1 },
  topic: {
    color: '#E85C40',
    lineHeight: 20,
    fontWeight: '400'
  },
  content: { color: '#000' },
  fontLength: {
    position: 'absolute',
    bottom: 10,
    right: 15,
    fontSize: 11,
    fontWeight: '400',
    color: '#CCCCCC'
  },
  topicView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  topicWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  alert: { fontWeight: '400', fontSize: 14, color: '#989898', marginRight: 10 },
  topicButton: { marginBottom: 0 },
  joinIcon: { width: 14, height: 14, marginRight: 6 }
})

ContentContainer.defaultProps = {
  maxLength: 120,
  placeholder: '写下你的搭配技巧与心得',
  shareTopics: []
}

ContentContainer.propTypes = {
  maxLength: PropTypes.number,
  placeholder: PropTypes.string,
  shareTopics: PropTypes.array
}
