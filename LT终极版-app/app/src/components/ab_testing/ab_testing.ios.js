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
  if (flagName && defaultValue != null) {
    const name =
      Client.ORIGIN.indexOf('wechat.') !== -1 ? flagName : flagName + '_test'
    AdhocSDK.getFlag(name, defaultValue, callback)
  }
}
const abTestHOC = WrappedComponent => {
  return class extends Component {
    getFlag = (flagName, defaultValue, callback) => {
      AdhocSDK.getFlag(flagName, defaultValue, callback)
    }
    asynchronousGetFlag = (flagName, defaultValue, callback) => {
      AdhocSDK.asynchronousGetFlag(flagName, defaultValue, callback)
    }

    getCurrentExperiments = callback => {
      AdhocSDK.getCurrentExperiments(callback)
    }
    handleWebViewMessage = (webView, msg) => {
      AdhocSDK.handleWebViewMessage(webView, msg)
    }

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
