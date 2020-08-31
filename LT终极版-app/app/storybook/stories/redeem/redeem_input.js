/* @flow */

import React, { PureComponent } from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text
} from 'react-native'
import p2d from '../../../src/expand/tool/p2d'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LinkText from '../../../storybook/stories/link_text'
const instructions = [
  '输入兑换码点击确认兑换，即完成激活；',
  '请在有效期内激活使用，过期作废，不可退款；',
  '请妥善保管兑换码, 若发生盗用、遗失、泄露等问题不予调换与退款；',
  '确认兑换即视为同意《用户服务协议》内容。'
]
export default class RedeemInput extends PureComponent {
  _onChangeText = text => {
    this.props.onChangeText(text)
  }
  openWebPage = () => {
    this.props.navigation.navigate('WebPage', {
      uri: 'https://wechat.letote.cn/agreement',
      title: '托特衣箱用户服务协议',
      hideShareButton: true
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView>
          <View style={styles.containerWrap}>
            <View style={styles.titleView}>
              <Text style={styles.titleText}>{'兑换码'}</Text>
              <TextInput
                style={styles.textInput}
                placeholderTextColor={'#CCC'}
                autoCorrect={false}
                value={this.props.code}
                underlineColorAndroid={'transparent'}
                placeholder={'请输入券码'}
                onChangeText={this._onChangeText}
              />
            </View>
            <View style={styles.instructions}>
              <Text style={styles.instructionsTitle}>{'兑换须知'}</Text>
              <View style={styles.instructionView}>
                {instructions.map((item, index) => {
                  return (
                    <View
                      style={styles.instructionItemView}
                      key={index.toString()}>
                      <Text style={styles.instructionItem}>
                        {index + 1 + '、'}
                      </Text>
                      <LinkText
                        openWebPage={this.openWebPage}
                        style={styles.instructionItem}>
                        {item}
                      </LinkText>
                    </View>
                  )
                })}
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <TouchableOpacity
          style={styles.comfirmButton}
          onPress={this.props.comfirm}>
          <Text style={styles.comfirmText}>{'确认兑换'}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
  containerWrap: {
    paddingHorizontal: p2d(20)
  },
  titleView: {
    marginTop: p2d(36),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F3F3'
  },
  titleText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600'
  },
  textInput: {
    marginTop: p2d(22),
    fontSize: 18,
    height: 50,
    letterSpacing: 0.4
  },
  instructions: {
    marginTop: p2d(36),
    paddingRight: p2d(20)
  },
  instructionsTitle: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600'
  },
  instructionView: {
    marginTop: p2d(12)
  },
  instructionItemView: {
    justifyContent: 'flex-start',
    flexDirection: 'row'
  },
  instructionItem: {
    fontSize: 14,
    color: '#666',
    lineHeight: p2d(28)
  },
  comfirmButton: {
    height: p2d(40),
    marginHorizontal: p2d(15),
    marginBottom: p2d(10),
    backgroundColor: '#EA5C39'
  },
  comfirmText: {
    color: '#FFF',
    fontSize: 14,
    flex: 1,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: p2d(40)
  }
})
