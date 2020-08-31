/* @flow */

import React, { PureComponent } from 'react'
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native'
import { l10nForRatingKey } from '../../../src/expand/tool/product_l10n'
import LabelView from './rate_label.js'

export default class RatingFitting extends PureComponent {
  constructor(props) {
    super(props)
    const { rating, issues } = props
    const fittings = {}
    issues.possible_answers.forEach(item => {
      if (rating) {
        let value = rating[item.display]
        fittings[item.display] = value
      }
    })
    this.defaultFittings = fittings
    this.state = {
      rateFittings: fittings,
      fit: rating ? rating.fit : null,
      rating
    }
  }

  setLike = () => {
    if (!this.state.fit) {
      this.setState({ fit: true, rateFittings: {} })
      const { didSelectedFitting, issues } = this.props
      const fittings = {}
      issues.possible_answers.forEach(item => {
        fittings[item.display] = 'fit'
      })
      didSelectedFitting({ ...fittings, fit: true }, true)
    }
  }

  setUnLike = () => {
    if (
      this.state.fit ||
      this.state.fit === null ||
      this.state.fit === undefined
    ) {
      this.setState({ fit: false, rateFittings: this.defaultFittings })
      const { didSelectedFitting } = this.props
      didSelectedFitting(
        {
          ...this.defaultFittings,
          fit: Object.keys(this.defaultFittings).length ? false : true
        },
        false
      )
    }
  }

  _didSelectedIssues = (value, rating_key) => {
    const { didSelectedFitting } = this.props
    const newRateFittings = { ...this.state.rateFittings, [rating_key]: value }
    this.setState({
      rateFittings: newRateFittings
    })
    didSelectedFitting(
      { ...newRateFittings, fit: false },
      false,
      rating_key,
      value
    )
  }

  render() {
    const { issues } = this.props
    const { fit } = this.state
    return (
      <View style={styles.styleButtonView}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ alignItems: 'center', marginRight: 32 }}>
            <Text style={styles.titleText}>尺码评价</Text>
          </View>
          <LabelView
            like={fit}
            text={'合身'}
            onPress={this.setLike}
            type={true}
          />
          <LabelView
            like={fit}
            text={'不合身'}
            onPress={this.setUnLike}
            type={false}
          />
        </View>
        {fit === false ? (
          <View style={styles.contentView}>
            <View
              style={{
                width: '100%',
                height: 20,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 20
              }}>
              <Text style={{ fontSize: 12, color: '#5E5E5E' }}>
                请告诉我们具体的问题，便于下次更好的尺码推荐
              </Text>
            </View>
            {issues.follow_ups.map((item, i) => {
              let findIndex = item.possible_answers.findIndex(function(i) {
                return i.value === 'fit'
              })
              let possible_answers = item.possible_answers.slice()
              possible_answers.splice(findIndex, 1)
              return (
                <View style={styles.buttonView} key={i}>
                  <View style={styles.buttonViewTitle}>
                    <Text>{l10nForRatingKey(item.rating_key)}</Text>
                  </View>
                  <View style={styles.buttonsBox}>
                    {possible_answers.map((possible_answers_item, k) => {
                      return (
                        <Button
                          key={k}
                          rating_key={item.rating_key}
                          title={possible_answers_item.display}
                          value={possible_answers_item.value}
                          onPress={this._didSelectedIssues}
                          rateFittings={this.state.rateFittings}
                          isSelected={
                            this.state.rateFittings[item.rating_key] ===
                            possible_answers_item.value
                          }
                        />
                      )
                    })}
                  </View>
                </View>
              )
            })}
          </View>
        ) : null}
      </View>
    )
  }
}

class Button extends PureComponent {
  _didSelected = () => {
    const { value, onPress, rating_key } = this.props
    onPress(value, rating_key)
  }
  render() {
    const { title, rateFittings, rating_key, value } = this.props
    let isSelecteds = rateFittings[rating_key] === value

    return (
      <TouchableOpacity
        style={[
          styles.button,
          isSelecteds ? styles.likeButton : styles.unLikeButton
        ]}
        onPress={this._didSelected}>
        <Text
          style={[
            styles.buttonText,
            isSelecteds ? styles.likeButtonText : styles.unLikeButtonText
          ]}>
          {title}
        </Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  styleButtonView: {
    marginVertical: 10,
    paddingBottom: 10
  },
  contentView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
    backgroundColor: 'rgb(249,249,251)',
    borderColor: '#EFEFEF',
    borderWidth: 1
  },
  titleText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '700'
  },
  subtitle: {
    fontSize: 12,
    color: '#999'
  },
  buttonView: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center'
  },
  buttonViewTitle: {
    height: 41,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonsBox: {
    flexDirection: 'row',
    height: 41,
    alignItems: 'center'
  },
  button: {
    borderRadius: 100,
    width: 72,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
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
