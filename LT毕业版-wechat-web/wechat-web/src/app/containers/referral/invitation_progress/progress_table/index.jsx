import { format } from 'date-fns'
import './index.scss'

export default React.memo(({ referrals }) => (
  <table className="progress-table">
    <tbody>
      {_.map(referrals, (item, index) => {
        return (
          <tr key={index}>
            <td>
              <span>
                <img src={item.avatar_url} alt="avatar_url" />
              </span>
              <span>{item.nickname}</span>
            </td>
            <td>
              {item.friend_subscription_started_on &&
                format(
                  new Date(item.friend_subscription_started_on),
                  'YYYY.MM.DD'
                )}
            </td>
            <td>{item.redeemed_at ? '已获得奖励' : '等待发放奖励'}</td>
          </tr>
        )
      })}
    </tbody>
  </table>
))
