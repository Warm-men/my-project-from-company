import React, { Component, PureComponent } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  BackHandler,
  Text
} from 'react-native'
import {
  SafeAreaView,
  NavigationBar
} from '../../../storybook/stories/navigationbar'
import p2d from '../../expand/tool/p2d'
import RatingStar from '../../../storybook/stories/rate/rating_star'
import { SERVICE_TYPES, Mutate } from '../../expand/services/services'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'

import { inject } from 'mobx-react'
@inject('appStore')
export default class RateToteSwapContainer extends Component {
  constructor(props) {
    super(props)
    const { questionnaire } = props.navigation.state.params
    this.state = { reason: '', rating: 0, questionnaire: [], isSubmit: false }

    this.reasons = questionnaire.options
    this.maxQuestionnaireLength = 3
  }

  setRatingNum = rating => {
    const data = { rating }
    if (rating > 3) {
      data.questionnaire = []
      data.reason = ''
    }
    this.setState(data)
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
    return true
  }

  _didSelectedTheReason = reason => {
    let questionnaire = [...this.state.questionnaire]
    let findIndex = questionnaire.findIndex(item => {
      return item.key === reason.key
    })
    if (findIndex === -1) {
      if (questionnaire.length < this.maxQuestionnaireLength) {
        questionnaire.push(reason)
      } else {
        questionnaire.splice(questionnaire.length - 1, 1, reason)
      }
    } else if (findIndex > -1) {
      questionnaire.splice(findIndex, 1)
    }
    this.setState({ questionnaire })
  }

  _submitToteSwapQuestionnaire = () => {
    if (this.state.isSubmit) {
      return
    }
    const { appStore, navigation } = this.props
    const { id } = navigation.state.params
    const { questionnaire, rating, reason } = this.state
    if (rating < 4) {
      if (rating === 0) {
        appStore.showToastWithOpacity('请选择选衣下单体验满意度')
        return
      }
      if (!(reason.length !== 0 || questionnaire.length !== 0)) {
        appStore.showToastWithOpacity('请选择选衣时遇到的问题')
        return
      }
    }
    this.setState({ isSubmit: true }, () => {
      let options = []
      questionnaire.map(item => {
        options.push(item.key)
      })
      let input = {
        options,
        rating_level: rating,
        user_custom: reason,
        tote_id: id
      }
      Mutate(
        SERVICE_TYPES.rating.MUTATION_SUBMIT_TOTE_SWAP_QUESTIONNAIRE,
        { input },
        response => {
          const { SubmitToteSwapQuestionnaire } = response.data
          if (SubmitToteSwapQuestionnaire.success) {
            appStore.showToast('感谢反馈', 'success')
            navigation.navigate('ToteLockSuccess')
          } else {
            if (SubmitToteSwapQuestionnaire.error) {
              appStore.showToast(SubmitToteSwapQuestionnaire.error, 'error')
            }
            this.setState({ isSubmit: false })
          }
        },
        () => {
          this.setState({ isSubmit: false })
        }
      )
    })
  }
  _onChangeText = reason => {
    this.setState({ reason })
  }
  render() {
    const { questionnaire } = this.props.navigation.state.params
    const { theme_question, improvement_question } = questionnaire

    const isDisplayReasons = !!this.state.rating && this.state.rating <= 3
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar hasBottomLine={false} />
        <KeyboardAwareScrollView
          style={styles.container}
          keyboardOpeningTime={0}
          showsVerticalScrollIndicator={false}>
          <View style={styles.contentView}>
            <View
              style={[
                styles.ratingStar,
                !isDisplayReasons && { marginTop: p2d(200) }
              ]}>
              <Text style={styles.subTitle}>{theme_question}</Text>
              <RatingStar defaultRating={0} setRatingNum={this.setRatingNum} />
            </View>
            {isDisplayReasons && (
              <View style={styles.reasons}>
                <Text style={styles.subTitle}>{improvement_question}</Text>
                <ReasonsView
                  reasons={this.reasons}
                  selectedReasons={this.state.questionnaire}
                  didSelectedItem={this._didSelectedTheReason}
                />
                <View style={styles.inputView}>
                  <TextInput
                    style={styles.textInput}
                    placeholderTextColor={'#989898'}
                    maxLength={150}
                    multiline={true}
                    autoCorrect={false}
                    value={this.state.reason}
                    textAlignVertical={'top'}
                    underlineColorAndroid={'transparent'}
                    placeholder={'还有其他问题也可以在这里告诉我们'}
                    onChangeText={this._onChangeText}
                  />
                  <Text style={styles.wordNum}>
                    {this.state.reason.length}/150
                  </Text>
                </View>
              </View>
            )}
          </View>
        </KeyboardAwareScrollView>
        <TouchableOpacity
          onPress={this._submitToteSwapQuestionnaire}
          style={styles.submitButton}>
          {this.state.isSubmit && (
            <Spinner size={10} type={'FadingCircle'} color={'#FFF'} />
          )}
          <Text style={styles.submitText}>提交</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }
}

export class ReasonsView extends PureComponent {
  _didSelectedItem = value => {
    const { didSelectedItem } = this.props
    didSelectedItem && didSelectedItem(value)
  }

  render() {
    const { reasons, selectedReasons } = this.props
    return (
      <View style={styles.labelView}>
        {reasons.map((item, index) => {
          const isSelected = !!selectedReasons.find(reason => {
            return reason.key === item.key
          })
          return (
            <Item
              item={item}
              isSelected={isSelected}
              key={index}
              didSelectedItem={this._didSelectedItem}
            />
          )
        })}
      </View>
    )
  }
}

export class Item extends PureComponent {
  _onPress = () => {
    const { didSelectedItem, item } = this.props
    didSelectedItem && didSelectedItem(item)
  }

  render() {
    const { item, isSelected } = this.props
    return (
      <TouchableOpacity
        style={[
          styles.labelItem,
          isSelected ? styles.selectLabelItem : styles.unSelectLabelItem
        ]}
        activeOpacity={0.85}
        onPress={this._onPress}>
        <Text
          style={[
            styles.labelItemText,
            isSelected ? styles.selectLabelText : styles.unSelectLabelText
          ]}>
          {item.value}
        </Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentView: { flex: 1, paddingHorizontal: 20, marginTop: 20 },

  ratingStar: { alignItems: 'center', justifyContent: 'center' },
  reasons: { width: '100%', alignItems: 'center' },

  subTitle: {
    fontSize: 16,
    color: '#242424',
    fontWeight: '600',
    letterSpacing: 0.6
  },

  submitButton: {
    height: 44,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 2,
    backgroundColor: '#EA5C39',
    justifyContent: 'center',
    alignItems: 'center'
  },
  submitText: { fontSize: 14, color: '#fff' },

  labelView: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 24
  },
  labelItem: {
    paddingVertical: 9,
    width: '100%',
    borderRadius: 20,
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12
  },
  labelItemText: { marginHorizontal: p2d(14), fontSize: 14, lineHeight: 20 },

  selectLabelItem: { backgroundColor: '#FDEDE9', borderColor: '#E85C40' },
  unSelectLabelItem: { borderColor: '#ccc' },
  selectLabelText: { color: '#EA5C39' },
  unSelectLabelText: { color: '#5e5e5e' },

  inputView: {
    marginTop: 5,
    marginHorizontal: 26,
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: '100%',
    height: 105,
    backgroundColor: '#F7F7F7'
  },
  textInput: {
    backgroundColor: '#F7F7F7',
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    padding: 0
  },
  wordNum: { alignSelf: 'flex-end', color: '#989898', fontSize: 12 }
})
