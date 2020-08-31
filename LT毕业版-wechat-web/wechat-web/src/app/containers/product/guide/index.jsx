import withHandleTouch from 'src/app/components/HOC/with_handletouch'
import './index.scss'

export default withHandleTouch(
  React.memo(({ handleFinish = () => {} }) => (
    <div className="product-detail-guide">
      <div onClick={handleFinish} className="guide-img" />
    </div>
  ))
)
