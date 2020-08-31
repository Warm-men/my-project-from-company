/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import RatingStar from '../rating_star'
import Row from './row'

export default class QualityContainer extends PureComponent {
  constructor(props) {
    super(props)
    const { questions } = this.props.data
    const main = questions.find(item => item.key === 'quality_issues')
    const like = questions.find(item => item.key === 'liked_quality')
    this.state = { rating: 0, quality_issues: [], main, like }
  }

  setRatingNum = rating => {
    const object = { rating }
    if (!!this.state.rating && this.state.rating >= 4 && rating < 4) {
      object.quality_issues = []
    }
    if (!!this.state.rating && this.state.rating < 4 && rating >= 4) {
      object.quality_issues = []
    }
    this.setState(object, () => {
      const { updateQuality } = this.props
      updateQuality(rating, this.state.quality_issues)
    })
  }

  _didSelectedItem = (key, item) => {
    const quality_issues = [...this.state.quality_issues]
    const index = quality_issues.findIndex(i => i === item.value)
    if (index === -1) {
      quality_issues.push(item.value)
    } else {
      quality_issues.splice(index, 1)
    }
    this.setState({ quality_issues }, () => {
      const { updateQuality } = this.props
      updateQuality(this.state.rating, quality_issues)
    })
  }

  render() {
    const { main, rating, quality_issues, like } = this.state
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
              {rating < 4 ? '不满意的地方' : '满意的地方'}
            </Text>
            <Row
              hiddenTitle
              isSubQuestion
              data={rating < 4 ? main : like}
              value={quality_issues}
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
