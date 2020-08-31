import ActionButton from 'src/app/components/shared/action_button'
import 'src/assets/stylesheets/components/profile.scss'

export default React.memo(() => {
  return (
    <div>
      <div className="membership-expired">
        <div className="membership-image" />
        <p className="expired-introduce">会员已过期，等你回来哦!</p>
        <ActionButton to="/plans" size="small" className="expired-btn">
          立即续费
        </ActionButton>
      </div>
    </div>
  )
})
