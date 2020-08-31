import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text
} from 'react-native'
import Icons from 'react-native-vector-icons/Entypo'
import SelectComponent from '../../../storybook/stories/account/select_component'
import { SERVICE_TYPES, Mutate } from '../../expand/services/services'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'
import {
  BUST_SIZE,
  HEIGHTARRAY,
  WEIGHTARRAY,
  DRESS_SIZES,
  TOP_SIZES_ABBR
} from '../../expand/tool/size/size'
import { inject, observer } from 'mobx-react'
import { calSize } from '../../expand/tool/size/calSize'
import p2d from '../../expand/tool/p2d'
import { CustomAlertView } from '../../../storybook/stories/alert/custom_alert_view'
import MeStyleCommonTitle from '../../../storybook/stories/account/me_style_common_title'
import Picker from 'react-native-letote-picker'

@inject('currentCustomerStore', 'modalStore')
@observer
export default class BasicSizeContainer extends Component {
  constructor(props) {
    super(props)
    const {
      height_inches,
      weight,
      bra_size,
      cup_size
    } = this.props.currentCustomerStore.style

    this.state = {
      height_inches: height_inches ? height_inches : null,
      weight: weight ? weight : null,
      bust: bra_size && cup_size ? [bra_size, cup_size] : null
    }
    this.isCommitting = false
    this.heightArr = HEIGHTARRAY()
    this.weightArr = WEIGHTARRAY()
    this.dress_size, this.top_size
  }

  componentWillUnmount() {
    const { params } = this.props.navigation.state
    const onRefreshSizeChart = params && params.onRefreshSizeChart
    this.isUpdatedStyle && onRefreshSizeChart && onRefreshSizeChart()
  }

  _updateRecommendedSize = () => {
    // FIXME: sizer 接口其实不满足需求， 有个 query 的 realtime_product_recommended_size(product_id: ID!): Size 接口，这个接口是获取product 推荐尺码的。推荐尺码更新计算有延迟，跟孙宇讨论过，我后面考虑把realtime_product_recommended_size合并到product 接口请求时同时请求，

    Mutate(
      SERVICE_TYPES.totes.MUTATION_TOTE_QUEUE_PRODUCT_SIZER,
      { input: {} },
      () => {
        this.props.navigation.goBack()
        // FIXME: 更新详情页面
      },
      () => {
        this.isCommitting = false
      }
    )
  }

  _didSelectedPickerItem = value => {
    if (this.isCommitting) {
      return
    }
    let state = {}
    let values = value.data
    state[value.dataType] = values
    this.setState(state)
  }

  _realtimeRecommended = () => {
    if (!this.state.bust || !this.state.height_inches || !this.state.weight) {
      const { modalStore } = this.props
      modalStore.show(
        <CustomAlertView
          message={'请先填写身高，体重，胸围'}
          cancel={{ title: '好' }}
        />
      )
      return
    }
    const {
      height_inches,
      weight,
      bra_size,
      cup_size,
      top_size,
      dress_size
    } = this.props.currentCustomerStore.style
    if (
      this.state.height_inches !== height_inches ||
      this.state.weight !== weight ||
      this.state.bust[0] !== bra_size ||
      this.state.bust[1] !== cup_size
    ) {
      let size = calSize(this.state.height_inches, this.state.weight * 2, 3)
      if (!dress_size) {
        DRESS_SIZES.map(item => {
          if (item.name === size) {
            this.dress_size = item.type
          }
        })
      }
      if (!top_size) {
        TOP_SIZES_ABBR.map(item => {
          if (item.name === size) {
            this.top_size = item.type
          }
        })
      }
      this.isCommitting = true
      let input = {
        height_inches: parseInt(this.state.height_inches),
        weight: parseInt(this.state.weight),
        bra_size: parseInt(this.state.bust[0]),
        cup_size: this.state.bust[1],
        rescheduled_product_sizer: true
      }
      if (this.top_size) {
        input.top_size = this.top_size
      }
      if (this.dress_size) {
        input.dress_size = this.dress_size
      }
      Mutate(
        SERVICE_TYPES.me.MUTAITON_UPDATE_STYLE,
        { input },
        response => {
          this.isUpdatedStyle = true
          response &&
            this.props.currentCustomerStore.updateStyle(
              response.data.UpdateStyle.style
            )
          this._updateRecommendedSize()
        },
        () => {
          this.isCommitting = false
        }
      )
    } else {
      this._updateRecommendedSize()
    }
  }

  _goBack = () => {
    this.props.navigation.goBack()
  }

  //跳转尺码管理页面
  _goStyle = () => {
    const { height_inches, weight } = this.state
    this.props.navigation.navigate('OnlyStyle', {
      singlePage: true,
      height_inches,
      weight
    })
  }

  _hiddenPicker = () => {
    Picker.hide()
  }

  render() {
    const { params } = this.props.navigation.state
    const isRecommend = params && params.isRecommend
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <NavigationBar
          style={styles.navigationBar}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <ScrollView onScrollEndDrag={this._hiddenPicker}>
          <MeStyleCommonTitle
            style={styles.titleView}
            titleText={'尺码'}
            descriptText={
              '我们始终坚持手工测量每件衣服，只需提供尺码信息，托特衣箱就能为你推荐最合身的尺码'
            }
            showStep={false}
          />

          <View style={styles.itemView}>
            <SelectComponent
              title={'身高'}
              pickerTitleText={'选择身高'}
              dataType={'height_inches'}
              selectedValue={
                this.state.height_inches
                  ? [parseInt(this.state.height_inches)]
                  : ['160']
              }
              onPress={this._didSelectedPickerItem}
              pickerData={this.heightArr}
              value={this.state.height_inches ? [this.state.height_inches] : []}
              showPicker={true}
              isLongPickerType={true}
            />
          </View>
          <View style={styles.itemView}>
            <SelectComponent
              title={'体重'}
              pickerTitleText={'选择体重'}
              dataType={'weight'}
              selectedValue={
                this.state.weight ? [parseInt(this.state.weight)] : ['46']
              }
              onPress={this._didSelectedPickerItem}
              pickerData={this.weightArr}
              value={this.state.weight ? [this.state.weight] : []}
              showPicker={true}
              isLongPickerType={true}
            />
          </View>
          <View style={styles.itemView}>
            <SelectComponent
              title={'胸围'}
              pickerTitleText={'选择胸围'}
              dataType={'bust'}
              selectedValue={this.state.bust ? this.state.bust : ['75', 'B']}
              onPress={this._didSelectedPickerItem}
              pickerData={BUST_SIZE}
              value={this.state.bust}
              showPicker={true}
              isLongPickerType={true}
            />
          </View>
          <TouchableOpacity style={styles.moreButton} onPress={this._goStyle}>
            <Text style={styles.moreButtonText}>{'填写更多个人数据'}</Text>
            <Icons
              name={'chevron-small-right'}
              style={styles.iconStyle}
              size={20}
              color={'#666'}
            />
          </TouchableOpacity>
        </ScrollView>
        <TouchableOpacity
          style={styles.doneButton}
          onPress={this._realtimeRecommended}>
          <Text style={styles.nextText}>
            {isRecommend ? '立即推荐' : '保存'}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1
  },
  navigationBar: {
    borderBottomWidth: 0,
    marginBottom: 32
  },

  itemView: {
    alignItems: 'center',
    paddingHorizontal: 40
  },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  moreButtonText: {
    fontSize: 11,
    color: '#5E5E5E',
    fontWeight: '400'
  },
  doneButton: {
    height: 45,
    width: p2d(345),
    backgroundColor: '#EA5C39',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    alignSelf: 'center'
  },
  nextText: {
    fontSize: 14,
    color: '#FFF',
    letterSpacing: 0
  },
  titleView: {
    marginTop: 0,
    marginBottom: p2d(60),
    paddingHorizontal: p2d(40)
  },
  iconStyle: {
    marginTop: 2
  }
})
