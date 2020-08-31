import withHandleTouch from 'src/app/components/HOC/with_handletouch'
import './index.scss'

export default withHandleTouch(
  React.memo(({ handleFinish = () => {} }) => (
    <div className="new-totes-guide" onClick={handleFinish}>
      <div className="guide-img" />
      <div className="new-totes-icon">
        <img
          src={require('src/app/containers/product/detail_buttons/images/new-cart.svg')}
          alt=""
        />
        <span>新衣箱</span>
      </div>
    </div>
  ))
)
