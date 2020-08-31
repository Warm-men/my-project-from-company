import React from 'react'
import AuthenticationComponent from '../../components/authentication'
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text
} from 'react-native'
import {
  NavigationBar,
  SafeAreaView,
  BarButtonItem
} from '../../../storybook/stories/navigationbar'
import UnlikeButtonList from '../../../storybook/stories/account/unlike_button'
import { inject, observer } from 'mobx-react'
import { SERVICE_TYPES, Mutate, QNetwork } from '../../expand/services/services'
import {
  CLOTHES,
  ORNAMENT,
  COLOR,
  PRINTING
} from '../../expand/tool/size/unlike'
import p2d from '../../expand/tool/p2d'
import _ from 'lodash'
@inject('currentCustomerStore')
@observer
export default class UnlikeContainer extends AuthenticationComponent {
  onSignIn() {
    this.getList()
  }
  constructor(props) {
    super(props)
    const {
      clothing_categories,
      accessory_categories,
      clothing_colors,
      prints
    } = this.props.currentCustomerStore
    this.state = {
      clothing_categories,
      accessory_categories,
      clothing_colors,
      prints,
      isDone: false
    }
    this.isCommitting = false
  }

  componentDidMount() {
    this.getList()
  }

  _isDone = () => {
    const {
      clothing_categories,
      accessory_categories,
      clothing_colors,
      prints
    } = this.props.currentCustomerStore
    let clothing_categories_xor = _.xor(
      clothing_categories,
      this.state.clothing_categories
    )
    let accessory_categories_xor = _.xor(
      accessory_categories,
      this.state.accessory_categories
    )
    let clothing_colors_xor = _.xor(clothing_colors, this.state.clothing_colors)
    let prints_xor = _.xor(prints, this.state.prints)

    if (
      clothing_categories_xor.length > 0 ||
      accessory_categories_xor.length > 0 ||
      clothing_colors_xor.length > 0 ||
      prints_xor.length > 0
    ) {
      this.setState({ isDone: true })
    } else {
      this.setState({ isDone: false })
    }
  }

  unlikeCallBack = value => {
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

  getList = () => {
    QNetwork(
      SERVICE_TYPES.me.QUERY_ME_CUSTOMER_PRODUCT_FILTERS,
      {},
      response => {
        if (response.data.me) {
          const { currentCustomerStore } = this.props
          const data = response.data.me.customer_product_filters
          currentCustomerStore.setCustomerProductFilters(data)
          this.setState({ ...data })
        }
      }
    )
  }

  _saveFilters = () => {
    if (!this.state.isDone) {
      return
    }
    const { currentCustomerStore } = this.props
    if (!currentCustomerStore.id) {
      this._signInCustomer()
      return
    }
    this.isCommitting = true
    const {
      clothing_categories,
      accessory_categories,
      clothing_colors,
      prints
    } = this.state
    let input = {
      filters: {
        clothing_categories,
        accessory_categories,
        clothing_colors,
        prints
      }
    }
    Mutate(
      SERVICE_TYPES.me.MUTAITON_UPDATE_PRODUCT_FILTER,
      { input },
      () => {
        this._goBack()
      },
      () => {
        this.isCommitting = false
      }
    )
  }
  _signInCustomer = () => {
    this.props.currentCustomerStore.setLoginModalVisible(true)
  }

  render() {
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <NavigationBar
          style={styles.navigationBar}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <ScrollView style={styles.container} alwaysBounceVertical={false}>
          <View style={styles.bannerView}>
            <Text
              style={[styles.blackText, { fontSize: 20, marginBottom: 16 }]}>
              不喜欢的搭配
            </Text>
            <Text style={[styles.grayText, { fontSize: 14 }]}>
              挑出不希望出现在你衣箱中的品类
            </Text>
          </View>
          <View style={styles.bottomMargin}>
            <Text style={[styles.blackText, { fontSize: 16, marginBottom: 8 }]}>
              衣服
            </Text>
            <Text style={[styles.grayText, { fontSize: 12, marginBottom: 16 }]}>
              不超过4类
            </Text>
            <UnlikeButtonList
              dataType={'clothing_categories'}
              value={this.state.clothing_categories}
              onPress={this.unlikeCallBack}
              array={CLOTHES}
              maxNumber={4}
            />
          </View>
          <View style={styles.bottomMargin}>
            <Text style={[styles.blackText, { fontSize: 16, marginBottom: 8 }]}>
              配饰
            </Text>
            <Text style={[styles.grayText, { fontSize: 12, marginBottom: 16 }]}>
              不超过3类
            </Text>
            <UnlikeButtonList
              dataType={'accessory_categories'}
              value={this.state.accessory_categories}
              onPress={this.unlikeCallBack}
              array={ORNAMENT}
              maxNumber={3}
            />
          </View>
          <View style={styles.bottomMargin}>
            <Text style={[styles.blackText, { fontSize: 16, marginBottom: 8 }]}>
              颜色
            </Text>
            <Text style={[styles.grayText, { fontSize: 12, marginBottom: 16 }]}>
              不超过4类
            </Text>
            <UnlikeButtonList
              dataType={'clothing_colors'}
              value={this.state.clothing_colors}
              onPress={this.unlikeCallBack}
              array={COLOR}
              maxNumber={4}
            />
          </View>
          <View style={styles.bottomMargin}>
            <Text style={[styles.blackText, { fontSize: 16, marginBottom: 8 }]}>
              印花
            </Text>
            <Text style={[styles.grayText, { fontSize: 12, marginBottom: 16 }]}>
              不超过3类
            </Text>
            <UnlikeButtonList
              dataType={'prints'}
              value={this.state.prints}
              onPress={this.unlikeCallBack}
              array={PRINTING}
              maxNumber={3}
            />
          </View>
        </ScrollView>
        <TouchableOpacity
          style={[
            styles.button,
            this.state.isDone
              ? { backgroundColor: '#EA5C39' }
              : { backgroundColor: '#F8CFC4' }
          ]}
          onPress={this._saveFilters}>
          <Text style={styles.buttonText}>保存</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1
  },
  container: {
    paddingLeft: 40,
    flex: 1
  },
  blackText: {
    color: '#333333',
    letterSpacing: 0
  },
  graySixText: {
    color: '#666666',
    letterSpacing: 0
  },
  grayText: {
    color: '#999999',
    letterSpacing: 0
  },
  button: {
    height: 45,
    width: p2d(345),
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  buttonText: {
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: 0
  },
  bannerView: {
    marginTop: 16,
    marginBottom: 32
  },
  navigationBar: {
    borderBottomWidth: 0
  },
  bottomMargin: {
    marginBottom: 20
  }
})
