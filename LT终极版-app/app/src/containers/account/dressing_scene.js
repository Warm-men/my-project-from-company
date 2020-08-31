import React from 'react'
import AuthenticationComponent from '../../components/authentication'
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text
} from 'react-native'
import Image from '../../../storybook/stories/image.js'
import SceneButtonList from '../../../storybook/stories/account/scene_button'
import { SERVICE_TYPES, Mutate, QNetwork } from '../../expand/services/services'
import {
  NavigationBar,
  SafeAreaView,
  BarButtonItem
} from '../../../storybook/stories/navigationbar'
import { inject, observer } from 'mobx-react'
import p2d from '../../expand/tool/p2d'
@inject('currentCustomerStore')
@observer
export default class SceneContainer extends AuthenticationComponent {
  onSignIn() {
    this._getMyStyle()
  }
  constructor(props) {
    super(props)
    const {
      work_focus,
      weekend_focus,
      social_focus
    } = props.currentCustomerStore.style
    this.state = {
      work_focus: work_focus ? work_focus : null,
      weekend_focus: weekend_focus ? weekend_focus : null,
      social_focus: social_focus ? social_focus : null,
      isDone: false
    }
    this.isCommitting = false
  }

  UNSAFE_componentWillMount() {
    this._getMyStyle()
  }

  _isDone = () => {
    const {
      work_focus,
      weekend_focus,
      social_focus
    } = this.props.currentCustomerStore.style
    if (
      (work_focus !== this.state.work_focus ||
        weekend_focus !== this.state.weekend_focus ||
        social_focus !== this.state.social_focus) &&
      (this.state.work_focus !== null ||
        this.state.weekend_focus !== null ||
        this.state.social_focus !== null)
    ) {
      this.setState({
        isDone: true
      })
      return
    } else {
      this.setState({
        isDone: false
      })
    }
  }
  _getMyStyle = () => {
    QNetwork(SERVICE_TYPES.me.QUERY_MY_STYLE, {}, response => {
      this.props.currentCustomerStore.updateStyle(response.data.me.style)
      this._isDone()
    })
  }

  sceneCallBack = value => {
    if (this.isCommitting) {
      return
    }
    let state = {}
    let values = value.value
    state[value.dataType] = values
    this.setState(state, () => {
      this._isDone()
    })
  }

  _goBack = () => {
    this.props.navigation.goBack()
  }

  _signInCustomer = () => {
    this.props.currentCustomerStore.setLoginModalVisible(true)
  }

  _onPress = () => {
    const { currentCustomerStore } = this.props
    if (!currentCustomerStore.id) {
      this._signInCustomer()
      return
    }
    this.isCommitting = true
    let input = {
      work_focus: parseInt(this.state.work_focus),
      weekend_focus: parseInt(this.state.weekend_focus),
      social_focus: parseInt(this.state.social_focus)
    }
    Mutate(
      SERVICE_TYPES.me.MUTAITON_UPDATE_STYLE,
      { input },
      response => {
        response &&
          this.props.currentCustomerStore.updateStyle(
            response.data.UpdateStyle.style
          )
        this.props.navigation.goBack()
      },
      () => {
        this.isCommitting = false
        // FIXME: 错误处理
      }
    )
  }
  render() {
    const { style } = this.props.currentCustomerStore
    const { state } = this
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <NavigationBar
          style={styles.navigationBar}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <ScrollView alwaysBounceVertical={false}>
          <View style={styles.titleView}>
            <Text style={styles.titleText}>{'穿着场合'}</Text>
            <Text style={styles.titleDiscrept}>{'注重场合是魅力的起点'}</Text>
          </View>
          <View style={styles.contentView}>
            <View style={styles.sceneItemView}>
              <Image
                source={require('../../../assets/images/account/icon_work-business.png')}
                style={styles.sceneItemImage}
                resizeMode={'cover'}
              />
              <Text style={styles.sceneItemText}>{'商务休闲'}</Text>
              <SceneButtonList
                dataType={'work_focus'}
                value={
                  state.work_focus !== null
                    ? state.work_focus
                    : style && style.work_focus !== null
                    ? style.work_focus
                    : null
                }
                sceneChange={this.sceneCallBack}
              />
            </View>
            <View style={styles.sceneItemView}>
              <Image
                source={require('../../../assets/images/account/icon_weekend-casual.png')}
                style={styles.sceneItemImage}
                resizeMode={'cover'}
              />
              <Text style={styles.sceneItemText}>{'周末时光'}</Text>
              <SceneButtonList
                dataType={'weekend_focus'}
                value={
                  state.weekend_focus !== null
                    ? state.weekend_focus
                    : style && style.weekend_focus !== null
                    ? style.weekend_focus
                    : null
                }
                sceneChange={this.sceneCallBack}
              />
            </View>
            <View style={styles.sceneItemView}>
              <Image
                source={require('../../../assets/images/account/icon_date-night.png')}
                style={styles.sceneItemImage}
                resizeMode={'cover'}
              />
              <Text style={styles.sceneItemText}>{'晚会活动'}</Text>
              <SceneButtonList
                dataType={'social_focus'}
                value={
                  state.social_focus !== null
                    ? state.social_focus
                    : style && style.social_focus !== null
                    ? style.social_focus
                    : null
                }
                sceneChange={this.sceneCallBack}
              />
            </View>
          </View>
        </ScrollView>
        <TouchableOpacity
          style={[
            styles.button,
            state.isDone
              ? { backgroundColor: '#EA5C39' }
              : { backgroundColor: '#F8CFC4' }
          ]}
          onPress={this._onPress}>
          <Text style={styles.saveText}>{'保存'}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1
  },
  button: {
    height: 45,
    width: p2d(345),
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#EA5C39',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  navigationBar: {
    borderBottomWidth: 0
  },
  titleView: {
    marginTop: 17,
    marginLeft: 40,
    marginBottom: 20
  },
  titleText: {
    fontSize: 20,
    color: '#333333',
    marginBottom: 16
  },
  titleDiscrept: {
    fontSize: 14,
    color: '#999999',
    lineHeight: 26
  },
  contentView: {
    flex: 1,
    alignItems: 'center'
  },
  sceneItemView: {
    alignItems: 'center',
    marginBottom: 32,
    flex: 1
  },
  sceneItemImage: {
    marginBottom: 12
  },
  sceneItemText: {
    marginBottom: 12,
    fontSize: 12,
    color: '#333333'
  },
  backButton: {
    marginLeft: 20
  },
  saveText: {
    fontSize: 14,
    color: '#FFFFFF'
  }
})
