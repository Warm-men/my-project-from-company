/* @flow */

import React, { PureComponent } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Text
} from 'react-native'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'
import LookbookProducts from '../../../storybook/stories/lookbook/lookbook_products'
import LookBookPanel from '../../../storybook/stories/lookbook/lookbook_panel'
import PopUpPanel from '../../components/pop_up_panel'
import Image from '../../../storybook/stories/image'
import { Column } from '../../expand/tool/add_to_closet_status'
import { QNetwork, SERVICE_TYPES } from '../../expand/services/services.js'
export default class LookbookDetailContainer extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      data: {},
      disable: true
    }
    this.combinationOneIndex = 0
    this.combinationTwoIndex = 0
    this.getLook()

    const { column } = props.navigation.state.params
    this.column = column ? column : Column.Lookbook
  }

  getLook = () => {
    const { id } = this.props.navigation.state.params
    QNetwork(SERVICE_TYPES.lookbook.QUERY_LOOK, { id }, response => {
      const {
        primary_product,
        first_binding_products,
        second_binding_products,
        description
      } = response.data.look
      this.setState({
        defaultData: response.data.look,
        data: {
          description,
          primary_product,
          first_binding_product: first_binding_products[0],
          second_binding_product: second_binding_products[0]
        },
        disable: false
      })
    })
  }

  setCombinationIndex = (index, indexOfPanel) => {
    const {
      description,
      primary_product,
      first_binding_products,
      second_binding_products
    } = this.state.defaultData
    indexOfPanel === 1
      ? (this.combinationOneIndex = index)
      : (this.combinationTwoIndex = index)
    const firstProduct =
      first_binding_products[
        this.combinationOneIndex === -1 ? 0 : this.combinationOneIndex
      ]
    const twoProduct =
      second_binding_products[
        this.combinationTwoIndex === -1 ? 0 : this.combinationTwoIndex
      ]
    this.setState({
      data: {
        description,
        primary_product,
        first_binding_product: firstProduct,
        second_binding_product: twoProduct
      }
    })
  }
  _goBack = () => {
    this.props.navigation.goBack()
  }
  openProductDetail = item => {
    const { navigation } = this.props
    const { inSwap } = navigation.state.params
    navigation.push('Details', { item, inSwap, column: this.column })
  }
  _showModal = () => {
    this.setState({ modalVisible: true })
  }
  _hideModal = () => {
    this.setState({ modalVisible: false })
  }
  render() {
    const { index } = this.props.navigation.state.params
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          hasBottomLine={false}
          style={styles.navigationBar}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <ScrollView style={{ flex: 1 }}>
          <TouchableOpacity activeOpacity={1} onPress={this._hideModal}>
            <LookImage index={index} />
            <View style={styles.productView}>
              <LookbookProducts
                index={index}
                navigation={this.props.navigation}
                showCloset={true}
                data={this.state.data}
                onPress={
                  !this.state.modalVisible ? this.openProductDetail : null
                }
                column={this.column}
              />
            </View>

            {!!this.state.data.description && (
              <View style={styles.desc}>
                <Text style={styles.descText}>
                  <Text style={styles.guideTitle}>| 搭配指南: </Text>
                  {this.state.data.description}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </ScrollView>
        <View style={styles.replaceView}>
          <TouchableOpacity
            disabled={this.state.disable}
            style={styles.replaceButton}
            onPress={this._showModal}>
            <Image
              source={require('../../../assets/images/lookbook/replace.png')}
            />
            <Text style={styles.replaceText}>更换搭配</Text>
          </TouchableOpacity>
        </View>

        <PopUpPanel
          isNoNeedonLayout={true}
          height={190}
          customContainer={styles.customContainer}
          animationType="slide"
          visible={this.state.modalVisible}
          onRequestClose={this._hideModal}>
          <LookBookPanel
            data={this.state.defaultData}
            initIndexs={[this.combinationOneIndex, this.combinationTwoIndex]}
            setIndexOfCard={this.setCombinationIndex}
            onClose={this._hideModal}
          />
        </PopUpPanel>
      </SafeAreaView>
    )
  }
}

class LookImage extends PureComponent {
  render() {
    const { index } = this.props
    return (
      <View style={styles.title}>
        {typeof index !== 'undefined' ? (
          <Text style={styles.text}>{`LOOK${index + 1}`}</Text>
        ) : null}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    marginLeft: 40,
    marginTop: 14
  },
  text: { fontSize: 20, color: '#333' },
  productView: { marginTop: 15 },
  guideTitle: {
    fontSize: 14,
    fontWeight: '900',
    lineHeight: Platform.OS === 'ios' ? 20 : 24
  },
  desc: {
    marginTop: 40,
    paddingHorizontal: 15
  },
  descText: {
    fontSize: 14,
    color: '#666666'
  },
  replaceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#B2B2AF'
  },
  replaceView: {
    paddingHorizontal: 20,
    marginVertical: 10
  },
  replaceText: {
    marginLeft: 10,
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold'
  },
  customContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'flex-end',
    zIndex: 999
  }
})
