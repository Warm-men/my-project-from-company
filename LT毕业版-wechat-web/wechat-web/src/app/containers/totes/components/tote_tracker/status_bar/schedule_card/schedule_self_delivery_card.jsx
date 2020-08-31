import { format } from 'date-fns'
import 'src/app/components/custom_components/swiper.scss'
import './index.scss'

export default class ScheduleCard extends React.PureComponent {
  render() {
    const {
      data,
      onClick,
      fcAddress,
      inputHiveBox,
      isFreeServiceReturn
    } = this.props

    const { shipping_code, latest_return_at } = data

    const time = format(latest_return_at, 'YYYY年MM月DD日 HH:mm')

    const buttonTitle = shipping_code ? '修改顺丰单号' : '填写顺丰单号'

    const text = shipping_code ? '信息' : '收件信息'

    const title = isFreeServiceReturn
      ? '自行寄回' + text
      : '自行寄回衣箱' + text

    return (
      <div className="schedule-self-delivery-box">
        <div className="top-view" onClick={onClick}>
          <div className="content-view">
            <h5 className="title">
              {isFreeServiceReturn ? (
                <span className="free-service-icon">{'自在选'}</span>
              ) : null}
              {title}
            </h5>
            {shipping_code ? (
              <div className="text">
                <span className="sub-title">{'顺丰快递单号：'}</span>
                {shipping_code}
              </div>
            ) : (
              <div>
                {time ? (
                  <div className="row">
                    <img
                      className="icon"
                      src={require('./images/time.png')}
                      alt={''}
                    />
                    <div className="text">
                      <span className="sub-title">{'最晚归还时间：'}</span>
                      {time}
                    </div>
                  </div>
                ) : null}
                <div className="row">
                  <img
                    className="icon"
                    src={require('./images/address.png')}
                    alt={''}
                  />
                  <div className="text">
                    <span className="sub-title">{'收货地址：'}</span>
                    {fcAddress}
                  </div>
                </div>
              </div>
            )}
          </div>
          <span className="arrow" />
        </div>
        <p className="button" onClick={inputHiveBox}>
          {buttonTitle}
        </p>
      </div>
    )
  }
}
