import React, { PureComponent } from 'react'
import { TouchableOpacity, StyleSheet, Text } from 'react-native'
export default class ReasonItem extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { selected: false }
  }
  onSelectItem = () => {
    this.setState({ selected: !this.state.selected }, () => {
      this.props.onPress &&
        this.props.onPress(this.state.selected, this.props.id, this.props.text)
      this.props.onValueChange &&
        this.props.onValueChange(
          this.state.selected,
          this.props.text,
          this.props.id
        )
    })
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.id !== nextProps.selectedId) {
      this.setState({ selected: false })
    }
  }
  render() {
    const { text, style, titleStyle, selectedStlye, normalStyle } = this.props

    let selectedTitleStyle = selectedStlye ? selectedStlye : styles.likeButton

    let normalTitleStyle = normalStyle ? normalStyle : styles.unLikeButton
    return (
      <TouchableOpacity
        style={[
          styles.button,
          style,
          this.state.selected === null
            ? normalTitleStyle
            : this.state.selected
            ? selectedTitleStyle
            : normalTitleStyle
        ]}
        onPress={this.onSelectItem}>
        <Text
          style={[
            styles.buttonText,
            titleStyle,
            this.state.selected === null
              ? styles.unLikeButtonText
              : this.state.selected
              ? styles.likeButtonText
              : styles.unLikeButtonText
          ]}>
          {text}
        </Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 14
  },
  likeButton: {
    borderWidth: 1,
    borderColor: '#E85C40'
  },
  likeButtonText: {
    color: '#E85C40'
  },
  unLikeButton: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1
  },
  unLikeButtonText: {
    color: '#333'
  }
})
