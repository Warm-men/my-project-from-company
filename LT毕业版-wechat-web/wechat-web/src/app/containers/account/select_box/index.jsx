import './index.scss'
import Actions from 'src/app/actions/actions'
import * as storage from 'src/app/lib/storage.js'
import { Link, browserHistory } from 'react-router'
import WithShareListHandler from '../../../components/HOC/withShareListHandler'
import { Column } from 'src/app/constants/column'

function ProfileSelect(props) {
  const handleClick = list => async () => {
    if (list) {
      if (list.isExternal) {
        window.location.href = list.link
      } else {
        const query = {}
        if (list.link === '/unbind_jdcredit') {
          props.showUnbindHint()
          return null
        } else if (list.link === '/free_service') {
          props.dispatch(
            Actions.freeService.getFreeService((dispatch, res) => {
              let link = getLink(res)
              browserHistory.push(link)
            })
          )
          return
        } else if (list.link === '/closet') {
          const actions = Actions.allproducts.clearProducts(list.link)
          const { dispatch } = props
          await dispatch(Actions.mycloset.setWishingClosetFilter('all'))
          await dispatch(actions)
          query.column = Column.OccasionCollection
        } else if (list.link === '/share_list') {
          storage.set(list.link, 0)
          if (props.ShareList.showShareIncentive) {
            storage.remove('displayedTips')
            storage.set('isReceivedRule', true)
            props.ShareList.toShareListLink()
            return null
          }
        }
        storage.remove('displayedTips')
        storage.set('isReceivedRule', true)
        browserHistory.push({ pathname: list.link, query })
      }
    }
  }

  const getLink = res => {
    const { state } = res.data.me.free_service
    if (state === 'active') {
      return '/free_service_active'
    } else if (state === 'apply_refund' || state === 'approved') {
      return '/refunding_free_service'
    } else {
      return '/open_free_service'
    }
  }

  const handleList = () => {
    let newList = [...props.selectList]
    if (standby === 'COMMON' && !showMembership) {
      newList = newList.filter(item => item.title !== '会员中心')
    }
    if (standby === 'MY SERVICE' && !showFreePassowrd) {
      newList = newList.filter(item => item.title !== '免密管理')
    }
    if (standby === 'MY SERVICE' && !showFreeService) {
      newList = newList.filter(item => item.title !== '自在选')
    }
    if (isMiniApp || isJd) {
      newList = newList.filter(item => item.title !== '下载App')
    }
    return _.chunk(newList, 4)
  }

  const {
    isJd,
    title,
    standby,
    showIcon,
    isMiniApp,
    showMembership,
    showFreeService,
    showFreePassowrd,
    ShareList: { showShareIncentive, incentiveText }
  } = props

  return (
    <div className="select-container">
      <h4 className="title">
        <span>{title}</span>
        <span className="standby">{standby}</span>
      </h4>
      {_.map(handleList(), (v, k) => {
        return (
          <ul key={k} className="select-box">
            {_.map(Array(4), (value, index) => {
              const list = v[index]
              return (
                <Link className="link" key={index} onClick={handleClick(list)}>
                  {list && (
                    <>
                      <img className="img" src={list.img} alt="" />
                      <span className="text">{list.title}</span>
                      {list.title === showIcon && <span className="icon" />}
                      {showShareIncentive &&
                        !!incentiveText &&
                        list.link === '/share_list' && (
                          <div className="bnt-bubble-text">{incentiveText}</div>
                        )}
                    </>
                  )}
                </Link>
              )
            })}
          </ul>
        )
      })}
    </div>
  )
}

export default WithShareListHandler(ProfileSelect)
