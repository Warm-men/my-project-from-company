import ActionButton from 'src/app/components/shared/action_button/index'
import RangeDatePicker from 'src/app/components/CityPicker/RangeDatePicker'
import PageHelmet from 'src/app/lib/pagehelmet'
import { format, addDays } from 'date-fns'

export default function Hold(props) {
  const dueTo = days => format(addDays(new Date(), days + 1), 'YYYY年MM月DD日')

  const { handleSelectDate, selectedDays, isEnabled, selectHoldDays } = props

  const handleClick = e => {
    e.preventDefault()
    props.goOnHold && props.goOnHold()
  }

  return (
    <div className="profile-hold-container">
      <PageHelmet title={`暂停会员`} link={`/hold`} />
      <p className="title">请告诉我们暂停原因？</p>
      <div className="comments-section">
        {_.map(props.comments, (val, key) => (
          <span
            key={key}
            onClick={props.changeHoldComment}
            data-comment={key}
            className={`section-button ${
              props.selectedComment === key ? 'select' : ''
            }`}
          >
            {val}
          </span>
        ))}
      </div>
      <p className="title">想暂停到哪一天？</p>
      <div className="select-days">
        <div onClick={handleSelectDate} className="hold-date-select">
          {props.select_date || '请选择...'}
        </div>
        {selectedDays && (
          <div className="prompt-info">
            <div className="arrow" />
            将于{selectedDays && dueTo(selectedDays)}上午8点恢复
          </div>
        )}
        <RangeDatePicker
          onConfirm={props.onConfirm}
          onCancel={props.onCancel}
          onChange={selectHoldDays}
          visible={props.visible}
        />
      </div>
      <div className="profile-hole-description">
        <p className="description-title">会员暂停说明</p>
        <p className="description-text">1、最长可以申请暂停30天</p>
        <p className="description-text">
          2、在提交之后，暂时不能下单新的衣箱。当平台确认你已归还所有商品后，会正式开始暂停，并相应的延长你的会员有效期
        </p>
      </div>
      <div className="profile-hold-btn">
        <ActionButton type="submit" onClick={handleClick} disabled={!isEnabled}>
          {props.isSubmitting ? '提交中...' : '提交'}
        </ActionButton>
      </div>
    </div>
  )
}
