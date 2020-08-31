import React, { Component, PureComponent } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  DeviceEventEmitter,
  Platform,
  BackHandler,
  Animated
} from 'react-native'
import Image from '../../../storybook/stories/image.js'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'
import { SERVICE_TYPES, Mutate } from '../../expand/services/services'
import p2d from '../../expand/tool/p2d'
import Animation from 'lottie-react-native'
import { inject } from 'mobx-react'

@inject('appStore')
export default class SatisfiedProductContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      satisfiedProducts: []
    }
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
    }
  }

  handleBackPress = () => {
    this._goBack()
    return true
  }

  _goBack = () => {
    this.props.navigation.popToTop()
  }

  _didSelectedItem = (select, item) => {
    let newProducts,
      products = [...this.state.satisfiedProducts]
    if (select) {
      newProducts = products.filter(i => {
        return i !== item.id
      })
    } else {
      newProducts = [...products, item.id]
    }
    this.setState({
      satisfiedProducts: newProducts
    })
  }

  rateProductItem = () => {
    const { tote } = this.props.navigation.state.params
    const { satisfiedProducts } = this.state
    return tote.tote_products.map((item, index) => {
      const select = satisfiedProducts.find(id => {
        return item.id === id
      })
      return (
        <Product
          item={item}
          didSelectedItem={this._didSelectedItem}
          key={index}
          select={!!select}
        />
      )
    })
  }

  addPerfectClosets = value => {
    const { navigation } = this.props
    const { tote } = navigation.state.params
    const input = {
      tote_id: tote.id,
      tote_product_ids: value ? [] : this.state.satisfiedProducts
    }
    Mutate(SERVICE_TYPES.rating.MUTATION_ADD_PERFECT_CLOSETS, { input }, () => {
      DeviceEventEmitter.emit('onRefreshTotes')
      DeviceEventEmitter.emit('onRefreshSatisfiedProducts')
      navigation.replace('ToteReturn', { tote })
    })
  }

  errorToast = () => {
    this.props.appStore.showToastWithOpacity('请先选择单品')
  }

  render() {
    const { satisfiedProducts } = this.state
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <NavigationBar
          title={'满分单品'}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <View style={styles.container}>
          <Header />
          <ScrollView bounces={false}>
            <View style={styles.productsView}>{this.rateProductItem()}</View>
          </ScrollView>
        </View>
        <Bottom
          products={satisfiedProducts}
          addPerfectClosets={this.addPerfectClosets}
          errorToast={this.errorToast}
        />
      </SafeAreaView>
    )
  }
}

class Header extends PureComponent {
  render() {
    return (
      <View style={styles.headerView}>
        <Text style={styles.headerTitle}>本次有特别喜欢且合身的服饰吗？</Text>
        <Text style={styles.headerTips}>收集后可在「愿望衣橱」查看</Text>
      </View>
    )
  }
}

class Product extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      progress: new Animated.Value(0)
    }
  }
  startAnimated = () => {
    const { select } = this.props
    this.state.progress.setValue(0)
    Animated.timing(this.state.progress, {
      toValue: select ? 0 : 1,
      duration: 2000,
      useNativeDriver: false,
      isInteraction: false
    }).start()
  }
  didSelectedItem = () => {
    const { didSelectedItem, select, item } = this.props
    didSelectedItem && didSelectedItem(select, item)
    this.startAnimated()
  }

  render() {
    const { select, item } = this.props
    const uri = item.product.catalogue_photos['0'].medium_url
    return (
      <TouchableOpacity
        onPress={this.didSelectedItem}
        style={styles.productItem}>
        <Image style={styles.productImage} source={{ uri }} />
        <View style={styles.animatedContainer}>
          <Animation
            source={require('../../../assets/animation/tote/selected.json')}
            progress={select ? this.state.progress : 0}
          />
        </View>
      </TouchableOpacity>
    )
  }
}

class Bottom extends PureComponent {
  addEmptyPerfectClosets = () => {
    const { addPerfectClosets } = this.props
    addPerfectClosets && addPerfectClosets(true)
  }

  addPerfectClosets = () => {
    const { addPerfectClosets, products } = this.props
    if (!products.length) {
      this.addEmptyPerfectClosets()
    }
    addPerfectClosets && addPerfectClosets(false)
  }

  render() {
    const { products } = this.props
    return (
      <View style={styles.bottomView}>
        <View style={styles.tipsView}>
          <Text style={styles.tipsTitle}>
            已找到
            <Text style={styles.productLengh}> {products.length} </Text>
            款满分单品
          </Text>
        </View>

        <TouchableOpacity
          style={styles.bottomTouch}
          onPress={this.addPerfectClosets}>
          <Text style={styles.bottomTitle}>确认</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1
  },
  container: {
    flex: 1
  },
  animatedContainer: {
    width: 60,
    height: 60,
    position: 'absolute',
    top: -20,
    right: -20,
    zIndex: 1000
  },
  headerView: {
    alignItems: 'center',
    marginTop: p2d(40),
    marginBottom: p2d(4)
  },
  headerTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: p2d(12),
    fontWeight: '700'
  },
  headerTips: {
    fontSize: 12,
    color: '#999'
  },
  productsView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: p2d(19),
    flex: 1,
    paddingTop: 20
  },
  productItem: {
    height: p2d(108),
    width: p2d(72),
    marginHorizontal: p2d(6),
    marginBottom: p2d(16)
  },
  productImage: {
    height: p2d(108),
    width: p2d(72)
  },
  productIcon: {
    position: 'absolute',
    height: p2d(18),
    width: p2d(18),
    right: 0
  },
  bottomView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: p2d(16),
    paddingBottom: p2d(8),
    borderTopColor: '#F3F3F3',
    borderTopWidth: 0.5,
    paddingTop: 8
  },
  tipsView: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  tipsTitle: {
    fontSize: 13,
    color: '#5E5E5E'
  },
  bottomTouch: {
    height: p2d(44),
    backgroundColor: '#EA5C39',
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    borderRadius: 2
  },
  bottomTitle: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600'
  },
  productLengh: {
    color: '#121212',
    fontSize: 16
  }
})
