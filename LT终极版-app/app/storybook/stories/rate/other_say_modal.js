import React, { Component } from 'react'
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  Keyboard,
  Platform
} from 'react-native'
import Image from '../image'
import { SafeAreaView } from '../navigationbar'
import p2d from '../../../src/expand/tool/p2d'
class OtherSayModal extends Component {
  constructor(props) {
    super(props)
    const { otherSay } = props
    this.state = { otherSay, focus: false, keyboardHeight: null }
    this.keyboardDidShowListener = null
  }

  componentDidMount() {
    //监听键盘弹出事件
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardWillShow',
      this.keyboardWillShow
    )
  }

  keyboardWillShow = event => {
    this.setState({
      focus: true,
      keyboardHeight: event.endCoordinates.height
    })
  }

  componentWillUnmount() {
    //卸载键盘弹出事件监听
    this.keyboardDidShowListener.remove()
  }

  setOtherSay = () => {
    const { setOtherSay, hideModal } = this.props
    setOtherSay(this.state.otherSay)
    hideModal()
  }

  packUpkey = () => {
    Keyboard.dismiss()
  }

  onBlur = () => {
    this.setState({
      focus: false
    })
  }

  render() {
    const { hideModal } = this.props
    const { focus, keyboardHeight } = this.state
    const isIos = Platform.OS === 'ios'
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={this.packUpkey}
        style={styles.container}>
        <SafeAreaView
          style={[
            styles.safeareaview,
            focus && isIos && { marginBottom: keyboardHeight }
          ]}>
          <ScrollView bounces={false}>
            <View style={styles.titleView}>
              <Text style={styles.title}>我的其他反馈</Text>
              <TouchableOpacity onPress={hideModal} hitSlop={styles.hitSlop}>
                <Image
                  source={require('../../../assets/images/rating/close.png')}
                />
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.textInputView,
                { height: 244, paddingBottom: 24 }
              ]}>
              <TextInput
                style={styles.textInput}
                placeholderTextColor={'#CCC'}
                maxLength={300}
                multiline={true}
                autoCorrect={false}
                value={this.state.otherSay}
                textAlignVertical={'top'}
                underlineColorAndroid={'transparent'}
                placeholder={'请描述下你的问题'}
                onChangeText={otherSay => this.setState({ otherSay })}
                onBlur={this.onBlur}
              />
              <Text style={styles.wordNum}>
                {this.state.otherSay.length}/300
              </Text>
            </View>
            <View style={styles.bottomView}>
              <TouchableOpacity
                style={styles.otherSayModalConfirmButton}
                onPress={this.setOtherSay}>
                <Text style={styles.otherSayModalConfirmButtonText}>确认</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </TouchableOpacity>
    )
  }
}

class SeeOtherSayModal extends Component {
  render() {
    const { hideModal, otherSay } = this.props
    return (
      <View style={styles.container}>
        <View style={styles.otherSayModalContainer}>
          <View style={styles.titleView}>
            <Text style={styles.title}>我的其他反馈</Text>
            <TouchableOpacity hitSlop={styles.hitSlop} onPress={hideModal}>
              <Image
                source={require('../../../assets/images/rating/close.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.textInputView}>
            <Text testID="otherSay" style={{ fontSize: 14, color: '#666' }}>
              {otherSay}
            </Text>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  safeareaview: { backgroundColor: '#fff', paddingHorizontal: 16 },
  otherSayModalContainer: {
    width: '100%',
    paddingHorizontal: p2d(16),
    paddingBottom: p2d(24),
    backgroundColor: '#fff'
  },
  textInputView: {
    padding: p2d(15),
    width: '100%',
    backgroundColor: '#FCFCFC',
    borderWidth: 0.5,
    borderColor: '#EFEFEF'
  },
  textInput: {
    backgroundColor: '#FCFCFC',
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    padding: 0
  },
  wordNum: {
    alignSelf: 'flex-end',
    color: '#989898',
    fontSize: 12
  },
  bottomView: {
    backgroundColor: '#fff',
    borderTopColor: '#F0F0F0',
    borderTopWidth: 1
  },
  otherSayModalConfirmButton: {
    width: p2d(343),
    height: p2d(44),
    backgroundColor: '#E85C40',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: p2d(8)
  },
  otherSayModalConfirmButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600'
  },
  titleView: {
    height: p2d(66),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 18,
    color: '#333',
    fontWeight: '700'
  },
  hitSlop: { top: 20, left: 20, right: 20, bottom: 20 }
})

export { OtherSayModal, SeeOtherSayModal }
