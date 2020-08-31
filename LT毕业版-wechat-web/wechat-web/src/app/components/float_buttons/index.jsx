import topArrow from 'src/assets/images/top_arrow.svg'
import scrollTopAnimation from 'src/app/lib/request_animation_frame.js'
import './index.scss'

export default function FloatButtons({ buttons = [], isInitScroll }) {
  if (_.isEmpty(buttons)) {
    return null
  }
  return (
    <div className="float-buttons-container">
      {_.map(buttons, (v, k) => {
        if (v) {
          return (
            <div key={k} className="float-button" onClick={v.handleClick}>
              {v.title}
            </div>
          )
        }
      })}
      {isInitScroll && (
        <div className="float-button" onClick={scrollTopAnimation(6)}>
          <img src={topArrow} alt="top" />
        </div>
      )}
    </div>
  )
}
