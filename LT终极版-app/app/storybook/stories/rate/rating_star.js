import React, { Component, PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import Image from '../../../storybook/stories/image.js'

export default class RatingStar extends Component {
  constructor(props) {
    super(props)
    this.state = { rating: props.defaultRating }
  }
  setRating = rating => {
    if (rating !== this.state.rating) {
      this.setState({ rating })
      this.props.setRatingNum && this.props.setRatingNum(rating)
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.defaultRating !== this.props.defaultRating) {
      this.setState({ rating: nextProps.defaultRating })
    }
  }

  render() {
    return (
      <View style={[styles.starView, this.props.style]}>
        {Array.from({ length: 5 }).map((item, index) => {
          return (
            <RatingStarItem
              key={index}
              index={index}
              onPress={this.setRating}
              rating={this.state.rating}
            />
          )
        })}
      </View>
    )
  }
}

export class RatingStarItem extends PureComponent {
  setRating = () => {
    this.props.onPress(this.props.index + 1)
  }

  render() {
    return (
      <TouchableOpacity style={styles.container} onPress={this.setRating}>
        <Image
          source={
            this.props.rating > this.props.index
              ? require('../../../assets/images/rating/select_star.png')
              : require('../../../assets/images/rating/unSelect_star.png')
          }
          resizeMode="cover"
        />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginRight: 14
  },
  starView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40
  }
})
