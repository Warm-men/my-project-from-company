import { useState } from 'react'
import * as storage from 'src/app/lib/storage.js'
import withHandleTouch from 'src/app/components/HOC/with_handletouch/index_hooks.jsx'
import './index.scss'

const Guide = withHandleTouch(props => {
  return (
    <div className="new-totes-free-service-guide" onClick={props.handleGuide}>
      <img
        style={{ marginTop: -65 }}
        src={require('./images/guide.png')}
        alt=""
      />
    </div>
  )
})

function TipsHelp(props) {
  return (
    <div className="title-tips-modal">
      <div className="tips-modal-text">
        <span
          className="tips-modal-icon"
          style={{ left: props.openFreeService ? 88 : 118 }}
        />
        <section onClick={props.changeShowTips}>
          {props.openFreeService
            ? '如果近期不方便归还自在选，可以选择临时关闭，这样下个衣箱将不含自在选增加的2个衣位。'
            : '已临时关闭自在选，如果想要恢复使用自在选，可以点击按钮开启，将恢复自在选增加的2个衣位。'}
        </section>
        <span onClick={props.changeShowTips} className="tips-modal-close">
          x
        </span>
      </div>
    </div>
  )
}

export default function CartFreeServiceTitle(props) {
  const [isShowGuide, setIsShowGuide] = useState(
    !props.isShowTotesCartGuide &&
      !storage.get('NewTotesFreeServiceGuide', localStorage) &&
      props.used_free_service
  )
  const [showTipsModal, setShowTipsModal] = useState(false)

  const changeShowTips = () => setShowTipsModal(show => !show)

  const openFreeService = !props.disable_free_service
  const handleGuide = () => {
    storage.set('NewTotesFreeServiceGuide', true, localStorage)
    setIsShowGuide(false)
  }
  return (
    <>
      <div className="cart-free-service-title">
        <div className="free-service-title-left">
          <span className="free-service-title-text">
            {openFreeService ? '已启用自在选' : '已临时关闭自在选'}
            <img
              alt=""
              className="free-service-title-img"
              src={require('src/app/containers/totes/new_totes/cart_free_serive_title/images/icon.png')}
              onClick={changeShowTips}
            />
            {showTipsModal && (
              <TipsHelp
                changeShowTips={changeShowTips}
                openFreeService={openFreeService}
              />
            )}
          </span>
        </div>
        <span
          className={`free-service-btn ${openFreeService ? '' : 'active'}`}
          onClick={props.handleFreeService}
        >
          {openFreeService ? '临时关闭' : '恢复启用'}
        </span>
      </div>
      {isShowGuide && <Guide handleGuide={handleGuide} />}
    </>
  )
}
