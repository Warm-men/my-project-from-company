/* @flow */

import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Row from './row'

export default class FitContainer extends PureComponent {
  constructor(props) {
    super(props)
    const { questions } = this.props.data
    const main = questions.find(item => item.key === 'fit')
    this.questions = questions.filter(item => item.key !== 'fit')

    this.state = { main, fit: null, input: {} }
  }

  _didSelectedFitStatus = (key, item) => {
    const fit = item.value
    const object = { fit }
    if (fit === 'true') {
      object.input = {}
    }
    this.setState(object, () => {
      const { updateFitting } = this.props
      updateFitting && updateFitting(fit, this.state.input)
    })
  }

  _didSelectedItem = (key, item) => {
    const input = { ...this.state.input }
    input[key] = item.value
    if (
      (input.bust !== 'loose' || input.waist !== 'loose') &&
      input.loose_reason
    ) {
      delete input.loose_reason
    }
    this.setState({ input }, () => {
      const { updateFitting } = this.props
      updateFitting && updateFitting(this.state.fit, input)
    })
  }

  render() {
    const { ratingLooseReasonDisplay } = this.props
    const { main, fit, input } = this.state
    if (!main) return null
    return (
      <View style={styles.container}>
        <Row
          data={main}
          onPress={this._didSelectedFitStatus}
          value={fit ? [fit] : []}
        />
        {fit === 'false' && (
          <View>
            <Text style={styles.description}>{'不合身的地方'}</Text>
            {this.questions.map((item, index) => {
              const value = input[item.key]
              return (
                <Row
                  isSubQuestion
                  data={item}
                  key={index}
                  value={value ? [value] : []}
                  onPress={this._didSelectedItem}
                />
              )
            })}
            {input &&
              input.bust === 'loose' &&
              input.waist === 'loose' &&
              ratingLooseReasonDisplay &&
              ratingLooseReasonDisplay.allow_display && (
                <View style={styles.tipsView}>
                  <Text style={styles.tipsText}>
                    {ratingLooseReasonDisplay.question}
                  </Text>
                  <View style={styles.tipButtonsView}>
                    {ratingLooseReasonDisplay.answers.map((item, index) => {
                      const value = input['loose_reason']
                      return (
                        <Button
                          data={item}
                          key={index}
                          onPress={this._didSelectedItem}
                          value={value}
                        />
                      )
                    })}
                  </View>
                </View>
              )}
          </View>
        )}
      </View>
    )
  }
}

class Button extends PureComponent {
  setValue = () => {
    const { onPress, data } = this.props
    onPress && onPress('loose_reason', data)
  }

  render() {
    const { data, value } = this.props
    const isSelect = value === data.value
    return (
      <TouchableOpacity
        style={[styles.tipsButton, isSelect && styles.selectTipsButton]}
        onPress={this.setValue}>
        <Text
          style={[
            styles.tipsButtonText,
            isSelect && styles.selectTipsButtonText
          ]}>
          {data.display}
        </Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: { marginTop: 25, marginBottom: 10 },
  description: { fontSize: 14, color: '#989898', marginBottom: 16 },
  tipsView: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    height: 102,
    padding: 20
  },
  tipsText: {
    marginTop: 8,
    fontSize: 12,
    color: '#5e5e5e'
  },
  tipButtonsView: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  tipsButton: {
    width: 145,
    height: 26,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCCCCC'
  },
  selectTipsButton: {
    backgroundColor: '#FFF5F4',
    borderColor: '#E85C40'
  },
  tipsButtonText: {
    fontSize: 12,
    color: '#5e5e5e'
  },
  selectTipsButtonText: {
    color: '#E85C40'
  }
})
