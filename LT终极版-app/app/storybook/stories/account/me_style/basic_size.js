import React, { PureComponent } from 'react'
import { View, StyleSheet, DeviceEventEmitter } from 'react-native'
import { inject, observer } from 'mobx-react'
import {
  BUST_SIZE,
  HEIGHTARRAY,
  WEIGHTARRAY
} from '../../../../src/expand/tool/size/size'
import SelectButton from './select_button'

export default class BasicSize extends PureComponent {
  // 通过 state 更新
  constructor(props) {
    super(props)
    const { height_inches, weight, bra_size, cup_size } = props.style
    this.state = {
      heightInches: height_inches ? [height_inches] : [],
      weight: weight ? [weight] : [],
      bust: bra_size && cup_size ? [bra_size, cup_size] : [],
      isDone: false
    }
    this.heightArray = HEIGHTARRAY()
    this.weightArray = WEIGHTARRAY()
  }

  isDone = () => {
    if (
      !this.state.heightInches.length ||
      !this.state.weight.length ||
      !this.state.bust.length
    ) {
      return false
    }
    return true
  }

  _onPress = value => {
    let state = {}
    let values = value.data
    state[value.dataType] = values
    this.setState(state)
  }

  updateData = updateStyle => {
    if (!this.isDone()) {
      return false
    }
    const { height_inches, weight, bra_size, cup_size } = this.props.style
    const newHeightInches = parseInt(this.state.heightInches)
    const newWeight = parseInt(this.state.weight)
    const newBraSize = parseInt(this.state.bust[0])
    const newCupSize = this.state.bust[1]
    const style = {
      height_inches: newHeightInches,
      weight: newWeight,
      bra_size: newBraSize,
      cup_size: newCupSize
    }
    if (
      newHeightInches !== height_inches ||
      newWeight !== weight ||
      newBraSize !== bra_size ||
      newCupSize !== cup_size
    ) {
      updateStyle(style)
    }
    DeviceEventEmitter.emit('onRefreshSize', { style: style })
    return true
  }

  render() {
    return (
      <View style={styles.contentView}>
        <SelectButton
          title={'你的身高'}
          pickerTitleText={'选择身高'}
          dataType={'heightInches'}
          placeholder={'你的身高'}
          selectedValue={
            !!this.state.heightInches.length ? this.state.heightInches : [160]
          }
          onPress={this._onPress}
          pickerData={this.heightArray}
          value={this.state.heightInches}
          showPicker={true}
          isLongPickerType={true}
        />
        <SelectButton
          title={'你的体重'}
          pickerTitleText={'选择体重'}
          placeholder={'你的体重'}
          dataType={'weight'}
          selectedValue={!!this.state.weight.length ? this.state.weight : [46]}
          onPress={this._onPress}
          pickerData={this.weightArray}
          value={this.state.weight}
          showPicker={true}
          isLongPickerType={true}
        />
        <SelectButton
          title={'你的胸围'}
          dataType={'bust'}
          pickerTitleText={'你的胸围'}
          placeholder={'你的胸围'}
          selectedValue={
            !!this.state.bust.length ? this.state.bust : ['75', 'B']
          }
          onPress={this._onPress}
          pickerData={BUST_SIZE}
          value={this.state.bust}
          showPicker={true}
          isLongPickerType={true}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  contentView: {
    marginTop: 76,
    alignItems: 'center',
    flex: 1
  }
})
