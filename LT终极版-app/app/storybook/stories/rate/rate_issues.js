import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native'
import LabelView from './rate_label.js'
import p2d from '../../../src/expand/tool/p2d'
export default class RatingIssues extends Component {
  constructor(props) {
    super(props)
    const { isStyle, rating, issues } = this.props
    const dic = {}
    issues.forEach(item => {
      if (rating) {
        dic[item.value] = rating[item.value] ? rating[item.value] : null
      } else {
        dic[item.value] = false
      }
    })
    this.defaultRating = dic

    if (isStyle) {
      this.state = {
        like: !rating
          ? null
          : rating.style === 'ok'
          ? null
          : rating.style === 'hated'
          ? false
          : true,
        ...rating,
        ratingItems: dic
      }
    } else {
      this.state = {
        like: rating ? (rating.quality === null ? null : rating.quality) : null,
        ...rating,
        ratingItems: dic
      }
    }
  }

  setUnLike = () => {
    if (this.state.like !== false) {
      const { isStyle, rateTheIssue, didSelected } = this.props
      this.setState({ like: false, ratingItems: this.defaultRating })
      didSelected(this.defaultRating)
      if (isStyle) {
        rateTheIssue('hated')
      } else {
        rateTheIssue(false)
      }
    }
  }

  setLike = () => {
    if (this.state.like !== true) {
      const { isStyle, rateTheIssue, didSelected, issues } = this.props

      const dic = {}
      issues.forEach(item => {
        dic[item.value] = false
      })
      this.setState({ like: true, ...dic })
      didSelected(dic)
      if (isStyle) {
        rateTheIssue('loved')
      } else {
        rateTheIssue(true)
      }
    }
  }

  didSelected = item => {
    const { didSelected } = this.props
    let dic = {}
    dic[item.value] = !this.state.ratingItems[item.value]
    const newRatingItems = { ...this.state.ratingItems, ...dic }
    this.setState({ ratingItems: newRatingItems })
    didSelected(newRatingItems)
  }

  bannerReturn = () => {
    const { isStyle } = this.props
    const { like } = this.state
    if (isStyle) {
      return (
        <View style={styles.bannerbox}>
          <View style={styles.bannerView}>
            <Text style={styles.bannerViewText}>款式评价</Text>
          </View>
          <LabelView
            like={like}
            text={'喜欢'}
            onPress={this.setLike}
            type={true}
          />
          <LabelView
            like={like}
            text={'不喜欢'}
            onPress={this.setUnLike}
            type={false}
          />
        </View>
      )
    } else {
      return (
        <View style={styles.bannerbox}>
          <View style={styles.bannerView}>
            <Text style={styles.bannerViewText}>质量评价</Text>
          </View>
          <LabelView
            like={like}
            text={'满意'}
            onPress={this.setLike}
            type={true}
          />
          <LabelView
            like={like}
            text={'不满意'}
            onPress={this.setUnLike}
            type={false}
          />
        </View>
      )
    }
  }

  render() {
    const { issues, isStyle } = this.props
    return (
      <View style={styles.container}>
        {this.bannerReturn()}
        {this.state.like === false ? (
          <View style={styles.buttonsBox}>
            <View
              style={{
                width: '100%',
                height: 20,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 20
              }}>
              <Text style={{ fontSize: 12, color: '#5E5E5E' }}>
                请告诉我们哪里不{isStyle ? '喜欢' : '满意'}
              </Text>
            </View>
            {issues.map((item, index) => {
              return (
                <Button
                  item={item}
                  rating={this.state.ratingItems}
                  onPress={this.didSelected}
                  key={index}
                />
              )
            })}
          </View>
        ) : null}
      </View>
    )
  }
}

export class Button extends Component {
  didSelected = () => {
    const { item, onPress } = this.props
    onPress(item)
  }

  render() {
    const { item, rating } = this.props
    let show = rating[item.value]
    return (
      <TouchableOpacity
        onPress={this.didSelected}
        style={[styles.button, show ? styles.likeButton : styles.unLikeButton]}>
        <Text
          style={[
            styles.buttonText,
            show ? styles.likeButtonText : styles.unLikeButtonText
          ]}>
          {item.display}
        </Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: p2d(20)
  },
  bannerbox: {
    flexDirection: 'row'
  },
  bannerView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 26,
    marginRight: p2d(32)
  },
  bannerViewText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '700'
  },
  buttonsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    backgroundColor: 'rgb(249,249,251)',
    marginTop: 18,
    padding: 10,
    paddingTop: 0,
    borderColor: '#EFEFEF',
    borderWidth: 1
  },
  button: {
    borderRadius: 13,
    width: 72,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    marginRight: 10
  },
  buttonText: {
    fontSize: 12
  },
  likeButton: {
    backgroundColor: '#F3BF78'
  },
  likeButtonText: {
    color: '#FFF'
  },
  unLikeButton: {
    backgroundColor: 'rgb(249,249,251)',
    borderColor: '#ccc',
    borderWidth: 1
  },
  unLikeButtonText: {
    color: '#333'
  }
})
