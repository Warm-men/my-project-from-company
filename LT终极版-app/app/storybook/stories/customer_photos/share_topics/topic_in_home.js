/* @flow */

import React, { PureComponent } from 'react'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import Image from '../../image'
import p2d from '../../../../src/expand/tool/p2d'
import dateFns from 'date-fns'

export default class HomeTopic extends PureComponent {
  _onClickBanner = () => {
    const { navigation } = this.props
    navigation && navigation.navigate('WebPage', { uri: this.focusTopic.url })
  }

  render() {
    const { topics } = this.props
    if (topics && topics.length) {
      this.focusTopic = topics[0]
    } else {
      this.focusTopic = null
    }
    if (!this.focusTopic) {
      return null
    }
    const { ended_at, title, banner_img } = this.focusTopic
    const days = dateFns.differenceInDays(ended_at, new Date())
    const content = days ? '剩余' + days + '天' : '活动今天截止'
    return (
      <TouchableOpacity onPress={this._onClickBanner} style={styles.container}>
        <Image style={styles.image} source={{ uri: banner_img }} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.days}>{content}</Text>
      </TouchableOpacity>
    )
  }
}

HomeTopic.defaultProps = {
  title: '',
  endTime: null,
  backgroundImage: '',
  link: '',
  navigation: null
}

HomeTopic.propTypes = {
  title: PropTypes.string,
  endTime: PropTypes.string,
  backgroundImage: PropTypes.string,
  link: PropTypes.string,
  navigation: PropTypes.object,
  topics: PropTypes.array
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginBottom: 16 },
  image: {
    width: p2d(375) - 20,
    height: ((p2d(375) - 20) / 369) * 114,
    backgroundColor: '#f3f3f3'
  },
  title: {
    position: 'absolute',
    top: p2d(38),
    fontWeight: '600',
    fontSize: 19,
    color: '#fff',
    textAlign: 'center'
  },
  days: {
    position: 'absolute',
    top: p2d(65),
    fontWeight: '400',
    fontSize: 11,
    color: '#fff',
    textAlign: 'center'
  }
})
