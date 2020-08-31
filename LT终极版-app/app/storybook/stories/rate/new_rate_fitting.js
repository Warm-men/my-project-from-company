/* @flow */

import React, { Component, PureComponent } from 'react'
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native'
import { l10nForRatingKey } from '../../../src/expand/tool/product_l10n'
import p2d from '../../../src/expand/tool/p2d'
export default class RatingFitting extends Component {
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
    this.state = {
      rateFittings: fittings,
      fit: rating ? rating.fit : null,
      rating
    }
  }

  _didSelectedIssues = (value, rating_key) => {
    const { didSelectedFitting } = this.props
    const isSame = this.state.rateFittings[rating_key] === value
    const newRateFittings = {
      ...this.state.rateFittings,
      [rating_key]: !isSame ? value : null
    }
    this.setState(
      {
        rateFittings: newRateFittings
      },
      () => {
        didSelectedFitting({ ...newRateFittings })
      }
    )
  }

  render() {
    const { issues } = this.props
    return (
      <View style={styles.styleButtonView}>
        <Text style={styles.titleText}>尺码问题</Text>
        <View style={styles.contentView}>
          {issues.follow_ups.map((item, i) => {
            let findIndex = item.possible_answers.findIndex(function(i) {
              return i.value === 'fit'
            })
            let possible_answers = item.possible_answers.slice()
            possible_answers.splice(findIndex, 1)
            return (
              <View style={styles.buttonView} key={i}>
                <Text style={styles.buttonViewTitle}>
                  {l10nForRatingKey(item.rating_key)}
                </Text>
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
                      />
                    )
                  })}
                </View>
              </View>
            )
          })}
        </View>
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
  contentView: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  titleText: {
    fontSize: 14,
    color: '#333',
    marginVertical: p2d(16),
    fontWeight: '600'
  },
  buttonView: {
    flexDirection: 'row',
    marginBottom: p2d(12),
    alignItems: 'center'
  },
  buttonViewTitle: {
    fontSize: 14,
    color: '#333',
    marginRight: p2d(8)
  },
  buttonsBox: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  button: {
    borderRadius: 100,
    paddingVertical: p2d(7),
    paddingHorizontal: p2d(16),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: p2d(8)
  },
  buttonText: {
    fontSize: 12
  },
  likeButton: {
    backgroundColor: '#FDEDE9',
    borderWidth: 0.5,
    borderColor: '#E85C40'
  },
  likeButtonText: {
    color: '#E85C40'
  },
  unLikeButton: {
    borderColor: '#ccc',
    borderWidth: 0.5
  },
  unLikeButtonText: {
    color: '#5e5e5e'
  }
})
