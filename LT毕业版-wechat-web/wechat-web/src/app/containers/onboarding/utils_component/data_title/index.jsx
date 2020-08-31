import './index.scss'

const ITEMS = ['基础档案', '身型', '常穿尺码', '品类偏好']

export default function OnboardingTitle(props) {
  const { status } = props
  const width = (100 / 3) * (status ? status : 1 - 1) + '%'

  return (
    <div className="onboarding-header">
      <div className="onboarding-title-item">
        {ITEMS.map((item, index) => {
          const isFocus = status < index
          return (
            <span key={index} className={isFocus ? 'value-normal' : 'value'}>
              {index + 1}
            </span>
          )
        })}
        <div className="line">
          <div className="line-normal" />
          <div className="line-status" style={{ width }}>
            <span className="line-focus" />
          </div>
        </div>
      </div>
      <div className="onboarding-title-item">
        {ITEMS.map((item, index) => {
          const isFocus = status < index
          return (
            <span key={item} className={isFocus ? 'title-normal' : 'title'}>
              {item}
            </span>
          )
        })}
      </div>
    </div>
  )
}
