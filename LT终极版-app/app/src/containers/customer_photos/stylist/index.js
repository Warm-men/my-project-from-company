import React, { Component, PureComponent } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Keyboard,
  DeviceEventEmitter,
  TouchableOpacity
} from 'react-native'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../../storybook/stories/navigationbar'
import {
  SERVICE_TYPES,
  Mutate,
  QNetwork
} from '../../../expand/services/services'
import {
  ContentContainer,
  PhotosContainer,
  RelatedProducts,
  SubmitButton
} from '../../../../storybook/stories/customer_photos/submit_customer_photo'
import StyleTags from '../../../../storybook/stories/customer_photos/style_tags'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'
import { inject } from 'mobx-react'
import {
  getRelatedProducts,
  checkSubmit,
  updateStickers,
  updateSelectedStyleTags,
  getCreateCustomerPhotoInput
} from '../../../expand/tool/customer_photos'
import { CustomAlertView } from '../../../../storybook/stories/alert/custom_alert_view'
import p2d from '../../../expand/tool/p2d'
@inject('appStore', 'panelStore', 'modalStore', 'guideStore')
export default class StylistContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: true,
      isCreatingCustomerPhoto: false,
      style_tags: [],
      share_incentive: null,
      share_topics: [],
      relatedProducts: [],
      photos: [],
      selectedStyleTags: [],
      content: '',
      topicId: null,
      shareImageUrl: ''
    }
  }

  _goBackCheck = () => {
    const { modalStore } = this.props
    const { content, selectedStyleTags, photos } = this.state
    if (!content && !selectedStyleTags.length && !photos.length) {
      this._goBack()
      return
    }
    modalStore.show(
      <CustomAlertView
        message={'现在退出将会丢失已编辑的内容'}
        cancel={{ title: '取消', type: 'normal' }}
        other={[{ title: '确认', type: 'highLight', onClick: this._goBack }]}
      />
    )
  }
  _goBack = () => {
    this.props.navigation.goBack()
  }

  componentDidMount() {
    this._queryStyleTags()
  }
  _queryStyleTags = () => {
    QNetwork(
      SERVICE_TYPES.customerPhotos.QUERY_STYLE_TAGS,
      {},
      response => {
        const {
          style_tags,
          share_incentive,
          share_topics
        } = response.data.customer_photo_summary
        this.setState({
          style_tags,
          share_incentive,
          share_topics,
          isLoading: false
        })
      },
      () => {
        this.setState({ isLoading: false })
      }
    )
  }
  _updatePhotos = photos => {
    this.setState({ photos })
  }

  _updateSelectedStyleTags = tag => {
    const array = updateSelectedStyleTags(tag, this.state.selectedStyleTags, -1)
    this.setState({ selectedStyleTags: array })
  }

  _updateContent = content => {
    this.setState({ content })
  }
  _updateTopic = topicId => {
    this.setState({ topicId })
  }

  _updateStickers = array => {
    const photos = updateStickers(array, this.state.photos)
    this.setState({ photos })
  }

  _taggingCustomerPhotos = photos => {
    this.props.navigation.navigate('TaggingCustomerPhotos', {
      photos,
      updateStickers: this._updateStickers,
      renounceTagging: this._renounceTagging
    })
  }

  _onClickCollectionItem = (photo, index) => {
    this.props.guideStore.photosTaggingBubble = true
    this.props.navigation.navigate('TaggingCustomerPhotos', {
      index,
      photos: this.state.photos,
      updateStickers: this._updateStickers
    })
  }

  _submit = () => {
    const { content, photos } = this.state
    if (checkSubmit(content, photos)) {
      this._createCustomerPhoto()
    }
    Keyboard.dismiss()
  }

  _createCustomerPhoto = () => {
    this.setState({ isCreatingCustomerPhoto: true })

    const { content, topicId, selectedStyleTags, photos } = this.state
    const object = {
      content,
      topicId,
      customerPhotos: photos,
      tags: selectedStyleTags
    }
    const input = getCreateCustomerPhotoInput(object)

    Mutate(
      SERVICE_TYPES.customerPhotos.MUTATION_CREATE_CUSTOMER_PHOTO,
      { input },
      response => {
        const { customer_photo } = response.data.CreateCustomerPhoto
        this.setState({ shareImageUrl: customer_photo.share_image_url })
        this.props.appStore.showToastWithOpacity('晒单成功')
        DeviceEventEmitter.emit('refreshHomeFloatHover')
        this._goBack()
      },
      () => {
        this.setState({ isCreatingCustomerPhoto: false })
      }
    )
  }

  _renounceTagging = () => {
    const photos = this.state.photos.filter(i => !!i.stickers)
    if (photos.length !== this.state.photos.length) {
      this.setState({ photos })
    }
  }

  _visitHepler = () => {
    const { navigation } = this.props
    navigation.push('WebPage', {
      uri: 'https://static.letote.cn/pages/newshow_inroduce/index.html'
    })
  }

  render() {
    const { isLoading, share_incentive, share_topics, style_tags } = this.state
    const { navigation } = this.props
    const timeCashAmount = share_incentive && share_incentive.time_cash_amount
    const relatedProducts = getRelatedProducts(this.state.photos)

    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          title={'晒单'}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBackCheck} buttonType={'back'} />
          }
          headerTitleViewStyle={styles.headerTitleViewStyle}
          barButtonItemStyle={styles.barButtonItemStyle}
          rightBarButtonItem={<ShareGuid visitHepler={this._visitHepler} />}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardDismissMode={'on-drag'}>
          {isLoading ? (
            <View style={styles.loadingView}>
              <Spinner isVisible size={40} type={'Pulse'} color={'#222'} />
            </View>
          ) : (
            <View style={styles.viewWrapper}>
              <PhotosContainer
                navigation={navigation}
                photos={this.state.photos}
                updatePhotos={this._updatePhotos}
                onClickCollectionItem={this._onClickCollectionItem}
                taggingCustomerPhotos={this._taggingCustomerPhotos}
                maxLength={-1}
              />
              <ContentContainer
                updateContent={this._updateContent}
                updateTopic={this._updateTopic}
                shareTopics={share_topics}
                placeholder={
                  timeCashAmount
                    ? `写下你的搭配技巧与心得，被评为精选并推荐到首页后，你会获得${timeCashAmount}元奖励金`
                    : '写下你的搭配技巧与心得'
                }
              />
              <StyleTags
                array={style_tags}
                selectedStyleTags={this.state.selectedStyleTags}
                didSelectedItem={this._updateSelectedStyleTags}
                hasBottomLine={!!relatedProducts.length}
              />
              {!!relatedProducts.length && (
                <RelatedProducts relatedProducts={relatedProducts} isStylist />
              )}
            </View>
          )}
        </ScrollView>
        <SubmitButton
          style={styles.buttonStyle}
          onClick={this._submit}
          isCreatingCustomerPhoto={this.state.isCreatingCustomerPhoto}
        />
        <Image
          style={styles.image}
          source={{ uri: this.state.shareImageUrl }}
        />
      </SafeAreaView>
    )
  }
}

class ShareGuid extends PureComponent {
  render() {
    return (
      <TouchableOpacity
        style={styles.shareGuid}
        activeOpacity={0.8}
        onPress={this.props.visitHepler}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
        <Image
          style={styles.guidIcon}
          source={require('../../../../assets/images/customer_photos/guid_icon.png')}
        />
        <Text style={styles.guidText}>{'晒单攻略'}</Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  viewWrapper: { paddingTop: 16 },
  loadingView: { height: 100, alignItems: 'center', justifyContent: 'center' },
  headerTitleViewStyle: { width: '40%' },
  barButtonItemStyle: { width: '30%' },
  timeCashAmount: { color: '#E85C40' },
  image: { height: 0, width: 0 },
  shareGuid: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 16
  },
  guidIcon: {
    width: p2d(12),
    height: p2d(12),
    marginRight: 4
  },
  guidText: { fontSize: 12, color: '#242424' },
  buttonStyle: {
    borderTopColor: '#F2F2F2',
    borderTopWidth: 1
  }
})
