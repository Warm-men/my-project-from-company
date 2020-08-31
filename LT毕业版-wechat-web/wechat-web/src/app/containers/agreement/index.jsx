import getAgreementUtils from './utils/index'
import PageHelmet from 'src/app/lib/pagehelmet'
import { connect } from 'react-redux'
import './index.scss'
import { useState } from 'react'

function Agreement(props) {
  const { platform } = props.app
  const version =
    props.location && props.location.query && props.location.query.version
  const [agreementUtils, exchangeAgreement] = useState(
    getAgreementUtils(platform, version)
  )

  const [currentVersion, exchangeVersion] = useState(version)

  const onClick = version => {
    const array = getAgreementUtils(platform, version)
    exchangeAgreement(array)
    exchangeVersion(version)
    window.scrollTo(0, 0)
  }

  return (
    <div className="user-agreement">
      <PageHelmet title="用户协议" link="/agreement" />
      <div className="agreement-title">托特衣箱用户服务协议</div>
      {agreementUtils.map((section, key) => {
        return (
          <div className="agreement-box" key={key}>
            <h4 className="title">{section.title}</h4>
            {section.text.map((text, k) => (
              <p className="text" key={k}>
                {text}
              </p>
            ))}
          </div>
        )
      })}
      {!currentVersion ? (
        <div className="history">
          <h3>历史版本</h3>
          <div className="history-item" onClick={() => onClick('20190417')}>
            20190417版本
          </div>
          <div className="history-item" onClick={() => onClick('20190316')}>
            20190316版本
          </div>
          <div className="history-item" onClick={() => onClick('20180425')}>
            20180425版本
          </div>
        </div>
      ) : (
        <div className="history">
          <div className="history-item" onClick={() => onClick(null)}>
            返回最新版本
          </div>
        </div>
      )}
    </div>
  )
}

function mapStateToProps(state) {
  return {
    app: state.app
  }
}

export default connect(mapStateToProps)(Agreement)
