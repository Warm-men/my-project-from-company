import React, { Component } from 'react'
import classnames from 'classnames'
import Actions from 'src/app/actions/actions'
import { NextPage } from '../index'
import * as storage from 'src/app/lib/storage.js'
import './index.scss'

const CLASSNAME_MAPPING = {
  年龄: 'age_range',
  星座: 'constellation',
  婚育状态: 'marriage'
}

class BasicInfomation extends Component {
  constructor(props) {
    super(props)
    const { marriage: { mom, marital_status } = {}, age_range, constellation } =
      JSON.parse(storage.get('cacheDate8')) || {}
    this.state = {
      marriage: {
        mom,
        marital_status
      },
      age_range,
      constellation
    }
  }

  componentWillUnmount() {
    const { marriage, age_range, constellation } = this.state
    storage.set(
      'cacheDate8',
      JSON.stringify({
        marriage,
        age_range,
        constellation
      })
    )
  }

  handleSelect = (type, value) => () => {
    const state = this.state
    state[type] = value
    this.setState(
      {
        state
      },
      () => {
        const {
          marriage: { marital_status },
          age_range,
          constellation
        } = this.state
        if (marital_status && age_range && constellation) {
          this.props.dispatch(
            Actions.onboarding.setOnboardingComplete('question8')
          )
        }
      }
    )
  }

  handleNextPage = () => {
    const { onboardingNextStep, updateStyleInfo } = this.props
    const { marriage, age_range, constellation } = this.state
    updateStyleInfo(
      {
        ...marriage,
        age_range,
        constellation
      },
      onboardingNextStep
    )
  }

  render() {
    const {
      onboarding: { onboarding_questions }
    } = this.props
    const page = onboarding_questions.question8.pages[0]
    return (
      <div className="basic-infomation">
        <div className="step-title">{page.page_title}</div>
        {page.sub_questions.map((item, index) => {
          const mappingValue = CLASSNAME_MAPPING[item.value]
          return (
            <div key={index} className={mappingValue}>
              <div className="title">{item.tips}</div>
              {item.buttons.map(item_buttons => {
                return (
                  <div
                    key={item_buttons.tips}
                    className={classnames(`${mappingValue}-section${index}`, {
                      'bg-yellow':
                        mappingValue !== 'constellation' &&
                        _.isEqual(this.state[mappingValue], item_buttons.value),
                      'constellation-acitved':
                        mappingValue === 'constellation' &&
                        this.state.constellation === item_buttons.value
                    })}
                    onClick={this.handleSelect(
                      mappingValue,
                      item_buttons.value
                    )}
                  >
                    {mappingValue === 'constellation' && (
                      <i
                        className="constellation-icon"
                        style={{
                          backgroundImage: `url(${item_buttons.image_url.selected})`
                        }}
                      />
                    )}
                    <div
                      className={classnames({
                        'section-tips': mappingValue === 'constellation'
                      })}
                    >
                      {item_buttons.tips}
                    </div>
                    {mappingValue === 'constellation' && (
                      <span className="date">{item_buttons.sub_tips}</span>
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}
        <NextPage onboardingNextStep={this.handleNextPage} />
      </div>
    )
  }
}

export default BasicInfomation
