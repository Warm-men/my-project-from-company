import React, { PureComponent } from 'react'
import { StyleSheet, Dimensions, ScrollView } from 'react-native'

import { SafeAreaView } from '../../../../storybook/stories/navigationbar'
import BottomButton from './me_style_bottom_button'
import MeStyleCommonTitle from '../../../../storybook/stories/account/me_style_common_title'
import { AttributePreferences } from '../../../../storybook/stories/account'

export default class MeStylePersonality extends PureComponent {
  constructor(props) {
    super(props)
    const array = props.deafultTypes.map(item => {
      return item.name
    })
    this.state = {
      selectedType: array,
      isDone: false
    }
  }
  UNSAFE_componentWillMount() {
    this.isDone()
  }
  isDone = () => {
    if (!this.state.selectedType.length) {
      this.setState({
        isDone: false
      })
      return
    }
    this.setState({
      isDone: true
    })
  }
  _next = () => {
    if (this.state.isDone) {
      const style = {
        preferences: this.state.selectedType
      }
      if (!this.isFinishedUpdate) {
        this.isFinishedUpdate = true
        this.props.updateAttributePreferences(style)
      }
      setTimeout(() => {
        this.isFinishedUpdate = false
      }, 300)
    }
  }

  didSelectedAttributePreferences = items => {
    this.setState({ selectedType: items }, () => {
      this.isDone()
    })
  }
  render() {
    return (
      <SafeAreaView>
        <ScrollView
          style={styles.container}
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}>
          <MeStyleCommonTitle
            titleText={'个性'}
            descriptText={
              '选择你喜欢的品类，这只是个开始，我们会帮助你发现时尚真我'
            }
            style={styles.meStyleCommonTitle}
            step={'6/6'}
            showStep={true}
          />
          <AttributePreferences
            defaultTypes={this.state.selectedType}
            didSelectedType={this.didSelectedAttributePreferences}
          />
        </ScrollView>
        <BottomButton
          goback={this.props.goback}
          next={this._next}
          isDone={this.state.isDone}
          nextText={'完成定制'}
        />
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 20,
    width: Dimensions.get('window').width
  },
  meStyleCommonTitle: {
    marginHorizontal: 40
  }
})
