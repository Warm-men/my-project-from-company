import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import LoadingPage from 'src/app/components/LoadingPage'
import * as storage from 'src/app/lib/storage.js'

const getState = state => ({
  customer: state.customer
})

@connect(getState)
class AnnualCard extends Component {
  componentWillMount() {
    //NOTE: annual card tag
    storage.set('ANNUAL_CARD_VALID', true)
  }

  componentWillUpdate(nextProps) {
    const customer_id = nextProps.customer.id
    customer_id &&
      browserHistory.replace({
        pathname: '/plans',
        query: {
          next_page: 'annual_card',
          ...this.props.location.query
        }
      })
  }

  render() {
    return <LoadingPage text={'正在处理中'} />
  }
}

export default AnnualCard
