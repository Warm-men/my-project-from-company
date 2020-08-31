import { format } from 'date-fns'

import './index.scss'

export default class ScheduleAutoPickupCard extends React.PureComponent {
  render() {
    const { onClick, data, isFreeServiceReturn } = this.props
    const { requested_pickup_at, telephone, full_name } = data

    const time =
      requested_pickup_at && format(requested_pickup_at, 'YYYY-MM-DD HH:mm')

    const { state, city, district, address_1 } = data
    const address = state + city + district + address_1

    return (
      <div className="schedule-auto-pick-up-box" onClick={onClick}>
        <div className="content-view">
          <p className="title">
            {isFreeServiceReturn ? (
              <span className="free-service-icon">{'自在选'}</span>
            ) : null}
            预约归还衣箱信息
          </p>
          <div className="row">
            <img className="icon" src={require('./images/time.png')} alt={''} />
            <div className="time">{time}</div>
          </div>
          <div className="row">
            <img className="icon" src={require('./images/user.png')} alt={''} />
            <div className="userinfo">
              {full_name} {telephone}
            </div>
          </div>
          <div className="row">
            <img
              className="icon"
              src={require('./images/address.png')}
              alt={''}
            />
            <div className="address">{address}</div>
          </div>
        </div>
        <span className="arrow" />
      </div>
    )
  }
}
