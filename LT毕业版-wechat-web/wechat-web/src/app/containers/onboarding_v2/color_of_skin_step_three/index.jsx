import React, { Component } from 'react'
import Actions from 'src/app/actions/actions.js'
import classnames from 'classnames'
import { NextPage } from '../index'
import './index.scss'

class ColorOfSkin extends Component {
  handleSelect = value => () => {
    const {
      onboarding: {
        onboarding_questions: { question3 }
      },
      dispatch
    } = this.props
    const attribute_type = question3.value,
      name = question3.pages[0].sub_questions[0].value
    const answer = {
      attribute_type,
      name,
      value
    }
    dispatch(
      Actions.onboarding.setUserSelectAnwers({
        step: 'question3',
        answer
      })
    )
    dispatch(Actions.onboarding.setOnboardingComplete('question3'))
  }
  render() {
    const {
      onboarding: { onboarding_questions, selectAnwers },
      onboardingNextStep
    } = this.props
    const page = onboarding_questions.question3.pages[0]
    return (
      <div className="color-of-skin">
        <div className="step-title">{page.page_title}</div>
        <div className="images-goups">
          {page.sub_questions[0].images.map((item, index) => (
            <i
              className="skin-image"
              style={{ backgroundImage: `url(${item.image_url.selected})` }}
              key={index}
            />
          ))}
        </div>
        <div className="skin-button-goups">
          {page.sub_questions[0].buttons.map((item, index) => (
            <div
              key={index}
              className={classnames('button-skin', {
                'bg-yellow':
                  selectAnwers['question3'][0] &&
                  selectAnwers['question3'][0].value === item.value
              })}
              onClick={this.handleSelect(item.value)}
            >
              {item.tips}
            </div>
          ))}
        </div>
        <NextPage onboardingNextStep={onboardingNextStep} />
      </div>
    )
  }
}

export default ColorOfSkin
