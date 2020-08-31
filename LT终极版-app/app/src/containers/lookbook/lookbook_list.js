/* @flow */

import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Platform,
  Animated,
  Dimensions,
  SectionList,
  Text,
  TouchableOpacity
} from 'react-native'
import {
  NavigationBar,
  BarButtonItem
} from '../../../storybook/stories/navigationbar'
import LookItem from '../../../storybook/stories/lookbook/look_item'
import Image from '../../../storybook/stories/image'
import { QNetwork, SERVICE_TYPES } from '../../expand/services/services'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'
import { viewableItemsLookBooks } from '../../expand/tool/daq'

const FOOTER_STATUS = {
  OPENED: 'OPENED',
  CLOSED: 'CLOSED',
  NO_FOOTER: 'NO_FOOTER'
}
const THRESHOLD_LENGTH = 3

const SectionListAnimated = Animated.createAnimatedComponent(SectionList)
const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window')
const cataloguePhotosHeight = (deviceWidth / 2) * 3
const hiddenContentOffsetY = (cataloguePhotosHeight * 3) / 4

export default class LookBooksContainer extends Component {
  constructor(props) {
    super(props)
    this.scrollY = new Animated.Value(0)
    this.state = {
      data: [],
      name: '',
      navigationBarOpacity: 0,
      scrollEventThrottle: 1
    }
    this.animatedViewWidth = deviceWidth
    this.animatedViewHeight = deviceWidth * 1.5
  }
  componentDidMount() {
    this._addObservers()
    this.getLookThemes()
  }
  getLookThemes = () => {
    const { id } = this.props.navigation.state.params
    QNetwork(SERVICE_TYPES.lookbook.QUERY_LOOKTHEME, { id }, response => {
      const { name, look_sub_themes } = response.data.look_theme
      this.setState({ name })
      this.groupBy(look_sub_themes)
    })
  }
  groupBy = lookSubThemes => {
    const dataState = []
    let footerStatus = FOOTER_STATUS.NO_FOOTER

    lookSubThemes.map((item, sectionIndex) => {
      let { looks, image_url, image_height, image_width, description } = item
      if (looks.length > THRESHOLD_LENGTH) {
        footerStatus = FOOTER_STATUS.CLOSED
      }
      const lookTheme = {
        image_url,
        image_height,
        image_width,
        description,
        footerStatus,
        sectionIndex,
        data: looks
      }
      dataState.push(lookTheme)
    })
    this.setState({ data: dataState })
  }

  _goBack = () => {
    this.props.navigation.goBack()
  }

  _looksHeader = ({
    section: { image_url, description, image_height, image_width }
  }) => {
    let scale
    if (!!image_height && !!image_width) {
      scale = image_height / image_width
    }
    return (
      <View style={{ marginTop: 60 }}>
        <Image
          style={[styles.banner, scale && { height: deviceWidth * scale }]}
          source={{
            uri: image_url
          }}
          qWidth={1050}
          resizeMode="cover"
        />
        {!!description && <Text style={styles.textDesc}>{description}</Text>}
      </View>
    )
  }

  _addObservers = () => {
    this.scrollY.addListener(({ value }) => {
      if (
        value > this.animatedViewHeight &&
        this.state.navigationBarOpacity !== 1
      ) {
        this.setState({
          navigationBarOpacity: 1,
          scrollEventThrottle: 16
        })
      } else if (
        value <= this.animatedViewHeight &&
        value >= hiddenContentOffsetY
      ) {
        this.setState({
          scrollEventThrottle: 16,
          navigationBarOpacity:
            (value - hiddenContentOffsetY) /
            (this.animatedViewHeight - hiddenContentOffsetY)
        })
      } else if (
        value < hiddenContentOffsetY &&
        this.state.navigationBarOpacity !== 0
      ) {
        this.setState({
          navigationBarOpacity: 0,
          scrollEventThrottle: 1
        })
      }
    })
  }
  _didSelectedItem = (data, index) => {
    this.props.navigation.navigate('LookbookDetail', { id: data.id, index })
  }
  _renderItem = ({ item, index, section }) => {
    if (
      section.footerStatus === FOOTER_STATUS.CLOSED &&
      index > THRESHOLD_LENGTH - 1
    ) {
      return null
    }
    return (
      <LookItem
        didSelectedItem={this._didSelectedItem}
        navigation={this.props.navigation}
        data={item}
        index={index}
      />
    )
  }
  _looksFooter = ({ section }) => {
    const { footerStatus, sectionIndex, data } = section
    if (data.length <= THRESHOLD_LENGTH) {
      return
    }
    const isOpenAction = footerStatus === FOOTER_STATUS.CLOSED
    return (
      <TouchableOpacity
        style={styles.moreLooks}
        onPress={() => {
          this._exChangeMoreButtonStatus(sectionIndex, isOpenAction)
        }}>
        <View style={styles.moreContainer}>
          <Text style={styles.moreText}>
            {isOpenAction ? '查看更多LOOK' : '收起'}
          </Text>
          <Image
            style={[styles.moreImage, !isOpenAction ? styles.transform : null]}
            source={require('../../../assets/images/collection/arrow_down.png')}
          />
        </View>
      </TouchableOpacity>
    )
  }
  _exChangeMoreButtonStatus = (sectionIndex, isOpenAction) => {
    let data = [...this.state.data]
    data[sectionIndex].footerStatus = isOpenAction
      ? FOOTER_STATUS.OPENED
      : FOOTER_STATUS.CLOSED
    this.setState({ data }, () => {
      !isOpenAction &&
        this.sectionList._component.scrollToLocation({
          sectionIndex,
          itemIndex: THRESHOLD_LENGTH - 1,
          animated: false,
          viewPosition: 0.5
        })
    })
  }
  _lookbookListEmptyComponent = () => {
    return (
      <View style={styles.emptyView}>
        <Spinner isVisible={true} size={40} type={'Pulse'} color={'#222'} />
      </View>
    )
  }
  _extractUniqueKey = item => {
    return item.id
  }

  _onViewableItemsChanged = ({ changed }) => {
    viewableItemsLookBooks(changed)
  }
  render() {
    return (
      <View style={styles.container}>
        <NavigationBar
          isAnimated={true}
          style={[
            styles.navigationBar,
            {
              opacity: this.scrollY.interpolate({
                inputRange: [0, hiddenContentOffsetY, cataloguePhotosHeight],
                outputRange: [0, 0, 1]
              })
            }
          ]}
          titleView={
            <View style={[styles.titleView]}>
              <Text numberOfLines={1} tyle={styles.titleText}>
                {this.state.name}
              </Text>
            </View>
          }
        />
        <BarButtonItem
          onPress={this._goBack}
          buttonType={'back'}
          style={styles.barButtonItem}
        />
        <SectionListAnimated
          ref={ref => (this.sectionList = ref)}
          contentContainerStyle={{ paddingBottom: 60 }}
          ListEmptyComponent={this._lookbookListEmptyComponent}
          style={styles.sectionList}
          sections={this.state.data}
          keyExtractor={this._extractUniqueKey}
          renderItem={this._renderItem}
          stickySectionHeadersEnabled={false}
          renderSectionFooter={this._looksFooter}
          renderSectionHeader={this._looksHeader}
          onViewableItemsChanged={this._onViewableItemsChanged}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.scrollY } } }],
            {
              useNativeDriver: true,
              isInteraction: false
            }
          )}
          {...Platform.select({
            ios: {
              removeClippedSubviews: false
            },
            android: {
              removeClippedSubviews: true
            }
          })}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  navigationBar: {
    position: 'absolute',
    borderBottomWidth: 0,
    paddingTop: Platform.OS === 'ios' ? (deviceHeight >= 812 ? 30 : 20) : 0,
    height: Platform.OS === 'ios' ? (deviceHeight >= 812 ? 84 : 64) : 44
  },
  titleView: {
    alignItems: 'center'
  },
  titleText: {
    fontSize: 16
  },
  banner: {
    flex: 1,
    height: cataloguePhotosHeight
  },
  barButtonItem: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? (deviceHeight >= 812 ? 34 : 20) : 0,
    zIndex: 10,
    height: 35,
    width: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255,0)'
  },
  textDesc: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 25,
    fontWeight: '400',
    padding: 15,
    marginTop: 9
  },
  emptyView: {
    marginTop: 110,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sectionList: {
    marginTop: -60
  },
  moreLooks: {
    marginTop: 31,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  moreText: {
    fontSize: 14,
    color: '#333'
  },
  moreContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    height: 44,
    width: 159,
    borderRadius: 22,
    borderColor: '#999',
    borderWidth: 1
  },
  moreImage: {
    marginLeft: 5
  },
  transform: {
    transform: [{ rotateX: '180deg' }]
  }
})
