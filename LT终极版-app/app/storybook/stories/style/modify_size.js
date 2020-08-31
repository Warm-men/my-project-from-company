/* @flow */

import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Text
} from 'react-native'
import { inject, observer } from 'mobx-react'
import Image from '../image'
import { SizePicker, SizeCard } from './modify_size_card'
import p2d from '../../../src/expand/tool/p2d'
import { NavigationBar, SafeAreaView, BarButtonItem } from '../navigationbar'
import { SHAPELARGE } from '../../../src/expand/tool/size/size'
@inject('currentCustomerStore')
@observer
export default class ModifySizeContainer extends Component {
  _getBodyTypePosition = shape => {
    let bodyTypePosition
    shape
      ? SHAPELARGE.map((item, index) => {
          SHAPELARGE[index].type === shape ? (bodyTypePosition = index) : null
        })
      : (bodyTypePosition = null)
    return bodyTypePosition
  }

  render() {
    const {
      confirmButtonText,
      title,
      description,
      currentCustomerStore,
      isReceivedRule,
      showFadeLayer,
      toggleFadeLayer,
      goBack,
      singlePage,
      updateCurrentSize,
      openProductsSizeFilter,
      heightArr,
      weightArr,
      heightInches,
      weight,
      changeMySize,
      nextStep
    } = this.props
    const { style } = currentCustomerStore
    const hasCompleteSizes = currentCustomerStore.hasCompleteSizes({
      height_inches: heightInches,
      weight: weight
    })
    const bodyTypePosition = this._getBodyTypePosition(style.shape)
    const disabled = !isReceivedRule
    return (
      <SafeAreaView style={styles.safeAreaView}>
        {showFadeLayer && (
          <TouchableOpacity
            onPress={toggleFadeLayer}
            style={styles.fadeLayer}
          />
        )}
        <NavigationBar
          hasBottomLine={false}
          leftBarButtonItem={
            <BarButtonItem onPress={goBack} buttonType={'back'} />
          }
        />
        <ScrollView alwaysBounceVertical={false}>
          {singlePage ? (
            <View style={styles.tipsView}>
              <Text style={styles.tipsText}>
                <Text style={styles.tipsRedText}>{'*'}</Text>
                {'Tips:身高、体重、胸围为必填项'}
              </Text>
            </View>
          ) : (
            <View>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.desc}>{description}</Text>
            </View>
          )}
          <View style={styles.wrappedView}>
            <View style={styles.bodyTypeContainer}>
              <Image
                source={
                  bodyTypePosition
                    ? SHAPELARGE[bodyTypePosition].image
                    : SHAPELARGE[0].image
                }
                style={styles.bodyImage}
                resizeMode="cover"
              />
            </View>
            <View>
              <View style={styles.itemView}>
                <SizePicker
                  title={'身高'}
                  pickerTitleText={'选择身高'}
                  dataType={'height_inches'}
                  selectedValue={
                    heightInches ? [parseInt(heightInches)] : [160]
                  }
                  toggleFadeLayer={toggleFadeLayer}
                  onPress={updateCurrentSize}
                  pickerData={heightArr}
                  value={heightInches}
                />
              </View>
              <View style={styles.itemView}>
                <SizePicker
                  title={'体重'}
                  pickerTitleText={'选择体重'}
                  dataType={'weight'}
                  selectedValue={weight ? [parseInt(weight)] : [46]}
                  toggleFadeLayer={toggleFadeLayer}
                  onPress={updateCurrentSize}
                  pickerData={weightArr}
                  value={weight}
                />
              </View>
              <View style={styles.itemView}>
                <SizeCard
                  title={'体型'}
                  dataType={'shape'}
                  onPress={changeMySize}
                  value={
                    bodyTypePosition || bodyTypePosition === 0
                      ? SHAPELARGE[bodyTypePosition].title
                      : null
                  }
                />
              </View>
              <View style={styles.itemView}>
                <SizeCard
                  title={'肩宽'}
                  dataType={'shoulder_size'}
                  onPress={changeMySize}
                  value={style.shoulder_size}
                  disabled={disabled}
                />
              </View>
              <View style={styles.itemView}>
                <SizeCard
                  title={'上胸围'}
                  dataType={'bust_size_number'}
                  onPress={changeMySize}
                  value={style.bust_size_number}
                  disabled={disabled}
                />
              </View>
              <View style={styles.itemView}>
                <SizeCard
                  title={'腰围'}
                  dataType={'waist_size'}
                  onPress={changeMySize}
                  value={style.waist_size}
                  disabled={disabled}
                />
              </View>
              <View style={styles.itemView}>
                <SizeCard
                  title={'臀围'}
                  dataType={'hip_size_inches'}
                  onPress={changeMySize}
                  value={style.hip_size_inches}
                  disabled={disabled}
                />
              </View>
              <View style={styles.itemView}>
                <SizeCard
                  title={'内腿长'}
                  dataType={'inseam'}
                  onPress={changeMySize}
                  value={style.inseam}
                  disabled={disabled}
                />
              </View>
            </View>
          </View>
        </ScrollView>
        {disabled && (
          <View style={styles.ruleTipsView}>
            <Text style={styles.ruleTipsText}>
              *首个衣箱会赠送卷尺，请使用卷尺测量个人身材数据
            </Text>
          </View>
        )}
        <TouchableOpacity
          style={[
            styles.doneButton,
            openProductsSizeFilter && !hasCompleteSizes && styles.buttonOff
          ]}
          onPress={nextStep}>
          <Text style={styles.nextText}>{confirmButtonText}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    width: Dimensions.get('window').width
  },
  bodyImage: {
    width: p2d(121),
    height: p2d(352)
  },
  itemView: {
    height: p2d(44)
  },
  doneButton: {
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 10,
    height: 45,
    backgroundColor: '#EA5C39',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2
  },
  nextText: {
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: 0
  },
  title: {
    marginTop: p2d(16),
    marginLeft: p2d(40),
    fontSize: 20,
    color: '#333333',
    fontWeight: '600'
  },
  desc: {
    marginTop: 16,
    marginLeft: 40,
    fontSize: p2d(14),
    color: '#999',
    lineHeight: p2d(24)
  },
  modifyButton: {
    fontSize: 12,
    borderWidth: 1,
    padding: 5,
    borderRadius: 13,
    paddingHorizontal: 8,
    alignSelf: 'center',
    marginTop: p2d(13),
    color: '#666666',
    borderColor: '#666666'
  },
  modifyingButton: {
    fontSize: 12,
    borderWidth: 1,
    padding: 5,
    borderRadius: 13,
    paddingHorizontal: 8,
    alignSelf: 'center',
    marginTop: p2d(13),
    color: '#EA5C39',
    borderColor: '#EA5C39'
  },
  bodyTypeContainer: {
    marginRight: p2d(40)
  },
  tipsView: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginTop: 20,
    marginBottom: 20
  },
  tipsText: {
    fontSize: 12,
    color: '#333'
  },
  tipsRedText: {
    color: '#EA5C39'
  },
  fadeLayer: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    zIndex: 1
  },
  wrappedView: {
    flexDirection: 'row',
    flex: 1,
    paddingTop: p2d(33),
    justifyContent: 'center'
  },
  buttonOff: {
    backgroundColor: '#CCCCCC'
  },
  ruleTipsView: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    backgroundColor: '#FFF5F4',
    width: p2d(345),
    alignSelf: 'center',
    borderRadius: 4
  },
  ruleTipsText: {
    fontSize: 12,
    color: '#5e5e5e'
  }
})
