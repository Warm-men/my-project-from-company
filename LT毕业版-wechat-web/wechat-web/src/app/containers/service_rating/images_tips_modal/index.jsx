import PreventScroll from 'src/app/components/HOC/PreventScroll/index_hooks.jsx'
import './index.scss'

function ImagesTipsModal({ hideImgModal = () => {} }) {
  return (
    <div className="images-tips-modal">
      <div className="images-modal-box">
        <h5 className="modal-title">
          <span>图片示例</span>
          <span onClick={hideImgModal}>
            <img
              alt=""
              src={require('src/app/containers/service_rating/images/close.svg')}
            />
          </span>
        </h5>
        <p className="tips-text">* 以纽扣脱落为例</p>
        <div className="img-box">
          <div className="demo-img-box">
            <img alt="" src={require('./images/demo1.png')} />
            <h5 className="demo-img-title">整体照</h5>
            <p className="demo-img-text">拍摄服饰整体</p>
            <p className="demo-img-text">并指出问题区域</p>
          </div>
          <div className="demo-img-box">
            <img alt="" src={require('./images/demo2.png')} />
            <h5 className="demo-img-title">局部照</h5>
            <p className="demo-img-text">拍摄服饰局部</p>
            <p className="demo-img-text">并展示质量情况</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PreventScroll(ImagesTipsModal)
