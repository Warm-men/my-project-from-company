import PropTypes from 'prop-types'
import './index.scss'
import Actions from 'src/app/actions/actions.js'

class StyleTag extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      tags: props.tags || []
    }
  }

  didSelectedItem = item => {
    const { updateStyleTag } = this.props
    let newTags = []
    const { tags } = this.state
    const index = _.findIndex(tags, v => {
      return v.id === item.id
    })
    if (index >= 0) {
      newTags = _.filter(tags, v => {
        return v.id !== item.id
      })
    } else {
      newTags = [...tags, item]
    }
    this.setState({ tags: newTags })
    updateStyleTag(newTags)
  }

  render() {
    const { styleTags, maxTagsLength, dispatch } = this.props
    const { tags } = this.state
    return (
      <div className="style-tags-container">
        <div className="title">风格标签</div>
        <div className="tags-box">
          {_.map(styleTags, (item, index) => {
            const isSelected = _.findIndex(tags, v => {
              return v.id === item.id
            })
            return (
              <TagItem
                key={index}
                tagItem={item}
                didSelectedItem={this.didSelectedItem}
                isSelected={isSelected > -1}
                tags={tags}
                maxTagsLength={maxTagsLength}
                dispatch={dispatch}
              />
            )
          })}
        </div>
      </div>
    )
  }
}

class TagItem extends React.PureComponent {
  didSelectedItem = () => {
    const {
      tagItem,
      didSelectedItem,
      maxTagsLength,
      tags,
      dispatch,
      isSelected
    } = this.props
    if (tags.length >= maxTagsLength && !isSelected) {
      dispatch(
        Actions.tips.changeTips({
          isShow: true,
          content: `最多只能选${maxTagsLength}个标签`
        })
      )
      return null
    }
    didSelectedItem(tagItem)
  }
  render() {
    const { tagItem, isSelected } = this.props
    const itemStyle = isSelected ? 'tag-item tag-item-on' : 'tag-item'
    return (
      <div className={itemStyle} onClick={this.didSelectedItem}>
        {tagItem.name}
      </div>
    )
  }
}

StyleTag.propTypes = {
  styleTags: PropTypes.array.isRequired,
  updateStyleTag: PropTypes.func.isRequired,
  maxTagsLength: PropTypes.number.isRequired
}
StyleTag.defaultProps = {
  styleTags: [],
  updateStyleTag: () => {},
  maxTagsLength: 3
}

export default StyleTag
