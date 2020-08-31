import React, { Component } from 'react'
import Actions from 'src/app/actions/actions.js'
import classnames from 'classnames'
import { NextPage } from '../index'
import delay from 'src/app/lib/delay.js'
import './index.scss'

class MyStyle extends Component {
  state = {
    currentIndex: 0
  }

  handleGoPrePage = () =>
    this.setState(state => ({ currentIndex: state.currentIndex - 1 }))

  handleGoNextPage = () => {
    const {
      onboarding: { selectAnwers }
    } = this.props
    if (!!selectAnwers['question2'][this.state.currentIndex]) {
      this.setState(state => ({
        currentIndex: state.currentIndex + 1
      }))
    }
  }

  switchLove = value => async () => {
    if (this.isCanClick) return null
    this.isCanClick = true
    const {
      onboarding: {
        onboarding_questions: { question2 }
      },
      dispatch
    } = this.props
    const attribute_type = question2.value,
      name = question2.pages[this.state.currentIndex].sub_questions[0].value
    const answer = {
      attribute_type,
      name,
      value
    }
    dispatch(
      Actions.onboarding.setUserSelectAnwers({
        step: 'question2',
        answer
      })
    )
    await delay(200)
    this.isCanClick = false
    this.setState(state => {
      if (state.currentIndex === question2.pages.length - 1) {
        dispatch(Actions.onboarding.setOnboardingComplete('question2'))
        return state
      }
      return { currentIndex: state.currentIndex + 1 }
    })
  }

  render() {
    const {
        onboarding: { onboarding_questions, selectAnwers, toCompleteTheDegree },
        onboardingNextStep
      } = this.props,
      currentIndex = this.state.currentIndex
    const question2 = onboarding_questions.question2
    const page = onboarding_questions.question2.pages[currentIndex]
    const sub_questions = page.sub_questions[0]
    const url = page.sub_questions[0].images[0].image_url.selected
    return (
      <div className="my-style">
        <div className="step-title">{page.page_title}</div>
        <img src={url} alt=".main" className="main-images" />
        <div className="button-arr">
          {!!currentIndex && (
            <span className="pre-page" onClick={this.handleGoPrePage} />
          )}
          <div className="small-page">
            {currentIndex + 1}/{question2.pages.length}
          </div>
          {currentIndex !== 8 && (
            <span
              className={classnames('next-page', {
                'next-page-actived': !!selectAnwers['question2'][currentIndex]
              })}
              onClick={this.handleGoNextPage}
            />
          )}
          <div className="button-groups">
            {sub_questions.buttons.map(item => {
              const currentSelected = selectAnwers['question2'][currentIndex]
              const isSelected =
                currentSelected && currentSelected.value === item.value
              return (
                <Buttons
                  key={item.tips}
                  {...item}
                  isSelected={isSelected}
                  switchLove={this.switchLove}
                />
              )
            })}
          </div>
        </div>
        {toCompleteTheDegree['question2'] ? (
          <NextPage onboardingNextStep={onboardingNextStep} />
        ) : null}
      </div>
    )
  }
}

const Buttons = ({ tips, image_url, value, isSelected, switchLove }) => (
  <div
    className={classnames('buttons', {
      'bg-yellow': isSelected
    })}
    onClick={switchLove(value)}
  >
    <i
      className="emoje"
      style={{
        backgroundImage: `url(${
          image_url[`${isSelected ? 'selected' : 'unselected'}`]
        })`
      }}
    />{' '}
    <div className="btn-tip">{tips}</div>
  </div>
)

export default MyStyle
