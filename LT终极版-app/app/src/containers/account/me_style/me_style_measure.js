import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  DeviceEventEmitter,
  Text
} from 'react-native'
import { inject, observer } from 'mobx-react'
import { SafeAreaView } from '../../../../storybook/stories/navigationbar'
import SelectComponent from '../../../../storybook/stories/account/select_component'
import { SHAPEBIG } from '../../../expand/tool/size/size'
import BottomButton from './me_style_bottom_button'
import p2d from '../../../expand/tool/p2d'
import ImageView from '../../../../storybook/stories/image'
import MeStyleCommonTitle from '../../../../storybook/stories/account/me_style_common_title'
@inject('currentCustomerStore')
@observer
export default class MeStyleMeasure extends Component {
  _updateStyle = () => {
    const { style } = this.props.currentCustomerStore
    DeviceEventEmitter.emit('onRefreshSize', { style })
  }

  _next = () => {
    if (!this.isFinishedUpdate) {
      this.isFinishedUpdate = true
      this._updateStyle()
    }
    setTimeout(() => {
      this.isFinishedUpdate = false
    }, 300)
    this.props.next()
  }

  _updateCurrentSize = type => {
    const { navigation, currentCustomerStore } = this.props
    const { height_inches, weight } = currentCustomerStore.style
    navigation.navigate('EditSize', { type, height_inches, weight })
  }

  render() {
    const { style } = this.props.currentCustomerStore
    const shapeTypeIndex = SHAPEBIG.findIndex(item => {
      if (!!style.shape) {
        return item.type === style.shape
      } else {
        return item.type === 'Hourglass'
      }
    })
    const shapeImage =
      shapeTypeIndex !== -1 ? SHAPEBIG[shapeTypeIndex].image : SHAPEBIG[3].image

    return (
      <SafeAreaView>
        <ScrollView
          style={styles.container}
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}>
          <MeStyleCommonTitle
            titleText={'合身-测量档案'}
            descriptText={'更准确的测量，可以让你不必再为挑选尺码而烦心'}
            step={'5/7'}
            showStep={true}
          />
          <View style={styles.contentView}>
            <View style={styles.contentLeft}>
              <ImageView source={shapeImage} style={styles.shapeImage} />
            </View>
            <View style={styles.contentRight}>
              <SelectComponent
                title={'肩宽'}
                dataType={'shoulder_size'}
                selectedValue={style.shoulder_size ? style.shoulder_size : 40}
                onPress={this._updateCurrentSize}
                value={style.shoulder_size}
                isLongPickerType={false}
              />
              <SelectComponent
                title={'腰围'}
                dataType={'waist_size'}
                selectedValue={style.waist_size ? style.waist_size : 70}
                onPress={this._updateCurrentSize}
                value={style.waist_size}
                isLongPickerType={false}
              />
              <SelectComponent
                title={'臀围'}
                dataType={'hip_size_inches'}
                selectedValue={
                  style.hip_size_inches ? style.hip_size_inches : 80
                }
                onPress={this._updateCurrentSize}
                value={style.hip_size_inches}
                isLongPickerType={false}
              />
              <SelectComponent
                title={'内腿长'}
                dataType={'inseam'}
                selectedValue={style.inseam ? style.inseam : 70}
                onPress={this._updateCurrentSize}
                value={style.inseam}
                isLongPickerType={false}
              />
            </View>
          </View>
          <View style={styles.tipsView}>
            <Text style={styles.tipsText}>
              {'第一个衣箱会附赠精美卷尺，如果暂时不确定，可点击下一步跳过'}
            </Text>
          </View>
        </ScrollView>
        <BottomButton
          goback={this.props.goback}
          next={this._next}
          isDone={true}
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
    marginTop: 55,
    flexDirection: 'row'
  },
  contentLeft: {
    flex: 22
  },
  contentRight: {
    flex: 37,
    paddingTop: 10
  },
  shapeImage: {
    width: p2d(110),
    height: p2d(320)
  },
  tipsView: {
    marginTop: p2d(72),
    alignItems: 'center'
  },
  tipsText: {
    color: '#999999',
    fontSize: 11,
    marginBottom: 40
  }
})
