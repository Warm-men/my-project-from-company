import React, { Component } from 'react'
import classnames from 'classnames'
import Actions from 'src/app/actions/actions.js'
import { NextPage } from '../index'
import './index.scss'

class Defects extends Component {
  handleSelect = value => () => {
    const {
      onboarding: {
        onboarding_questions: { question6 }
      },
      dispatch
    } = this.props
    const attribute_type = question6.value,
      name = question6.pages[0].sub_questions[0].value
    const answer = {
      attribute_type,
      name,
      value
    }
    dispatch(
      Actions.onboarding.setUserSelectAnwers({
        step: 'question6',
        answer
      })
    )
    dispatch(Actions.onboarding.setOnboardingComplete('question6'))
  }
  render() {
    const {
      onboarding: { onboarding_questions, selectAnwers },
      onboardingNextStep
    } = this.props
    const page = onboarding_questions.question6.pages[0]
    const sub_questions = page.sub_questions[0],
      col_one = sub_questions.checkboxs.slice(0, 5),
      col_two = sub_questions.checkboxs.slice(5)
    return (
      <div className="defects">
        <div className="step-title">{page.page_title}</div>
        <div className="defects-wrapper">
          <div className="col-one">
            {col_one.map(item => {
              const isSelected =
                _.findIndex(
                  selectAnwers['question6'],
                  ps => ps.value === item.value
                ) !== -1
              return (
                <Checkboxs
                  key={item.value}
                  {...item}
                  isSelected={isSelected}
                  handleSelect={this.handleSelect}
                />
              )
            })}
          </div>
          <i className="defects-image" />
          <div className="col-two">
            {col_two.map(item => {
              const isSelected =
                _.findIndex(
                  selectAnwers['question6'],
                  ps => ps.value === item.value
                ) !== -1
              return (
                <Checkboxs
                  key={item.value}
                  {...item}
                  isSelected={isSelected}
                  handleSelect={this.handleSelect}
                />
              )
            })}
          </div>
        </div>
        <NextPage onboardingNextStep={onboardingNextStep} />
      </div>
    )
  }
}

const Checkboxs = ({ tips, value, isSelected, handleSelect }) => (
  <div className="check-box" onClick={handleSelect(value)}>
    <span
      className={classnames('selected', {
        'is-selected': isSelected
      })}
    />
    {tips}
  </div>
)

export default Defects
