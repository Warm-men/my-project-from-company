/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import p2d from '../../../../src/expand/tool/p2d'
import Image from '../../image'
import Icon from 'react-native-vector-icons/Ionicons'

export default class ToteCurrentSiblingComponent extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isShowMore: false
    }
  }

  _toggleShowMore = () => {
    this.setState({
      isShowMore: !this.state.isShowMore
    })
  }

  render() {
    const { isShowMore } = this.state
    const { children } = this.props
    const components = React.Children.map(children, item => {
      return item
    })
    if (!components.length) return null
    const hasMoreButton = components.length > 1
    return (
      <View style={styles.container}>
        <Image
          source={require('../../../../assets/images/totes/link.png')}
          style={styles.linkIconLeft}
        />
        <Image
          source={require('../../../../assets/images/totes/link.png')}
          style={styles.linkIconRight}
        />
        {hasMoreButton ? (isShowMore ? components : components[0]) : components}
        {hasMoreButton && (
          <TouchableOpacity
            style={styles.bottomButton}
            activeOpacity={0.8}
            onPress={this._toggleShowMore}>
            <Text style={styles.buttonText}>
              {isShowMore ? '收起全部' : '展开全部'}
            </Text>
            <Icon
              name={isShowMore ? 'ios-arrow-up' : 'ios-arrow-down'}
              size={14}
              color={'#979797'}
              style={styles.infoIcon}
            />
          </TouchableOpacity>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 4,
    backgroundColor: '#FFF',
    paddingHorizontal: p2d(16),
    paddingBottom: 16,
    marginHorizontal: p2d(16),
    marginTop: p2d(16),
    marginBottom: -4,
    elevation: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    position: 'relative',
    zIndex: 1
  },
  linkIconLeft: {
    position: 'absolute',
    width: p2d(8),
    height: p2d(36),
    left: p2d(20),
    bottom: p2d(-24),
    zIndex: 1
  },
  linkIconRight: {
    position: 'absolute',
    width: p2d(8),
    height: p2d(36),
    right: p2d(20),
    bottom: p2d(-24),
    zIndex: 1
  },
  bottomButton: {
    height: p2d(30),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    color: '#242424'
  },
  buttonText: {
    color: '#242424',
    fontSize: 12,
    marginRight: 6
  }
})
