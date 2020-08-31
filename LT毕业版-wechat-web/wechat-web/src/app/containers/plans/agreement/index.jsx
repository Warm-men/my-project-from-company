import './index.scss'

export default React.memo(({ gotoAgreement, className }) => (
  <div className={`read ${className || ''}`}>
    <span>
      <span className="icon" />
      本服务不支持退款，购买即视为同意
      <b>
        <span className="agreement-text" onClick={gotoAgreement}>
          《用户服务协议》
        </span>
      </b>
    </span>
  </div>
))
