/* @flow weak */

import React, { PureComponent } from 'react'
import Footer from './footer_all_loaded'
import wisdom from '../../../src/expand/tool/wisdom'

export default class FooterContainer extends PureComponent {
  constructor(props) {
    super(props)
    this.message = wisdom()
  }
  render() {
    return <Footer message={this.message} {...this.props} />
  }
}
