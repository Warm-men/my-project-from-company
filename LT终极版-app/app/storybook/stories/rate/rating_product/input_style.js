/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import RatingStar from '../rating_star'
import Row from './row'

export default class StyleContainer extends PureComponent {
  constructor(props) {
    super(props)
    const { questions } = this.props.data
    const main = questions.find(item => item.key === 'style_issues')
    const like = questions.find(item => item.key === 'liked_style')

    this.state = { rating: 0, main, like, style_issues: [] }
  }

  setRatingNum = rating => {
    const object = { rating }
    if (!!this.state.rating && this.state.rating >= 4 && rating < 4) {
      object.style_issues = []
    }
    if (!!this.state.rating && this.state.rating < 4 && rating >= 4) {
      object.style_issues = []
    }
    this.setState(object, () => {
      const { updateStyle } = this.props
      updateStyle(rating, this.state.style_issues)
    })
  }

  _didSelectedItem = (key, item) => {
    const style_issues = [...this.state.style_issues]
    const index = style_issues.findIndex(i => i === item.value)
    if (index === -1) {
      style_issues.push(item.value)
    } else {
      style_issues.splice(index, 1)
    }
    this.setState({ style_issues }, () => {
      const { updateStyle } = this.props
      updateStyle(this.state.rating, style_issues)
    })
  }

  render() {
    const { main, rating, style_issues, like } = this.state
    if (!main) {
      return null
    }
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{main.display}</Text>
          <RatingStar setRatingNum={this.setRatingNum} style={styles.stars} />
        </View>
        {!!rating && (
          <View>
            <Text style={styles.description}>
              {rating < 4 ? '不喜欢的地方' : '喜欢的地方'}
            </Text>
            <Row
              hiddenTitle
              isSubQuestion
              data={rating < 4 ? main : like}
              value={style_issues}
              onPress={this._didSelectedItem}
            />
          </View>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  header: { flexDirection: 'row', alignItems: 'center' },
  title: { marginRight: 20, fontSize: 16, color: '#242424' },
  stars: { marginTop: 0, marginBottom: 0 },
  description: { fontSize: 14, color: '#989898', marginVertical: 16 }
})
