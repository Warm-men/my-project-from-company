import React from 'react'
import AuthenticationComponent from '../../components/authentication'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text
} from 'react-native'
import {
  NavigationBar,
  SafeAreaView,
  BarButtonItem
} from '../../../storybook/stories/navigationbar'
import { AttributePreferences } from '../../../storybook/stories/account'
import { inject, observer } from 'mobx-react'
import { SERVICE_TYPES, Mutate } from '../../expand/services/services'
import _ from 'lodash'
@inject('currentCustomerStore')
@observer
export default class LikeContainer extends AuthenticationComponent {
  onSignIn() {
    this._isDone()
  }
  constructor(props) {
    super(props)
    this.array = props.currentCustomerStore.attribute_preferences.map(item => {
      return item.name
    })
    this.state = {
      selectedType: [...this.array],
      isDone: false
    }
    this.isCommitting = false
  }
  UNSAFE_componentWillMount() {
    this._isDone()
  }
  _signInCustomer = () => {
    this.props.currentCustomerStore.setLoginModalVisible(true)
  }
  _isDone = () => {
    if (
      this.state.selectedType.length &&
      _.xor(this.array, this.state.selectedType).length
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
  didSelectedAttributePreferences = items => {
    if (this.isCommitting) {
      return
    }
    this.setState({ selectedType: items }, () => {
      this._isDone()
    })
  }

  _updateAttributePreferences = () => {
    if (!this.state.isDone) {
      return
    }
    this.isCommitting = true
    const { currentCustomerStore } = this.props
    if (!currentCustomerStore.id) {
      this._signInCustomer()
      return
    }
    const input = {
      preferences: this.state.selectedType
    }
    Mutate(
      SERVICE_TYPES.me.MUTAITON_UPDATE_ATTRIBUTE_PREFERENCES,
      { input },
      () => {
        this.props.currentCustomerStore.attribute_preferences = this.state.selectedType.map(
          item => {
            return { name: item }
          }
        )
        this.props.navigation.goBack()
      },
      () => {
        this.isCommitting = false
      }
    )
  }
  _goBack = () => {
    this.props.navigation.goBack()
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
        <ScrollView
          style={styles.container}
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}>
          <View style={styles.titleView}>
            <Text style={styles.titleText}>喜欢</Text>
            <Text style={styles.descriptText}>优先推荐你喜欢的品类</Text>
          </View>
          <AttributePreferences
            style={styles.preferences}
            defaultTypes={this.state.selectedType}
            didSelectedType={this.didSelectedAttributePreferences}
          />
        </ScrollView>
        <TouchableOpacity
          style={[
            styles.button,
            this.state.isDone
              ? { backgroundColor: '#EA5C39' }
              : { backgroundColor: '#F8CFC4' }
          ]}
          onPress={this._updateAttributePreferences}>
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
    flex: 1,
    flexDirection: 'column',
    width: '100%'
  },
  preferences: {
    paddingHorizontal: 35
  },
  navigationBar: {
    borderBottomWidth: 0
  },
  titleView: {
    marginHorizontal: 40
  },
  titleText: {
    color: '#333333',
    fontSize: 20,
    fontWeight: '500'
  },
  descriptText: {
    color: '#999',
    fontSize: 14,
    marginTop: 16,
    lineHeight: 24
  },
  button: {
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 10,
    height: 45,
    backgroundColor: '#EA5C39',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: 0
  }
})
