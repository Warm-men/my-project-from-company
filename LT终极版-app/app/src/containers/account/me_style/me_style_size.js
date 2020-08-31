import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  DeviceEventEmitter
} from 'react-native'
import { inject, observer } from 'mobx-react'
import { SafeAreaView } from '../../../../storybook/stories/navigationbar'
import SelectComponent from '../../../../storybook/stories/account/select_component'
import {
  BUST_SIZE,
  HEIGHTARRAY,
  WEIGHTARRAY
} from '../../../expand/tool/size/size'
import BottomButton from './me_style_bottom_button'
import MeStyleCommonTitle from '../../../../storybook/stories/account/me_style_common_title'

@inject('currentCustomerStore')
@observer
export default class MeStyleSize extends Component {
  // 通过 state 更新
  constructor(props) {
    super(props)
    const {
      height_inches,
      weight,
      bra_size,
      cup_size
    } = this.props.currentCustomerStore.style
    this.state = {
      heightInches: height_inches ? [height_inches] : [],
      weight: weight ? [weight] : [],
      bust: bra_size && cup_size ? [bra_size, cup_size] : [],
      isDone: false
    }
    this.heightArray = HEIGHTARRAY()
    this.weightArray = WEIGHTARRAY()
    this.bustArray = BUST_SIZE
  }

  UNSAFE_componentWillMount() {
    this.isDone()
  }

  isDone = () => {
    if (
      !this.state.heightInches.length ||
      !this.state.weight.length ||
      !this.state.bust.length
    ) {
      this.setState({
        isDone: false
      })
      return
    }
    this.setState({
      isDone: true
    })
  }

  _onPress = value => {
    let state = {}
    let values = value.data
    state[value.dataType] = values
    this.setState(state, () => {
      this.isDone()
    })
  }

  _updateStyle = () => {
    const {
      height_inches,
      weight,
      bra_size,
      cup_size
    } = this.props.currentCustomerStore.style
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
      this.props.updateStyle(style)
    }
    DeviceEventEmitter.emit('onRefreshSize', { style: style })
  }

  _next = () => {
    if (!this.state.isDone) {
      return
    }
    if (!this.isFinishedUpdate) {
      this.isFinishedUpdate = true
      this._updateStyle()
    }
    setTimeout(() => {
      this.isFinishedUpdate = false
    }, 300)
    this.props.next()
  }

  render() {
    return (
      <SafeAreaView>
        <ScrollView
          style={styles.container}
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}>
          <MeStyleCommonTitle
            titleText={'合身-基础档案'}
            descriptText={'我们会手工测量每一件衣服，为你计算匹配'}
            step={'4/6'}
            showStep={true}
          />
          <View style={styles.contentView}>
            <SelectComponent
              title={'身高'}
              pickerTitleText={'选择身高'}
              dataType={'heightInches'}
              selectedValue={
                !!this.state.heightInches.length
                  ? this.state.heightInches
                  : [160]
              }
              onPress={this._onPress}
              pickerData={this.heightArray}
              value={this.state.heightInches}
              showPicker={true}
              isLongPickerType={true}
            />
            <SelectComponent
              title={'体重'}
              pickerTitleText={'选择体重'}
              dataType={'weight'}
              selectedValue={
                !!this.state.weight.length ? this.state.weight : [46]
              }
              onPress={this._onPress}
              pickerData={this.weightArray}
              value={this.state.weight}
              showPicker={true}
              isLongPickerType={true}
            />
            <SelectComponent
              title={'胸围'}
              dataType={'bust'}
              pickerTitleText={'选择胸围'}
              selectedValue={
                !!this.state.bust.length ? this.state.bust : ['75', 'B']
              }
              onPress={this._onPress}
              pickerData={this.bustArray}
              value={this.state.bust}
              showPicker={true}
              isLongPickerType={true}
            />
          </View>
        </ScrollView>
        <BottomButton
          goback={this.props.goback}
          next={this._next}
          isDone={this.state.isDone}
          nextText={'下一步'}
        />
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 20,
    width: Dimensions.get('window').width,
    paddingHorizontal: 40
  },
  contentView: {
    marginTop: 76,
    alignItems: 'center',
    width: '100%'
  }
})
