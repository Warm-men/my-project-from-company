import WithHandleTouch from 'src/app/components/HOC/with_handletouch'
import 'src/assets/stylesheets/components/desktop/tote_swap/error.scss'

export default WithHandleTouch(
  React.memo(({ closeModal, selectedProductType }) => (
    <div id="tote-swap-error-modal">
      <div className="error-modal-background" onClick={closeModal} />
      <div className="error-modal-body">
        <div className="error-modal-body-message">
          <div>
            非常可惜，
            <br />
            {selectedProductType === 'Accessory'
              ? '这件已被人抢先下单了'
              : '这件暂时没有适合你的尺码'}
          </div>
        </div>
        <div className="error-modal-body-cta" onClick={closeModal}>
          看看其他的
        </div>
      </div>
    </div>
  ))
)
