import StyleProfileSaveButton from '../style_profile_save_button'
import PageHelmet from 'src/app/lib/pagehelmet'
import { connect } from 'react-redux'
import classNames from 'classnames'
import * as ARRAY from '../utils'
import Actions from 'src/app/actions/actions.js'
import 'src/assets/stylesheets/mobile/questions_section.scss'
import GeneralWxShareHOC from 'src/app/components/HOC/GeneralWxShare'
import { browserHistory } from 'react-router'
const mapStateToProps = state => {
  const { customer } = state
  return {
    customer_id: customer.id,
    style: customer.customer_product_filters
  }
}

@connect(mapStateToProps)
@GeneralWxShareHOC
export default class FiltersQuiz extends React.PureComponent {
  constructor(props) {
    super(props)
    this.limitedTypes = {
      accessory_categories: 3,
      accessory_colors: 1,
      clothing_categories: 4,
      clothing_colors: 4,
      prints: 3
    }
    this.state = {
      style: props.style
    }
  }

  handleSelect = (filterType, optionToggled) => () => {
    let newStyle = { ...this.state.style }
    let styleOption = [...newStyle[filterType]]
    const isInclude = _.includes(styleOption, optionToggled)
    if (isInclude) {
      styleOption = _.without(styleOption, optionToggled)
    } else {
      styleOption.push(optionToggled)
      styleOption = this.limitOptionsSelected(styleOption, filterType)
    }
    newStyle[filterType] = styleOption
    this.setState({
      style: newStyle
    })
  }

  limitOptionsSelected = (styleOption, optionType) => {
    const limit = this.limitedTypes[optionType]
    if (limit && styleOption.length > limit) {
      styleOption.splice(0, 1)
    }
    return styleOption
  }

  isClearMargin = (sum, index) =>
    sum % 6 === 0 && sum % 12 !== 0 && (index + 1) % 6 === 0

  updateCustomerInfo = () => {
    const { style } = this.state
    this.props.dispatch(
      Actions.updateProductFilters.updateProductFilters(
        {
          filters: style
        },
        () => {
          this.props.dispatch(
            Actions.currentCustomer.fetchMe(browserHistory.goBack)
          )
        }
      )
    )
  }

  buildQuestionSection = (
    sectionHeading,
    answerOptions,
    styleInfoKey,
    maxNum
  ) => {
    return (
      <div className="questions-section">
        {sectionHeading && (
          <div className="section-heading-wrapper">
            <div className="section-heading">{sectionHeading}</div>
            {maxNum && <div className="subheading">不超过{maxNum}类</div>}
          </div>
        )}
        <div className="selectors-wrapper">
          {answerOptions.map((answerOption, index) => {
            if (_.includes(['Maxi Dresses', 'Regular Dresses'], answerOption)) {
              return null
            }

            const optionValue = answerOption.value.toLowerCase(),
              isSelect = _.includes(this.state.style[styleInfoKey], optionValue)

            const classnames = classNames({
              'selector-option-box': true,
              select: isSelect,
              'clear-margin': this.isClearMargin(answerOptions.length, index)
            })

            return (
              <div
                className={classnames}
                key={index}
                onClick={this.handleSelect(styleInfoKey, optionValue)}
              >
                {answerOption.icon && (
                  <span className="selector-option-icon">
                    <img src={answerOption.icon} alt={answerOption.text} />
                  </span>
                )}
                {answerOption.color && (
                  <span className="selector-option-icon">
                    <span
                      style={{ backgroundColor: answerOption.color }}
                      className="selector-option-color"
                    />
                  </span>
                )}
                <span
                  className={
                    answerOption.color || answerOption.icon
                      ? 'selector-option-text'
                      : 'selector-option-text text-center'
                  }
                >
                  {answerOption.text}
                  <div
                    className={`${
                      isSelect
                        ? `generic-diagonal-strike`
                        : `generic-diagonal-strike hide`
                    }`}
                  />
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="quiz-wrapper">
        <PageHelmet title={`不喜欢`} link={`/style_profile/Filters`} />
        <p className="tips-text">挑出你不想在衣箱中看见的品类</p>
        {this.buildQuestionSection(
          '衣服',
          ARRAY.clothing_categories,
          'clothing_categories',
          this.limitedTypes['clothing_categories']
        )}
        {this.buildQuestionSection(
          '配饰',
          ARRAY.accessory_categories,
          'accessory_categories',
          this.limitedTypes['accessory_categories']
        )}
        {this.buildQuestionSection(
          '颜色',
          ARRAY.clothing_colors,
          'clothing_colors',
          this.limitedTypes['clothing_colors']
        )}
        {this.buildQuestionSection(
          '印花',
          ARRAY.prints,
          'prints',
          this.limitedTypes['prints']
        )}
        <StyleProfileSaveButton saveStyleProfile={this.updateCustomerInfo} />
      </div>
    )
  }
}
