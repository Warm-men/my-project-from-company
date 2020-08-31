/* @flow */

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet } from 'react-native'
import Header from './header'
import Photos from './photos'
import Content from '../../customer_photo/content'

export default class CustomerPhoto extends PureComponent {
  _didSelectedItem = index => {
    const { didSelectedItem, data } = this.props
    didSelectedItem && didSelectedItem(data, index)
  }
  render() {
    const { data, isLastItem } = this.props
    const { id, customer, photos, share_topics, content, products } = data
    return (
      <View style={styles.container}>
        <Header products={products} customer={customer} id={id} />
        <Content
          style={styles.content}
          shareTopics={share_topics}
          content={content}
        />
        <Photos photos={photos} id={id} onClick={this._didSelectedItem} />
        {!isLastItem && <View style={styles.line} />}
      </View>
    )
  }
}

CustomerPhoto.defaultProps = {
  style: { width: 0, height: 0 },
  data: {
    content: '描述内容',
    share_topics: [{ title: '#话题#' }],
    photos: [{ mobile_url: '晒单地址' }],
    customer: { nickname: '昵称', avatar: '' }
  },
  isLastItem: false
}

CustomerPhoto.propTypes = {
  data: PropTypes.object,
  isLastItem: PropTypes.bool
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingTop: 0 },
  line: {
    backgroundColor: '#f2f2f2',
    height: 1,
    marginHorizontal: 16,
    marginTop: 24
  }
})
