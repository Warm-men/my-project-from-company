import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import PageHelmet from 'src/app/lib/pagehelmet'

import ExpressAction from 'src/app/actions/independent/express_action'
import LoadingPage from 'src/app/components/LoadingPage'
import ExpressInfo from 'src/app/containers/express/express_info'

import './index.scss'

const getState = (state, props) => {
  const { express, totes } = state
  const { tote_id } = props.location.query
  const currentTote = _.find(totes.current_totes, v => v.id === Number(tote_id))
  return {
    express,
    tote_shipping_address: currentTote
      ? currentTote.tote_shipping_address
      : null
  }
}
export default connect(getState)(ExpressContainer)
function ExpressContainer(props) {
  const [Loading, setLoading] = useState(true)
  useEffect(() => {
    const { query } = props.location
    if (query && query.shipping_code) {
      props.dispatch(
        ExpressAction.fetchExpress(query.shipping_code, () => setLoading(false))
      )
    }
  }, [])

  const { express, location, tote_shipping_address } = props
  return (
    <div className="express-container">
      <PageHelmet title="查看物流" link="/express" />
      <div className="express-header">
        <span className="express-icon" />
        <span className="express-text-box">
          <span className="express-text">
            快递公司：<span>顺丰速运</span>
          </span>
          <span className="express-text">
            快递单号：
            <span>{location.query && location.query.shipping_code}</span>
          </span>
        </span>
      </div>
      <div className="express-info-container">
        {!_.isEmpty(tote_shipping_address) && (
          <div className="express-shipping-address">
            <span className="shipping-address-icon">收</span>
            <p className="shipping-address-text">
              {`[ 收货地址 ] ${tote_shipping_address.state}${tote_shipping_address.city}${tote_shipping_address.district}${tote_shipping_address.address_1} ${tote_shipping_address.full_name} ${tote_shipping_address.telephone}`}
            </p>
          </div>
        )}
        {!_.isEmpty(express.label_scans) ? (
          _.map(express.label_scans, (value, key) => (
            <ExpressInfo value={value} index={key} key={key} />
          ))
        ) : Loading ? (
          <LoadingPage />
        ) : (
          <div className="express-info-empty">
            <span className="empty-icon" />
            <h4 className="empty-title">暂无物流信息</h4>
            <p className="empty-info">因顺丰揽件和扫描快递需要时间</p>
            <p className="empty-info">快递信息通常会延迟几个小时显示</p>
          </div>
        )}
      </div>
    </div>
  )
}
