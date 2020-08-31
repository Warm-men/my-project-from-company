import React, { Component } from 'react'
import AdhocSDK from 'react-native-adhoc'
import { Client } from '../../expand/services/client'

const abTrack = (key, value = 1) => {
  AdhocSDK.track(key, value)
}
const abTrackWithAttribute = (key, value, attribute) => {
  AdhocSDK.trackWithAttribute(key, value, attribute)
}
const abTrackPageView = () => {
  AdhocSDK.trackPageView()
}

const getAbFlag = (flagName, defaultValue, callback) => {
  const type = typeof defaultValue
  const name =
    Client.ORIGIN.indexOf('wechat.') !== -1 ? flagName : flagName + '_test'
  if (type === 'string') {
    AdhocSDK.getStringFlag(name, defaultValue, callback)
  } else if (type === 'number') {
    AdhocSDK.getNumberFlag(name, defaultValue, callback)
  } else if (type === 'boolean') {
    AdhocSDK.getBooleanFlag(name, defaultValue, callback)
  } else {
    callback(defaultValue)
  }
}

const abTestHOC = WrappedComponent => {
  return class extends Component {
    getFlag = (flagName, defaultValue, callback) => {
      const type = typeof defaultValue
      if (type === 'string') {
        AdhocSDK.getStringFlag(flagName, defaultValue, callback)
      } else if (type === 'number') {
        AdhocSDK.getNumberFlag(flagName, defaultValue, callback)
      } else if (type === 'boolean') {
        AdhocSDK.getBooleanFlag(flagName, defaultValue, callback)
      } else {
        callback(defaultValue)
      }
    }
    asynchronousGetFlag = (flagName, defaultValue, callback) => {
      const type = typeof defaultValue
      if (type === 'string') {
        AdhocSDK.asynchronousGetStringFlag(flagName, defaultValue, callback)
      } else if (type === 'number') {
        AdhocSDK.asynchronousGetNumberFlag(flagName, defaultValue, callback)
      } else if (type === 'boolean') {
        AdhocSDK.asynchronousGetBooleanFlag(flagName, defaultValue, callback)
      } else {
        callback(defaultValue)
      }
    }

    getCurrentExperiments = callback => {
      AdhocSDK.getCurrentExperiments(callback)
    }
    handleWebViewMessage = (webView, msg) => {}

    render() {
      return (
        <WrappedComponent
          {...this.props}
          getFlag={this.getFlag}
          asynchronousGetFlag={this.asynchronousGetFlag}
          track={this.track}
          trackWithAttribute={this.trackWithAttribute}
          trackPageView={this.trackPageView}
          getCurrentExperiments={this.getCurrentExperiments}
          handleWebViewMessage={this.handleWebViewMessage}
        />
      )
    }
  }
}

export { abTestHOC, abTrack, abTrackWithAttribute, abTrackPageView, getAbFlag }
