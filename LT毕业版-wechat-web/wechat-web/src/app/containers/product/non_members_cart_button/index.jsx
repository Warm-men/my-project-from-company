import ReferralTips from 'src/app/containers/product/referral_tips'
import PropTypes from 'prop-types'

const NonMembersCartButton = ({
  inCloset,
  full_price,
  addToCollect,
  linkToPlans,
  customer,
  location,
  dispatch
}) => (
  <div className="non-members-cart-btn">
    <div className="join-closet ">
      <img
        className="add-collect"
        alt=""
        src={require(`src/app/containers/product/detail_buttons/images/${
          inCloset ? 'collected' : 'collect'
        }.svg`)}
        onClick={addToCollect}
      />
      <div className="closet-text">
        {inCloset ? '已加入愿望衣橱' : '加入愿望衣橱'}
      </div>
    </div>
    <div className="join-letote" onClick={linkToPlans}>
      <span>
        <span className="non-price">&yen;{full_price}</span> 会员免费穿
      </span>
      <ReferralTips
        customer={customer}
        location={location}
        dispatch={dispatch}
      />
    </div>
  </div>
)

NonMembersCartButton.propTypes = {
  inCloset: PropTypes.bool,
  addToCollect: PropTypes.func,
  linkToPlans: PropTypes.func,
  abtestVar: PropTypes.number,
  full_price: PropTypes.number
}

export default React.memo(NonMembersCartButton)
