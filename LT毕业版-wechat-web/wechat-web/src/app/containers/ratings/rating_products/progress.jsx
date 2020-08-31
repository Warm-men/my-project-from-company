import './index.scss'

export default function Progress(props) {
  const pointWith = 100 / props.count
  const { hasIncentived, currentCount, count } = props
  let currentPoint = 0
  let pointCount = currentCount
  if (pointCount) {
    if (pointCount > count) {
      pointCount = count
    }
    currentPoint = (pointCount * 100.0) / count - 100.0 / count / 2
  }
  return (
    <div className="progress">
      <div className="progressView">
        <div
          className="progressValue"
          style={{ width: pointCount === count ? '100%' : currentPoint + '%' }}
        />
      </div>
      {Array.from({ length: count }).map((item, index) => {
        const left = pointWith / 2 + index * pointWith + '%'
        const point = ((index + 1) * 100.0) / count - 100.0 / count / 2
        if (index + 1 === count) {
          return (
            <div key={index} className="imageView" style={{ left }}>
              <img
                src={
                  hasIncentived
                    ? require('src/app/containers/ratings/rating_products/images/red_envelope_opened.png')
                    : require('src/app/containers/ratings/rating_products/images/red_envelope.png')
                }
                className="red-envelope"
                alt=""
              />
            </div>
          )
        } else {
          const backgroundColor = currentPoint >= point ? '#FF4536' : '#FFC9C7'
          return (
            <span
              key={index}
              style={{ left, backgroundColor }}
              className="pointView"
            />
          )
        }
      })}
    </div>
  )
}
