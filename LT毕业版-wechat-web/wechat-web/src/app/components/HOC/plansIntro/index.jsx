import PlansIntroComponent from 'src/app/containers/plans/plansIntro'
import * as storage from 'src/app/lib/storage.js'

export default WrappedComponent =>
  class extends React.Component {
    clickButton = () => {
      storage.set('clickButton', true)
      this.forceUpdate()
    }

    render() {
      //NOTE: Circle of friends enter plans,(KOL enter plans, need show activity page)
      const {
        location: {
          query: { /*utm_medium*/ next_page }
        }
      } = this.props

      //NOTE: zhima credit not valid, click '未验证' in update_userinfo page
      // if (isZhimaCredit && isZhimaCredit === 'zhima_credit')
      //   return <WrappedComponent {...this.props} />

      if (!Boolean(storage.get('clickButton')) && next_page === 'activity') {
        //NOTE: if activity start, subscriber and non memberships. all enter activity page
        return <PlansIntroComponent clickButton={this.clickButton} />
      } else if (next_page === 'authorize') {
        return <WrappedComponent {...this.props} />
      } else {
        //NOTE: 朋友圈广告(ads)进入认证页
        return <WrappedComponent {...this.props} />
      }
    }
  }
