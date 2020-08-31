/* @flow */

import React, { PureComponent, Component } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import Image from '../../../../storybook/stories/image'
import p2d from '../../../expand/tool/p2d'
import { NonMemberCommonTitle } from '../../../../storybook/stories/home/titleView'
import { allowToStartLoad } from '../../../expand/tool/url_filter'
import { onClickJoinMember } from '../../../expand/tool/plans/join_member'
import { inject, observer } from 'mobx-react'
import { abTrack } from '../../../components/ab_testing'
const playingToteData = [
  {
    imageUrl: require('../../../../assets/images/home/usage.png'),
    title: '玩法介绍',
    link: 'https://static.letote.cn/pages/homepage_introduce_190812/index.html'
  },
  {
    imageUrl: require('../../../../assets/images/home/wash.png'),
    title: '专业洗护',
    link: 'https://static.letote.cn/kol_activity/homepage_clean_0228/index.html'
  },
  {
    imageUrl: require('../../../../assets/images/home/help.png'),
    title: '常见问题',
    link: 'Helper'
  }
]

@inject('currentCustomerStore')
export default class PlayingToteHome extends PureComponent {
  _bannerOnPress = uri => {
    if (!uri) return

    const { navigation } = this.props
    if (uri === 'Helper') {
      navigation.navigate('Helper')
      return
    }

    const useWebView = allowToStartLoad(uri, navigation)
    if (useWebView) {
      navigation.navigate('WebPage', { uri })
      abTrack('visit_h5', 1)
    }
  }

  _joinMember = () => {
    const { currentCustomerStore, navigation } = this.props
    onClickJoinMember(navigation)
    if (!currentCustomerStore.id) {
      currentCustomerStore.setLoginModalVisible(true)
    } else {
      navigation.navigate('JoinMember')
    }
  }

  render() {
    return (
      <View style={styles.playingView}>
        <NonMemberCommonTitle title={'玩转托特衣箱'} />
        <TitleComponent />
        <View style={styles.flowImageView}>
          <Image
            source={require('../../../../assets/images/home/flow.png')}
            style={styles.flowImage}
          />
        </View>
        <View style={styles.usageView}>
          {playingToteData.map((item, index) => {
            return (
              <PlayingToteItem
                item={item}
                onPress={this._bannerOnPress}
                link={item.link}
                key={index}
              />
            )
          })}
        </View>
        <TouchableOpacity
          style={styles.joinMemberButton}
          onPress={this._joinMember}>
          <Text style={styles.joinMemberText}>加入会员</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

@inject('copyWritingStore')
@observer
class TitleComponent extends Component {
  _getTitle = () => {
    let title = '每箱多至6件衣服+4件配饰 · 衣箱可换 · 顺丰包邮'
    const { non_subscriber_home_page } = this.props.copyWritingStore
    if (non_subscriber_home_page) {
      const { play_tote_title } = non_subscriber_home_page
      if (play_tote_title && play_tote_title.length) {
        title = play_tote_title[0]
      }
    }
    return title
  }
  render() {
    const title = this._getTitle()
    return <Text style={styles.playingDescription}>{title}</Text>
  }
}

class PlayingToteItem extends PureComponent {
  _onPress = () => {
    const { onPress, link } = this.props
    onPress(link)
  }
  render() {
    const { item } = this.props
    return (
      <TouchableOpacity onPress={this._onPress} style={styles.usageItemView}>
        <Image source={item.imageUrl} style={styles.usageImage} />
        <Text style={styles.usageTitle}>{item.title}</Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  playingView: {
    backgroundColor: '#FFF',
    marginHorizontal: p2d(15),
    borderRadius: 5,
    marginTop: p2d(-100),
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f3f3f3',
    shadowColor: '#000',
    shadowOffset: { height: 6, width: 1 },
    shadowRadius: 4,
    shadowOpacity: 0.05
  },
  playingDescription: {
    textAlign: 'center',
    color: '#242424',
    fontSize: 12,
    letterSpacing: 0.5,
    lineHeight: 14
  },
  flowImageView: {
    marginTop: p2d(15),
    flex: 1,
    alignItems: 'center'
  },
  flowImage: {
    width: p2d(280),
    height: p2d(50)
  },
  usageView: {
    marginTop: p2d(24),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: p2d(28)
  },
  usageItemView: {
    alignItems: 'center'
  },
  usageImage: {
    width: p2d(54),
    height: p2d(62)
  },
  usageTitle: {
    color: '#5E5E5E',
    fontSize: 13
  },
  joinMemberButton: {
    marginTop: p2d(24),
    marginHorizontal: p2d(12),
    height: p2d(48),
    backgroundColor: '#EA5C39',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: p2d(30)
  },
  joinMemberText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '600'
  }
})
