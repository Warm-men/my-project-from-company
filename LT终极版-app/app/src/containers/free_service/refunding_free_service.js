import React, { PureComponent } from 'react'
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native'
import Image from '../../../storybook/stories/image'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'
const { getFreeServicePrice } = require('../../request')
export default class RefundingFreeServiceContainer extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { type: '' }
  }
  componentDidMount() {
    this.getType()
  }

  getType = () => {
    return getFreeServicePrice().then(response => {
      this.setState({
        type: response.data.me.free_service.free_service_type.type
      })
    })
  }
  _goBack = () => {
    this.props.navigation.popToTop()
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          title={'自在选'}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <Image
          style={styles.cancelIcon}
          source={require('../../../assets/images/free_service/sucsess.png')}
        />
        <Text style={styles.canceled}>已关闭自在选</Text>

        <Text style={styles.description}>
          {this.state.type === ''
            ? ''
            : this.state.type === 'FreeServiceContractType'
            ? '如有需要可再次开通使用'
            : '自在选押金将在10个工作日内原路径退回'}
        </Text>

        <View style={styles.container1}>
          <TouchableOpacity style={styles.cancelButton} onPress={this._goBack}>
            <Text style={styles.cancelText}>我知道了</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  container1: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  cancelIcon: {
    marginTop: 88,
    width: 76,
    height: 76
  },
  canceled: {
    color: '#989898',
    fontSize: 14,
    marginTop: 20
  },
  description: {
    color: '#333333',
    fontSize: 16,
    marginTop: 14
  },
  cancelButton: {
    marginBottom: 10,
    width: '90%',
    height: 44,
    borderRadius: 4,
    backgroundColor: '#EA5C39',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cancelText: {
    color: '#FFFFFF',
    fontSize: 14
  }
})
