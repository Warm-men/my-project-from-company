import { useState, memo } from 'react'
import { browserHistory } from 'react-router'
import * as storage from 'src/app/lib/storage'
import isCompeleteSize from 'src/app/lib/isCompleteSize'
import './index.scss'

const RoleCardComponent = ({ customer }) => {
  const [value, setValue] = useState(null)

  window.adhoc('getFlags', flag => {
    const currentValue = flag.get('new_role_card_in_tote')
    const value = currentValue ? currentValue : 1
    setValue(value)
  })

  const onnClick = () => {
    window.adhoc('track', 'role_card_click', 1)

    storage.remove('displayedTips')
    storage.set('isReceivedRule', true)

    if (!isCompeleteSize(customer.style)) {
      browserHistory.push('/style_profile/figure_input')
    } else {
      const query = { pre_page: 'totes' }
      browserHistory.push({ pathname: '/style_profile/figure_input', query })
    }
  }

  if (!value) return null

  const image =
    value === 2
      ? require('./images/role_card_test.png')
      : require('./images/role_card.png')
  return (
    <div className="role-card-box">
      <img onClick={onnClick} src={image} alt="role_card" />
    </div>
  )
}

export default memo(RoleCardComponent)
