import React, { Component, PureComponent } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Text
} from 'react-native'
import { inject, observer } from 'mobx-react'
import {
  SafeAreaView,
  NavigationBar,
  BarButtonItem
} from '../../../../storybook/stories/navigationbar'
import { SHAPE } from '../../../expand/tool/size/size'
import { SERVICE_TYPES, Mutate } from '../../../expand/services/services'
import p2d from '../../../expand/tool/p2d'
import ImageView from '../../../../storybook/stories/image'
import BottomButton from './me_style_bottom_button'
import MeStyleCommonTitle from '../../../../storybook/stories/account/me_style_common_title'

@inject('currentCustomerStore', 'appStore')
@observer
export default class MeStyleShape extends Component {
  // 通过 state 更新
  constructor(props) {
    super(props)
    const { shape } = this.props.currentCustomerStore.style
    this.state = {
      selectedType: shape ? shape : null
    }
    this.isLoading = false
  }

  _updateStyle = () => {
    const { shape } = this.props.currentCustomerStore.style
    if (
      (!this.state.selectedType && !shape) ||
      (this.state.selectedType && this.state.selectedType !== shape)
    ) {
      const style = {
        shape: this.state.selectedType ? this.state.selectedType : 'Hourglass'
      }
      this.props.updateStyle(style)
    }
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

  _select = type => {
    if (this.isLoading === true) {
      return
    }
    this.setState({ selectedType: type })
  }

  _goBack = () => {
    this.props.navigation.goBack()
  }

  _updateCustomerStyle = () => {
    const { currentCustomerStore, navigation, appStore } = this.props
    if (!currentCustomerStore.id) {
      currentCustomerStore.setLoginModalVisible(true)
      return
    }
    if (!this.state.selectedType) {
      appStore.showToastWithOpacity('请选择身型')
      return
    }
    if (this.isLoading === true) {
      return
    }
    this.isLoading = true
    let input = {
      rescheduled_product_sizer: true,
      require_incentive: true,
      shape: this.state.selectedType ? this.state.selectedType : 'Hourglass'
    }
    Mutate(
      SERVICE_TYPES.me.MUTAITON_UPDATE_STYLE,
      { input },
      response => {
        this.isLoading = false
        const {
          style,
          incentive_url,
          incentive_granted
        } = response.data.UpdateStyle
        currentCustomerStore.updateStyle(style)

        if (incentive_granted && incentive_url) {
          const uri = incentive_url
          navigation.replace('WebPage', { uri, hideShareButton: true })
          return
        }
        this.sizeOrder()
      },
      () => {
        this.isLoading = false
      }
    )
  }

  sizeOrder = () => {
    const { currentCustomerStore, navigation } = this.props
    const {
      style: {
        waist_size,
        bust_size_number,
        hip_size_inches,
        height_inches,
        weight,
        shoulder_size,
        inseam,
        shoulder_size_skip,
        inseam_skip
      }
    } = currentCustomerStore
    if (!waist_size) {
      navigation.replace('EditSize', {
        type: 'waist_size',
        height_inches,
        weight
      })
      return
    }
    if (!bust_size_number) {
      navigation.replace('EditSize', {
        type: 'bust_size_number',
        height_inches,
        weight
      })
      return
    }
    if (!hip_size_inches) {
      navigation.replace('EditSize', {
        type: 'hip_size_inches',
        height_inches,
        weight
      })
      return
    }
    if (!shoulder_size && !shoulder_size_skip) {
      navigation.replace('EditSize', {
        type: 'shoulder_size',
        height_inches,
        weight
      })
      return
    }
    if (!inseam && !inseam_skip) {
      navigation.replace('EditSize', {
        type: 'inseam',
        height_inches,
        weight
      })
      return
    }
    navigation.goBack()
  }

  render() {
    const { navigation } = this.props
    const isModifyShape =
      navigation &&
      navigation.state.params &&
      navigation.state.params.isModifyShape
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          style={styles.container}
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}>
          {isModifyShape && (
            <NavigationBar
              hasBottomLine={false}
              leftBarButtonItem={
                <BarButtonItem onPress={this._goBack} buttonType={'back'} />
              }
            />
          )}
          <MeStyleCommonTitle
            titleText={'身型'}
            descriptText={'完美体型是一个传说，识对体型穿对衣才能让你更美'}
            style={styles.meStyleCommonTitle}
            step={'3/6'}
            showStep={!isModifyShape}
          />
          <View style={styles.shapeView}>
            {SHAPE.map((item, index) => {
              const isSelected = item.type === this.state.selectedType
              return (
                <ShapeItem
                  key={index}
                  item={item}
                  type={item.type}
                  isSelected={!!isSelected}
                  onSelect={this._select}
                />
              )
            })}
          </View>
          {/* //FIXME 身型查看帮助 暂时没有，不显示 */}
          {/* <View style={styles.imageHelpView}>
            <ImageView
              style={styles.helpImage}
              source={require('../../../../assets/images/me_style/help.png')}
            />
            <Text style={styles.helpText}>{'身型查看帮助'}</Text>
          </View> */}
          {!isModifyShape && (
            <View style={styles.tipView}>
              <Text style={styles.tipText}>
                {'如果暂时不确定，可点击下一步跳过 '}
              </Text>
            </View>
          )}
        </ScrollView>
        {isModifyShape ? (
          <View style={styles.buttonView}>
            <TouchableOpacity
              style={styles.doneButton}
              onPress={this._updateCustomerStyle}>
              <Text style={styles.saveButton}>{'保存'}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <BottomButton
            goback={this.props.goback}
            next={this._next}
            isDone={true}
            nextText={'下一步'}
          />
        )}
      </SafeAreaView>
    )
  }
}

export class ShapeItem extends PureComponent {
  _select = () => {
    const { type, onSelect } = this.props
    onSelect(type)
  }

  render() {
    const { item, isSelected } = this.props
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.shapeItem}
        onPress={this._select}>
        <ImageView source={item.image} />
        <View
          style={[
            styles.shapeTextView,
            isSelected && { backgroundColor: '#F2BE7D', borderWidth: 0 }
          ]}>
          <Text style={[styles.shapeText, isSelected && { color: '#fff' }]}>
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 20,
    width: Dimensions.get('window').width
  },
  meStyleCommonTitle: {
    marginHorizontal: 40
  },
  shapeItem: {
    width: p2d(98),
    height: p2d(190),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5
  },
  shapeView: {
    marginTop: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  shapeTextView: {
    borderWidth: 0.5,
    borderColor: '#ccc',
    width: 70,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18
  },
  shapeText: {
    fontSize: 13,
    color: '#666'
  },
  imageHelpView: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  helpText: {
    fontSize: 12,
    color: '#0076FF',
    marginLeft: 4
  },
  helpImage: {
    width: p2d(14),
    height: p2d(14)
  },
  tipView: {
    marginTop: 16,
    alignItems: 'center'
  },
  tipText: {
    fontSize: 11,
    color: '#999999'
  },

  buttonView: {
    height: 60,
    width: '100%',
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  doneButton: {
    height: 40,
    width: '100%',
    backgroundColor: '#EA5C39',
    alignItems: 'center',
    justifyContent: 'center'
  },
  saveButton: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600'
  }
})
