import { connect } from 'react-redux'
import { useCallback } from 'react'
import { browserHistory } from 'react-router'
import './index.scss'

function mapStateToProps(state) {
  return { closetProductIds: state.closet.productIds }
}

export default connect(mapStateToProps)(ImageStickers)
function ImageStickers(props) {
  const { height, width } = props.photo
  const isNotShow = props.offsetWidth <= 0 || props.offsetHeight <= 0
  const isEmpty = height <= 0 || width <= 0
  return isEmpty || isNotShow
    ? null
    : _.map(props.stickers, (v, k) => (
        <Sticker
          dispatch={props.dispatch}
          closetProductIds={props.closetProductIds}
          offsetWidth={props.offsetWidth}
          offsetHeight={props.offsetHeight}
          photo={props.photo}
          sticker={v}
          key={k}
        />
      ))
}

const emptyTextLength = 41 //NOTE：没有文字时锚点
const minTextLength = 60 //NOTE：最小显示字数宽度
const maxTextLength = 108 //NOTE：最大显示字数宽度

function Sticker(props) {
  if (!props.sticker) {
    return null
  }

  const {
    anchor_x,
    anchor_y,
    degree,
    product: { id, title }
  } = props.sticker
  const { closetProductIds, photo } = props

  const isShow = () => {
    const scale = photo.width / photo.height
    if (photo.height / photo.width > 4 / 3) {
      const truthHeight = (1 / scale) * props.offsetHeight
      const anchorHeight = anchor_y * truthHeight
      const emptyHeightArea = (truthHeight - props.offsetHeight) / 2
      const isValidHeight =
        anchorHeight > emptyHeightArea &&
        anchorHeight < truthHeight - emptyHeightArea
      return isValidHeight
    } else {
      const truthWidth = 1 * scale * props.offsetWidth
      const anchorWidth = anchor_x * truthWidth
      const emptyWidthArea = (truthWidth - props.offsetWidth) / 2
      const isValidWidth =
        anchorWidth > emptyWidthArea &&
        anchorWidth < truthWidth - emptyWidthArea
      return isValidWidth
    }
  }

  const handleClick = useCallback(
    e => {
      e.stopPropagation()
      browserHistory.push({
        pathname: `/products/${id}`,
        state: { column_name: 'CustomerPhotoDetails' }
      })
    },
    [closetProductIds, id]
  )

  const stickerStyle = isTransform => {
    const left = anchor_x * 100
    if (isTransform) {
      return {
        top: `${anchor_y * 100}%`,
        right: `${100 - left}%`,
        flexDirection: 'row-reverse'
      }
    } else {
      return { top: `${anchor_y * 100}%`, left: `${left}%` }
    }
  }

  const isTransform = degree > 0
  const flexDirection = isTransform ? 'row-reverse' : ''

  const textStyle = () => {
    let maxWidth = 0
    let display = 'block'
    const left = anchor_x * props.offsetWidth
    if (isTransform) {
      if (left < minTextLength + emptyTextLength) {
        // NOTE：不显示
        display = 'none'
      } else if (left < maxTextLength + emptyTextLength) {
        maxWidth = left - emptyTextLength - 3
      } else {
        maxWidth = maxTextLength
      }
    } else {
      if (left + minTextLength + emptyTextLength > props.offsetWidth) {
        // NOTE：不显示
        display = 'none'
      } else if (left + maxTextLength + emptyTextLength > props.offsetWidth) {
        maxWidth = props.offsetWidth - (left + emptyTextLength + 3)
      } else {
        maxWidth = maxTextLength
      }
    }
    return { maxWidth, display }
  }

  const newTextStyle = textStyle(title)

  if (!isShow() || newTextStyle.display === 'none') {
    return null
  }
  return (
    <div className="sticker-container" style={stickerStyle(isTransform)}>
      <div className="sticker-icon">
        <div className="sticker-radius" />
        <div className="sticker-circle" />
      </div>
      <div
        className="sticker-border"
        style={{
          marginLeft: isTransform ? 0 : -5,
          marginRight: isTransform ? -5 : 0
        }}
      />
      <div className="sticker-title" style={{ flexDirection }}>
        <span className="text" style={textStyle(title)} onClick={handleClick}>
          {title}
        </span>
      </div>
    </div>
  )
}
