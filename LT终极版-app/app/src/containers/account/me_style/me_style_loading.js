/* @flow */

import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  AppState,
  Text
} from 'react-native'
import { inject, observer } from 'mobx-react'
import Video from 'react-native-video'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'
import { QNetwork, SERVICE_TYPES } from '../../../expand/services/services'
const width = Dimensions.get('window').width

@inject('toteCartStore', 'currentCustomerStore')
@observer
export default class MeStyleLoading extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isArrived: false,
      videoEnd: false,
      showVideo: true
    }
  }
  _getLatestTote = () => {
    const { toteCartStore } = this.props
    QNetwork(SERVICE_TYPES.toteCart.QUERY_ME_TOTECART, {}, response => {
      const { me } = response.data
      if (me) {
        toteCartStore.updateToteCart(me.tote_cart)
        if (
          toteCartStore.toteCart &&
          !!toteCartStore.toteCart.clothing_items.length
        ) {
          this._getCurrentCustomer()
          this.timer && clearTimeout(this.timer)
          this.setState({ isArrived: true })
        } else {
          this.timer = setTimeout(() => {
            this._getLatestTote()
          }, 2000)
        }
      }
    })
  }

  _getCurrentCustomer = () => {
    const { currentCustomerStore } = this.props
    QNetwork(SERVICE_TYPES.me.QUERY_ME, {}, response => {
      const { me } = response.data
      currentCustomerStore.updateCurrentCustomer(me)
    })
  }

  _videoEnd = () => {
    this.setState({ videoEnd: true }, () => {
      this._getLatestTote()
    })
  }

  UNSAFE_componentWillMount() {
    AppState.addEventListener('change', this._handleAppStateChange)
  }
  _handleAppStateChange = nextAppState => {
    if (nextAppState === 'active') {
      this.setState({
        showVideo: true
      })
    } else {
      this.setState({
        showVideo: false,
        isArrived: false,
        videoEnd: false
      })
    }
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
    AppState.removeEventListener('change', this._handleAppStateChange)
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.state.showVideo ? (
          <Video
            hideShutterView={true}
            source={require('../../../assets/first_tote_guide.mp4')}
            rate={1}
            volume={0}
            muted={true}
            paused={false}
            resizeMode="contain"
            onEnd={this._videoEnd}
            style={{ flex: 1, transform: [{ scaleY: 1 }] }}
          />
        ) : null}
        {this.state.videoEnd && (
          <View style={styles.contentView}>
            <Text style={styles.title}>
              {this.state.isArrived ? '衣箱已为你准备好' : '正在创建你的衣箱'}
            </Text>
            <Spinner
              isVisible={!this.state.isArrived}
              size={15}
              type={'FadingCircleAlt'}
              color={'#000000'}
              style={styles.spinner}
            />
            {this.state.isArrived && (
              <TouchableOpacity
                onPress={this.props.goback}
                style={styles.button}>
                <Text style={styles.buttonTitle}>开启衣箱</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentView: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '50%'
  },
  title: { padding: 40, textAlign: 'center' },
  button: {
    width: 164,
    height: 50,
    backgroundColor: 'rgba(234,92,57,1)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonTitle: { lineHeight: 50, fontSize: 14, color: '#FFF' },
  spinner: { marginTop: -20 }
})
