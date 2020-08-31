import { withRouter } from 'react-router'
import '../index.scss'

const HomepageClean = React.memo(props => {
  const gotoTotes = () => props.router.push('/plans')
  return (
    <div className="homepage-clean-box">
      <img alt="" src={require('../images/clean_1.png')} />
      <img alt="" src={require('../images/clean_2.png')} />
      <img alt="" src={require('../images/clean_3.png')} />
      <span onClick={gotoTotes} className="clean-btn">
        放心去体验托特衣箱
      </span>
    </div>
  )
})

export default withRouter(HomepageClean)
