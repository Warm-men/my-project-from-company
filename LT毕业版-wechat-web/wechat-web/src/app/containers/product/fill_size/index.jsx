import './index.scss'

export default function FillSize(props) {
  return (
    <div className="fill-size-box">
      <span className="fill-size-text" onClick={props.handleFillSize}>
        完善尺码获得更精准的尺码推荐
        <img
          className="arrow-img"
          src={require('./images/arrow-right.svg')}
          alt=""
        />
      </span>
    </div>
  )
}
