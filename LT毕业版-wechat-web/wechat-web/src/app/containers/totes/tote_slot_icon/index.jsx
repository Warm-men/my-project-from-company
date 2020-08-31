import './index.scss'

export default function ToteSlotIcon({ slot, type }) {
  return (
    <div className="tote-slot-icon">
      {type === 'Clothing' ? (
        <img
          className="icon-img clothing"
          src={require('src/app/containers/totes/tote_slot_icon/images/tote_slot_clothing.svg')}
          alt=""
        />
      ) : (
        <img
          className="icon-img accessory"
          src={require('src/app/containers/totes/tote_slot_icon/images/tote_slot_accessory.svg')}
          alt=""
        />
      )}
      <span className="slot-num">{slot}</span>
    </div>
  )
}
