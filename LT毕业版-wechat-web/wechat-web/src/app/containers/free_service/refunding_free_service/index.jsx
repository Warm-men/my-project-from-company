import React, { PureComponent } from 'react'
import { browserHistory } from 'react-router'
import PageHelmet from 'src/app/lib/pagehelmet'
import Actions from 'src/app/actions/actions'
import { connect } from 'react-redux'
import './index.scss'

@connect()
export default class RefundingFreeServiceContainer extends PureComponent {
  state = {
    type: ''
  }

  componentDidMount() {
    this.props.dispatch(
      Actions.freeService.getFreeService((dispatch, res) => {
        const { free_service } = res.data.me
        this.setState({
          type: free_service.free_service_type.type
        })
      })
    )
  }

  goBack = () => {
    let { query } = this.props.location
    if (query.from_cancel_page) {
      browserHistory.go(-2)
    } else {
      browserHistory.goBack()
    }
  }

  render() {
    const { type } = this.state
    return (
      <div className="refunding-container">
        <PageHelmet title="自在选" link="/refunding_free_service" />
        <img
          className="image-icon"
          alt=""
          src={require('../../../../assets/images/free_service/sucsess.png')}
        />
        <span className="text-state">已关闭自在选</span>
        {type !== '' && (
          <span className="text-intro">
            {type === 'FreeServiceContractType'
              ? '如有需要可再次开通使用'
              : '自在选押金将在10个工作日内原路径退回'}
          </span>
        )}
        <div className="getit-container" onClick={this.goBack}>
          <span className="getit">我知道了</span>
        </div>
      </div>
    )
  }
}
