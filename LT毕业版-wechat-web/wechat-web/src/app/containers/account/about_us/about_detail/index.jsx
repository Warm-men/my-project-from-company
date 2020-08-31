import Agreement from 'src/app/containers/agreement'
import PageHelmet from 'src/app/lib/pagehelmet'
import './index.scss'

export default ({ params: { about } }) => (
  <div className="about-detail">
    {about === 'about_letote' ? <AboutLeTote /> : <Agreement />}
  </div>
)

const AboutLeTote = () => (
  <div className="about-letote">
    <PageHelmet title="关于托特衣箱" link="/about_us/about_letote" />
    <img
      src={require('../../images/letote_logo.png')}
      alt="logo"
      className="letote-logo"
    />
    <div className="letote-desc">
      托特衣箱是美国创先时装共享平台，以优秀的产品和服务品质为核心竞争力，为全球爱美女性提供更环保便捷的时尚穿衣新模式。
    </div>
    <div className="letote-desc">
      成为托特衣箱会员即可免费换穿高品质品牌服饰，帮你轻松解决：“衣橱里永远少一件衣服”的世纪难题。无论上班、聚会、出差、度假、约会、年会、婚礼等各类场景均能满足，“时尚达人”就是你！
    </div>
    <div className="letote-area">
      <p className="main">开启时尚环保新方式</p>
      <div className="letote-desc">
        【品牌服饰随心穿搭】轻松畅享全平台高品质品牌服饰，永葆服饰新鲜感。
      </div>
      <div className="letote-desc">
        【智能定制化服务】大数据和人工智能系统，根据个人风格档案精准推荐，减少选衣成本。
      </div>
      <div className="letote-desc">
        【专业清洗严格消毒】与国内顶尖洗护中心合作，16道工序比手洗还干净，全密封臭氧消毒更极致的清洁与体验。
      </div>
      <div className="letote-desc">
        【顺丰往返包邮】方便省事，在家就能完成试穿体验。
      </div>
    </div>
    <div className="letote-area">
      <p className="main">联系我们</p>
      <div className="letote-info">微信公众号：LeTote托特衣箱</div>
      <div className="letote-info">
        网址：
        <a href="https://www.letote.cn" className="letote-red">
          www.letote.cn
        </a>
      </div>
      <div className="letote-info">
        客服热线：
        <a href="tel:4008070088" className="letote-red">
          4008070088
        </a>
      </div>
    </div>
  </div>
)
