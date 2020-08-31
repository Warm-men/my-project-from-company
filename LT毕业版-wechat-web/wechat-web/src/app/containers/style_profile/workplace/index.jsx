import SingleSelectButtonGroup from 'src/app/components/buttons/single_select_button_group.jsx'
import IconWorkPlace from 'src/assets/images/style/tinified/icon_work-business.png'
import IconWeekCasual from 'src/assets/images/style/tinified/icon_weekend-casual.png'
import IconDateNight from 'src/assets/images/style/tinified/icon_date-night.png'
import Actions from 'src/app/actions/actions'
import StickyButtonContainer from 'src/app/components/shared/sticky_button_container'
import ActionButton from 'src/app/components/shared/action_button/index'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import PageHelmet from 'src/app/lib/pagehelmet'
import 'src/assets/stylesheets/mobile/style_profile.scss'
import './index.scss'

class WorkPlace extends React.Component {
  constructor(props) {
    super(props)
    const { work_focus, weekend_focus, social_focus } = props.style
    let isValidFashion = false
    if (
      work_focus !== null &&
      weekend_focus !== null &&
      social_focus !== null
    ) {
      isValidFashion = true
    }
    this.state = {
      style: props.style,
      isValidFashion,
      groupList: [
        {
          title: '商务休闲',
          icon: IconWorkPlace,
          key: 'work_focus'
        },
        {
          title: '周末时光',
          icon: IconWeekCasual,
          key: 'weekend_focus'
        },
        {
          title: '晚会活动',
          icon: IconDateNight,
          key: 'social_focus'
        }
      ]
    }
  }

  selectWorkPlace = select => {
    const newStyle = { ...this.state.style, ...select }
    this.setState(
      {
        style: newStyle
      },
      () => {
        if (
          newStyle.work_focus !== null &&
          newStyle.weekend_focus !== null &&
          newStyle.social_focus !== null
        ) {
          this.setState({
            isValidFashion: true
          })
        }
      }
    )
  }

  updateFashionStyle = () => {
    const newStyle = this.state.style
    const newWorkPlace = {
      style: {
        work_focus: newStyle.work_focus,
        weekend_focus: newStyle.weekend_focus,
        social_focus: newStyle.social_focus
      }
    }
    const action = Actions.customerStyleInfo.updateUserDataAction({
      data: newWorkPlace,
      success: () => {
        this.props.dispatch(
          Actions.currentCustomer.fetchMe(() => {
            browserHistory.goBack()
          })
        )
      }
    })
    this.props.dispatch(action)
  }

  onSubmit = () => this.updateFashionStyle()

  render() {
    const { style, groupList, isValidFashion } = this.state
    return (
      <div className="quiz-wrapper">
        <PageHelmet title="场合" link={`/style_profile`} />
        <p className="tips-text">注意场合是魅力的起点</p>
        <div className="user-input-container">
          {groupList.map((v, k) => (
            <div key={k} className="user-input-wrapper">
              <img className="input-heading-icon" src={v.icon} alt="" />
              <div className="input-heading">{v.title}</div>
              <SingleSelectButtonGroup
                questionKey={v.key}
                answerValues={[-1, 0, 1]}
                answerDisplays={['很少', '有时', '经常']}
                activeAnswer={style[v.key]}
                onClick={this.selectWorkPlace}
              />
            </div>
          ))}
        </div>
        <StickyButtonContainer>
          <ActionButton
            disabled={!isValidFashion}
            onClick={this.onSubmit}
            size="stretch"
          >
            保存
          </ActionButton>
        </StickyButtonContainer>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { customer } = state
  return {
    style: customer.style
  }
}

export default connect(mapStateToProps)(WorkPlace)
