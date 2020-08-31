import './index.scss'
import PageHelmet from 'src/app/lib/pagehelmet'
import Utils from './utils'

export default class AgreeMent extends React.PureComponent {
  render() {
    return (
      <div className="agreement">
        <PageHelmet title="免密支付协议" link="/agreement_free_password" />
        <div className="agreement-title">{Utils.title}</div>
        {_.map(Utils.content, (value, key) => {
          return (
            <div className="agreement-content" key={key}>
              <p className="content-title">{value.title}</p>
              {_.map(value.text, (text, index) => {
                return (
                  <p className="content-text" key={index}>
                    {text}
                  </p>
                )
              })}
            </div>
          )
        })}
      </div>
    )
  }
}
