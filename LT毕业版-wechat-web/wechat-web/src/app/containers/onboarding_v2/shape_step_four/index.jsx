import React, { Component } from 'react'
import classnames from 'classnames'
import Actions from 'src/app/actions/actions'
import { NextPage } from '../index'
import * as storage from 'src/app/lib/storage.js'
import './index.scss'

class Shape extends Component {
  constructor(props) {
    super(props)
    this.state = {
      shape: storage.get('shape') || ''
    }
  }

  componentWillUnmount() {
    storage.set('shape', this.state.shape)
  }

  handleSelect = value => () =>
    this.setState(
      {
        shape: value
      },
      () => {
        this.props.dispatch(
          Actions.onboarding.setOnboardingComplete('question4')
        )
      }
    )

  handleNextPage = () => {
    const { onboardingNextStep } = this.props
    const shape = this.state.shape
    if (shape) {
      this.props.updateStyleInfo(
        {
          shape
        },
        onboardingNextStep
      )
    } else {
      onboardingNextStep()
    }
  }

  render() {
    const {
      onboarding: { onboarding_questions }
    } = this.props
    const page = onboarding_questions.question4.pages[0]
    const sub = page.sub_questions[0]
    return (
      <div className="shape-v2">
        <div className="step-title">{page.page_title}</div>
        <div className="images-goups">
          {sub.images.map((item, index) => (
            <div className="wraper" key={index}>
              <i
                className="shape-image"
                style={{ backgroundImage: `url(${item.image_url.selected})` }}
              />
              <div
                key={index}
                className={classnames('button-shape', {
                  'bg-yellow': this.state.shape === sub.buttons[index].value
                })}
                onClick={this.handleSelect(sub.buttons[index].value)}
              >
                {sub.buttons[index].tips}
              </div>
            </div>
          ))}
        </div>
        <NextPage onboardingNextStep={this.handleNextPage} />
      </div>
    )
  }
}

export default Shape
