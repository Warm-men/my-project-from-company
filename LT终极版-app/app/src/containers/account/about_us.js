/* @flow */

import React, { Component } from 'react'
import { View, StyleSheet, ScrollView, Text } from 'react-native'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'
import UserProfileItem from '../../../storybook/stories/account/user_profile_item'
import SharePanel from '../common/SharePanel'
import ImageView from '../../../storybook/stories/image'
import LinkText from '../../../storybook/stories/link_text'
import { inject } from 'mobx-react'

@inject('appStore', 'panelStore')
export default class AboutUsContainer extends Component {
  _goBack = () => {
    this.props.navigation.goBack()
  }
  _share = () => {
    this.props.panelStore.show(
      <SharePanel url={'https://wechat.letote.cn/'} notNeedReferral={true} />
    )
  }
  openUserAgreement = () => {
    this.props.navigation.navigate('WebPage', {
      uri: 'https://wechat.letote.cn/agreement',
      title: '托特衣箱用户服务协议',
      hideShareButton: true
    })
  }
  openFeedback = () => {
    this.props.navigation.navigate('Feedback')
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          hasBottomLine={false}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <Text style={styles.title}>关于我们</Text>
          <View style={styles.viewContainer}>
            <ImageView
              style={styles.image}
              source={require('../../../assets/images/logo/logo_with_font.png')}
            />
            <Text style={styles.textName}>
              v{this.props.appStore.currentVersion}
            </Text>
          </View>
          <UserProfileItem leftStr={'意见反馈'} onPress={this.openFeedback} />
          <UserProfileItem leftStr={'分享好友'} onPress={this._share} />
          <UserProfileItem
            leftStr={'用户服务协议'}
            onPress={this.openUserAgreement}
          />
          <View style={styles.textViewContainer}>
            <LinkText style={styles.textInfo}>
              {`客服电话:  400-807-0088  (周一到周日9:00-22:00)
官方微信:  LeTote托特衣箱`}
            </LinkText>
            <Text style={styles.textCopyright}>
              ©2017-2019 莱尔托特 All Rights Reserved
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  viewContainer: {
    alignItems: 'center'
  },
  textViewContainer: {
    paddingHorizontal: 20,
    marginTop: 27
  },
  image: {
    height: 122,
    width: 91,
    marginTop: 40,
    marginBottom: 12
  },
  textName: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 40,
    fontSize: 13,
    lineHeight: 17
  },
  textInfo: {
    color: '#999999',
    fontSize: 13,
    lineHeight: 30,
    fontWeight: '400'
  },
  title: {
    marginTop: 25,
    marginLeft: 20,
    fontSize: 24,
    color: '#333333',
    fontWeight: '600'
  },
  textCopyright: {
    width: '100%',
    textAlign: 'center',
    color: '#999999',
    fontSize: 9,
    marginTop: 82,
    paddingBottom: 40
  }
})
