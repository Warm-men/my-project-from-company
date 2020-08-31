import withHandleTouch from 'src/app/components/HOC/with_handletouch'
import './index.scss'

const ClosetProductsGuide = React.memo(({ handleFinish = () => {} }) => {
  return (
    <div className="closet-products-guide">
      <div onClick={handleFinish} className="guide-img" />
    </div>
  )
})

export default withHandleTouch(ClosetProductsGuide)
