import React from 'react'
import classname from 'classnames'
import * as CARD_TYPE from 'src/app/lib/card_type.js'
import PropTypes from 'prop-types'
import './index.scss'

const UserBenefit = ({
  display_name,
  interval,
  days_interval,
  isAnnualCardAcivity
}) => {
  const isMonth = interval === CARD_TYPE.ON_THE_CARD
  const userTypeClass = classname('img-same-style', {
    'three-add-two':
      display_name === CARD_TYPE.TO_ENJOY_THE_MEMBER_DISPLAY_NAME && isMonth,

    'four-add-two':
      !isMonth || display_name !== CARD_TYPE.TO_ENJOY_THE_MEMBER_DISPLAY_NAME
  })
  return (
    <div className="user-benefit">
      <i className={userTypeClass} />
      {isAnnualCardAcivity && <i className="img-same-style  fast-shipping" />}
      <i className="img-same-style  intelligent-laundry" />
      <i className="img-same-style  professional-care" />
      <i className="img-same-style  shunfeng-courier" />
      <i
        className={classname('img-same-style', {
          'suspend-thirty':
            interval === CARD_TYPE.ON_THE_CARD ||
            interval === CARD_TYPE.SEASON_CARD ||
            days_interval === CARD_TYPE.VACATION_CARD,
          'suspend-ninety': interval === CARD_TYPE.ANNUAL_CARD_TYPE
        })}
      />
      {!isAnnualCardAcivity && <i className="img-same-style more-right" />}
    </div>
  )
}

UserBenefit.defaultProps = {
  isAnnualCardAcivity: false
}

UserBenefit.propTypes = {
  display_name: PropTypes.string,
  interval: PropTypes.number,
  days_interval: PropTypes.number,
  isAnnualCardAcivity: PropTypes.bool,
  isPlansPage: PropTypes.bool
}

export default React.memo(UserBenefit)
