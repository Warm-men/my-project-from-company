import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity
} from 'react-native'
import Image from '../../../storybook/stories/image'
import { ScrollView } from 'react-native-gesture-handler'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'
import p2d from '../../expand/tool/p2d'
import { inject, observer } from 'mobx-react'
import { Mutate, SERVICE_TYPES } from '../../expand/services/services'
const screenWidth = Dimensions.get('window').width
const { getFreeServicePrice } = require('../../request')
import { updateFreeService } from '../../expand/tool/free_service'
@inject('currentCustomerStore', 'appStore')
@observer
export default class FreeServiceHelpContainer extends Component {
  componentDidMount() {
    this.getPurchaseId()
  }
  openClothesCleanFlow = () => {
    this.props.navigation.navigate('WebPage', {
      uri: 'https://static.letote.cn/free_service/clothes_clean_flow/index.html'
    })
  }
  openFreeServiceClick = () => {
    const { enablePaymentContract } = this.props.currentCustomerStore
    const isContarcted = !!enablePaymentContract.length
    if (!isContarcted) {
      this.props.navigation.navigate('Contract', { openFreeService: true })
    } else {
      this.openFreeService()
    }
  }
  getPurchaseId = () => {
    getFreeServicePrice().then(response => {
      const { free_service_types } = response.data
      if (free_service_types && free_service_types.length > 0)
        free_service_types.map(result => {
          if (result.type === 'FreeServiceContractType') {
            this.id = result.id
          }
        })
    })
  }
  openFreeService = () => {
    if (this.id) {
      Mutate(
        SERVICE_TYPES.freeService.PURCHASE_FREE_SERVICE,
        {
          purchaseFreeServiceInput: {
            payment_method_id: -2,
            free_service_type_id: this.id
          }
        },
        response => {
          if (response.data.PurchaseFreeService.order.successful) {
            updateFreeService()
            this.props.navigation.replace('OpenFreeServiceSuccessful')
          } else {
            this.props.appStore.showToast(result.errors[0].message, 'error')
          }
        },
        error => {
          console.log(error)
        }
      )
    } else {
      this.getPurchaseId()
    }
  }

  _goBack = () => {
    this.props.navigation.goBack()
  }
  render() {
    let isShowOpenButton
    const { freeService } = this.props.currentCustomerStore
    if (freeService) {
      const { state } = freeService
      if (
        state !== 'active' &&
        state !== 'apply_refund' &&
        state !== 'approved'
      ) {
        isShowOpenButton = true
      }
    }
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          title={'自在选使用帮助'}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <ScrollView>
          <Image
            style={{ width: screenWidth, height: screenWidth * (714 / 750) }}
            resizeMode={'contain'}
            source={require('../../../assets/images/free_service/help/help_one.png')}
          />
          <Image
            style={{ width: screenWidth, height: screenWidth * (944 / 750) }}
            resizeMode={'contain'}
            source={require('../../../assets/images/free_service/help/help_two.png')}
          />
          <Image
            style={{ width: screenWidth, height: screenWidth * (1102 / 750) }}
            resizeMode={'contain'}
            source={require('../../../assets/images/free_service/help/help_three.png')}
          />
          <Image
            style={{ width: screenWidth, height: screenWidth * (1036 / 750) }}
            resizeMode={'contain'}
            source={require('../../../assets/images/free_service/help/help_four.png')}
          />
          <View>
            <Image
              style={{ width: screenWidth, height: screenWidth * (1222 / 750) }}
              resizeMode={'contain'}
              source={require('../../../assets/images/free_service/help/help_five.png')}
            />
            <TouchableOpacity
              style={styles.openClothesCleanFlow}
              onPress={this.openClothesCleanFlow}>
              <Text style={styles.openClothesCleanFlowText}>
                点击查看处理流程 >
              </Text>
            </TouchableOpacity>
          </View>
          <Image
            style={{ width: screenWidth, height: screenWidth * (1308 / 750) }}
            resizeMode={'contain'}
            source={require('../../../assets/images/free_service/help/help_six.png')}
          />
        </ScrollView>

        {isShowOpenButton && (
          <View style={styles.openContainer}>
            <TouchableOpacity
              onPress={this.openFreeServiceClick}
              style={styles.openTextContainer}>
              <Text style={styles.openText}>{'免费开通'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  openClothesCleanFlow: {
    height: 50,
    width: '50%',
    marginLeft: screenWidth / 6.5,
    position: 'absolute',
    bottom: -30
  },
  openClothesCleanFlowText: {
    color: '#70AAEF',
    fontSize: 14
  },
  openContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: p2d(56),
    paddingVertical: p2d(8),
    paddingHorizontal: p2d(15)
  },
  openTextContainer: {
    width: '100%',
    height: p2d(44),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E85C40',
    borderRadius: p2d(3)
  },
  openText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '600'
  }
})
