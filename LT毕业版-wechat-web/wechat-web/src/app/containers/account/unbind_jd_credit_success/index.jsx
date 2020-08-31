import PageHelmet from 'src/app/lib/pagehelmet'
import './index.scss'

export default React.memo(() => (
  <div className="unbind-jd">
    <PageHelmet title="解绑结果" link="/unbind_jd_credit" />
    <i className="icon-success" />
    <p className="unbind-text">解绑成功</p>
  </div>
))
