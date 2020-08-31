import { useEffect, useCallback, useState, useRef } from 'react'
import './index.scss'

export default function DescriptionText({ text }) {
  const maxLine = 5
  const webkit = {
    WebkitBoxOrient: 'vertical',
    lineHeight: '26px',
    WebkitLineClamp: maxLine,
    fontSize: 14
  }
  const textRef = useRef(null)

  const [fullText, setFullText] = useState(false)
  const [isShow, setIsShow] = useState(false)

  useEffect(() => {
    const { WebkitLineClamp, lineHeight, fontSize } = webkit
    const allLine = parseInt(lineHeight, 10) * WebkitLineClamp
    const rowHeight = allLine - (parseInt(lineHeight, 10) + 1)
    const { offsetWidth, offsetHeight } = textRef.current
    // NOTE：满足5行
    if (rowHeight <= offsetHeight) {
      const lineWidth = Math.round(offsetWidth / fontSize)
      // NOTE:满足超过单行最大
      if (text.length / lineWidth > maxLine) {
        setFullText(true)
      }
    }
  }, [])

  const handleShowText = useCallback(() => setIsShow(!isShow))

  const newStyle = isShow ? { ...webkit, WebkitLineClamp: 'inherit' } : webkit
  return (
    <div className="product-detail-description-box">
      <p ref={textRef} style={newStyle} className="detail-description">
        {text}
      </p>
      {fullText && (
        <span className="operation-btn" onClick={handleShowText}>
          {isShow ? '收起' : '展开'}
          <span className={`refine-icon ${isShow ? 'show' : ''}`} />
        </span>
      )}
    </div>
  )
}
