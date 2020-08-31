/* @flow */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { abTestHOC } from './ab_testing'
import { Client } from '../../expand/services/client'
@abTestHOC
export default class Experiment extends Component {
  constructor(props) {
    super(props)
    const { flagName, defaultValue, getFlag, delayTimes, result } = props
    this.state = { result }
    if (flagName && defaultValue != null) {
      const name =
        Client.ORIGIN.indexOf('wechat.') !== -1 ? flagName : flagName + '_test'

      if (delayTimes) {
        setTimeout(() => {
          getFlag(name, defaultValue, result => {
            this.handleResult(result)
          })
        }, delayTimes)
      } else {
        getFlag(name, defaultValue, result => {
          this.handleResult(result)
        })
      }
    }
  }
  handleResult = result => {
    const { getFlagEnd } = this.props
    this.setState({ result })
    getFlagEnd && getFlagEnd(result)
  }
  render() {
    const { children } = this.props
    const components = React.Children.map(children, item => {
      const { value } = item.props
      if (this.state.result === value) {
        return item
      }
    })
    return components
  }
}

Experiment.propTypes = {
  flagName: PropTypes.string.isRequired,
  defaultValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool
  ]).isRequired
}
