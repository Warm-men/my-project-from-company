/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'

export default class Content extends PureComponent {
  _onClickTopic = () => {
    const { onClickTopic, shareTopics } = this.props
    shareTopics && shareTopics.length && onClickTopic(shareTopics[0].url)
  }
  render() {
    const { shareTopics, content, onClickTopic, style } = this.props
    let topicTitle
    if (shareTopics && shareTopics.length) {
      topicTitle = shareTopics[0].title
    }
    if (!topicTitle && !content) {
      return <View style={styles.empty} />
    }
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.content}>
          <Text
            onPress={onClickTopic ? this._onClickTopic : null}
            style={onClickTopic && styles.topic}>
            {topicTitle}
            {topicTitle ? ' ' : ''}
          </Text>
          {content}
        </Text>
      </View>
    )
  }
}

Content.defaultProps = {
  shareTopics: [],
  content: '描述内容',
  onClickTopic: null,
  style: null
}

Content.propTypes = {
  shareTopics: PropTypes.array,
  content: PropTypes.string,
  style: PropTypes.object
}

const styles = StyleSheet.create({
  container: { padding: 15 },
  content: {
    lineHeight: 22,
    color: '#5e5e5e',
    fontWeight: '400',
    letterSpacing: 0.4
  },
  empty: { height: 20 },
  topic: { color: '#E85C40' }
})
