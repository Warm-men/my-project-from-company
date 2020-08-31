import React, { Component, PureComponent } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Keyboard,
  DeviceEventEmitter,
  TouchableOpacity,
  Image
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
import SharePanel from '../../common/SharePanel'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'
import { inject, observer } from 'mobx-react'
import ShareImage from '../../../../storybook/stories/alert/share_image'
import { Client } from '../../../expand/services/client'
import p2d from '../../../expand/tool/p2d'
import {
  getRelatedProducts,
  checkSubmit,
  updateStickers,
  updateSelectedStyleTags,
  getCreateCustomerPhotoInput,
  updateCustomerPhotoCenterData
} from '../../../expand/tool/customer_photos'
import { CustomAlertView } from '../../../../storybook/stories/alert/custom_alert_view'
import { showNotificationDialog } from '../../../expand/tool/notifications'
import Statistics from '../../../expand/tool/statistics'
import { differenceInSeconds } from 'date-fns'
@inject(
  'appStore',
  'panelStore',
  'modalStore',
  'currentCustomerStore',
  'guideStore'
)
@observer
export default class SubmitCustomerPhotoContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      isCreatingCustomerPhoto: false,
      style_tags: [],
      share_incentive: null,
      share_topics: [],
      photos: [],
      selectedStyleTags: [],
      content: '',
      topicId: null,
      shareImageUrl: ''
    }

    this.isStylist = this.props.currentCustomerStore.roles.find(item => {
      return item.type === 'stylist'
    })
    this.isSubmitCompleted = false
    this.onfocus = false
    this.clickGuide = false
    this.enterPageTime = new Date()
    this.clickMatchButton = false
    this.clickUnmatchButton = false
    this.onSubmitTime = null
  }

  componentWillUnmount() {
    if (!this.isSubmitCompleted) {
      //上报未完成晒单就离开页面的事件
      const { content, selectedStyleTags, photos } = this.state
      const stayTimes = differenceInSeconds(new Date(), this.enterPageTime)

      const attributes = {
        input_content: content,
        click_input_box: this.onfocus + '',
        click_match_button: this.clickMatchButton + '',
        click_unmatch_button: this.clickUnmatchButton + '',
        select_style_tag: selectedStyleTags.length + '',
        upload_photo_amount: photos.length + '',
        click_guide: this.clickGuide + '',
        stay_to_left_time: `${stayTimes}秒`
      }
      if (this.onSubmitTime) {
        const submitTime = differenceInSeconds(new Date(), this.onSubmitTime)
        attributes.submit_to_left_time = `${submitTime}秒`
      }
      Statistics.onEvent({
        id: 'photos_submit_left',
        label: '发表晒单离开事件',
        attributes
      })
    }
  }

  _onfocus = () => (this.onfocus = true)

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
    const { navigation } = this.props
    navigation.goBack()
    if (this.isSubmitCompleted) {
      setTimeout(() => {
        showNotificationDialog({
          title: '及时获取你的精选晒单奖励信息',
          description: '前往“托特衣箱”-“通知”中开启'
        })
      }, 1000)
    }
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

  _taggingCustomerPhotos = photos => {
    const { navigation } = this.props
    const { toteProducts, toteProduct } = navigation.state.params

    navigation.navigate('TaggingCustomerPhotos', {
      photos,
      toteProduct,
      toteProducts,
      updateStickers: this._updateStickers,
      renounceTagging: this._renounceTagging
    })
  }

  _onClickCollectionItem = (photo, index) => {
    const { navigation } = this.props
    const { toteProducts, toteProduct } = navigation.state.params
    this.props.guideStore.photosTaggingBubble = true
    navigation.navigate('TaggingCustomerPhotos', {
      index,
      toteProduct,
      toteProducts,
      photos: this.state.photos,
      updateStickers: this._updateStickers
    })
  }

  _updatePhotos = photos => {
    this.setState({ photos })
  }

  _updateStickers = array => {
    const photos = updateStickers(array, this.state.photos)
    this.setState({ photos })
  }

  _updateSelectedStyleTags = tag => {
    const array = updateSelectedStyleTags(
      tag,
      this.state.selectedStyleTags,
      this.isStylist ? -1 : 2
    )
    this.setState({ selectedStyleTags: array })
  }

  _updateContent = content => this.setState({ content })

  _updateTopic = topicId => this.setState({ topicId })

  _onPressShareButton = type => {
    Statistics.onEvent({
      id: 'photos_submit_success_share',
      label: '晒单成功后分享事件',
      attributes: {
        buttonText:
          type === 'Friends'
            ? '微信好友'
            : type === 'TimeLine'
            ? '朋友圈'
            : '微信群'
      }
    })
  }

  _share = customerPhoto => {
    const { photos } = this.state
    this.props.panelStore.show(
      <SharePanel
        type="imageFile"
        onPress={this._onPressShareButton}
        cancel={this._goBack}
        onPressShareButton={this._goBack}
        url={
          Client.ORIGIN +
          '/customer_photo_details?customer_photo_id=' +
          customerPhoto.id
        }
        thumbImage={photos.length > 0 ? photos[0].uri : ''}
        title={'我在托特衣箱上发了一篇晒单，快来帮我点赞吧'}
        description={'高品质品牌服饰随心换穿你也可以！'}
        component={
          <ShareImage
            imageUrl={photos.length > 0 ? photos[0].uri : ''}
            miniProgramCodeUrl={customerPhoto.mini_program_code_url}
          />
        }
      />
    )
  }

  _submit = () => {
    const { content, photos } = this.state
    if (checkSubmit(content, photos)) {
      this.clickMatchButton = true
      this.onSubmitTime = new Date()
      this._createCustomerPhoto()
    } else {
      this.clickUnmatchButton = true
    }
    Keyboard.dismiss()
  }

  _renounceTagging = () => {
    const photos = this.state.photos.filter(i => !!i.stickers)
    if (photos.length !== this.state.photos.length) {
      this.setState({ photos })
    }
  }

  _createCustomerPhoto = () => {
    this.setState({ isCreatingCustomerPhoto: true })
    const { navigation, appStore, currentCustomerStore } = this.props

    const { content, topicId, selectedStyleTags, photos } = this.state
    const { toteProduct, toteProducts, isLatest } = navigation.state.params
    const object = {
      content,
      topicId,
      toteProduct,
      toteProducts,
      tags: selectedStyleTags,
      customerPhotos: photos
    }
    const input = getCreateCustomerPhotoInput(object)

    Mutate(
      SERVICE_TYPES.customerPhotos.MUTATION_CREATE_CUSTOMER_PHOTO,
      { input },
      response => {
        const { toteId, updataProductCustomerPhotos } = navigation.state.params
        const { customer_photo, incentive } = response.data.CreateCustomerPhoto
        if (incentive && incentive.success_url) {
          navigation.replace('WebPage', {
            uri: incentive.success_url,
            hideShareButton: true
          })
          currentCustomerStore.resetCustomerPhotoIncentiveDetail()
        } else {
          this._share(customer_photo)
          appStore.showToastWithOpacity('晒单成功')
          this.isSubmitCompleted = true
          Statistics.onEvent({
            id: 'photos_submit_success',
            label: '发表晒单成功'
          })
        }
        updateCustomerPhotoCenterData()
        updataProductCustomerPhotos(
          customer_photo,
          toteId,
          toteProduct.id,
          isLatest
        )
        DeviceEventEmitter.emit('refreshHomeFloatHover')
        DeviceEventEmitter.emit('onRefreshCustomerPhotosData')
      },
      () => {
        this.setState({ isCreatingCustomerPhoto: false })
      }
    )
  }

  _visitHepler = () => {
    const { navigation } = this.props
    this.clickGuide = true
    navigation.push('WebPage', {
      uri: 'https://static.letote.cn/pages/newshow_inroduce/index.html'
    })
  }

  render() {
    const { toteProduct } = this.props.navigation.state.params
    const { isLoading, share_topics, style_tags, share_incentive } = this.state
    const relatedProducts = getRelatedProducts(
      this.state.photos,
      toteProduct.product
    )
    const timeCashAmount = share_incentive && share_incentive.time_cash_amount
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
          keyboardDismissMode={'on-drag'}
          showsVerticalScrollIndicator={false}>
          {isLoading ? (
            <View style={styles.loadingView}>
              <Spinner isVisible size={40} type={'Pulse'} color={'#222'} />
            </View>
          ) : (
            <View style={styles.viewWrapper}>
              <PhotosContainer
                navigation={this.props.navigation}
                photos={this.state.photos}
                updatePhotos={this._updatePhotos}
                onClickCollectionItem={this._onClickCollectionItem}
                taggingCustomerPhotos={this._taggingCustomerPhotos}
                maxLength={this.isStylist ? -1 : 3}
              />
              <ContentContainer
                updateContent={this._updateContent}
                updateTopic={this._updateTopic}
                shareTopics={share_topics}
                onfocus={this._onfocus}
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
                hasBottomLine
              />
              <RelatedProducts
                relatedProducts={relatedProducts}
                lockProduct={toteProduct.product}
              />
            </View>
          )}
        </ScrollView>
        <SubmitButton
          onClick={this._submit}
          style={styles.buttonStyle}
          isCreatingCustomerPhoto={this.state.isCreatingCustomerPhoto}
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
  container: {
    flex: 1
  },
  viewWrapper: {
    paddingTop: 16
  },
  loadingView: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitleViewStyle: { width: '40%' },
  barButtonItemStyle: { width: '30%' },
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
