import wxInit from 'src/app/lib/wx_config'
import deviceType from 'src/app/lib/device_type'
import { APPStatisticManager, BaiduStatisService } from '../../../lib/app'

const CustomWxShareHOC = WrapperComponent =>
  class extends React.Component {
    componentDidMount() {
      if (deviceType().isiOS) {
        wxInit()
      } else {
        wxInit(true, null, true)
      }
      const share_params = this.props.share_params
      //WECHATSHARE: 用户微信分享HOC
      wx.ready(() => {
        this.onMenuShareTimeline(share_params)
        this.onMenuShareAppMessage(share_params)
      })
    }

    handleAnalyze = () => {
      const { analyzeAction, analyzeLabel } = this.props
      if (_.isEmpty(analyzeAction) || _.isEmpty(analyzeLabel)) {
        return null
      }
      APPStatisticManager.service(BaiduStatisService.id).track(
        'share',
        analyzeLabel,
        analyzeAction
      )
    }

    onMenuShareTimeline = share_params => {
      wx.onMenuShareTimeline({
        title: (share_params && share_params.title) || `Le Tote 托特衣箱`,
        link:
          (share_params && share_params.link) ||
          `https://${window.location.host}/home`,
        imgUrl:
          (share_params && share_params.imgUrl) ||
          'https://qimg.letote.cn/logo/12logo400x400.png',
        fail: () => wxInit(true, this.onMenuShareTimeline),
        complete: this.handleAnalyze
      })
    }

    onMenuShareAppMessage = share_params => {
      wx.onMenuShareAppMessage({
        title: (share_params && share_params.title) || `Le Tote 托特衣箱`,
        desc:
          (share_params && share_params.desc) ||
          '来自美国的时装共享平台，成为会员即刻随心穿搭，尽情尝试不同风格',
        link:
          (share_params && share_params.link) ||
          `https://${window.location.host}/home`,
        imgUrl:
          (share_params && share_params.imgUrl) ||
          'https://qimg.letote.cn/logo/12logo400x400.png',
        type: 'link',
        fail: () => wxInit(true, this.onMenuShareAppMessage),
        complete: this.handleAnalyze
      })
    }

    render() {
      return <WrapperComponent {...this.props} />
    }
  }

export default CustomWxShareHOC
