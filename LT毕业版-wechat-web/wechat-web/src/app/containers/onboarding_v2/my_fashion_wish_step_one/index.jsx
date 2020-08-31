import React, { Component } from 'react'
import classnames from 'classnames'
import { NextPage } from '../index'
import Actions from 'src/app/actions/actions.js'
import './index.scss'

class MyFashionWish extends Component {
  handleSelect = value => () => {
    const {
      onboarding: {
        onboarding_questions: { question1 }
      },
      dispatch
    } = this.props
    const attribute_type = question1.value,
      name = question1.pages[0].sub_questions[0].value
    const answer = {
      attribute_type,
      name,
      value
    }
    dispatch(
      Actions.onboarding.setUserSelectAnwers({
        step: 'question1',
        answer
      })
    )
    dispatch(Actions.onboarding.setOnboardingComplete('question1'))
  }
  render() {
    const {
      onboarding: { onboarding_questions, selectAnwers },
      onboardingNextStep
    } = this.props
    const page = onboarding_questions.question1.pages[0]
    return (
      <div className="my-fashin-wish">
        <div className="step-title">{page.page_title}</div>
        {page.sub_questions[0].checkboxs.map((item, index) => {
          const isSelected =
            _.findIndex(
              selectAnwers['question1'],
              ps => ps.value === item.value
            ) !== -1
          return (
            <CheckBox
              key={item.value}
              index={index}
              isSelected={isSelected}
              {...item}
              handleSelect={this.handleSelect}
            />
          )
        })}
        <NextPage onboardingNextStep={onboardingNextStep} />
      </div>
    )
  }
}

const CheckBox = ({ tips, value, handleSelect, index, isSelected }) => (
  <div className="check-box" onClick={handleSelect(value, index)}>
    <span
      className={classnames('selected', {
        'is-selected': isSelected
      })}
    />
    {tips}
  </div>
)

export default MyFashionWish
