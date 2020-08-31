/* @flow */

import React, { PureComponent } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import Accordion from 'react-native-collapsible/Accordion'
import ImageView from '../../../storybook/stories/image'

export default class QuestionsComponent extends PureComponent {
  render() {
    const { onFocusType, didSelectedItem, faqData } = this.props
    const { questionsData, questionsCategory } = faqData
    return (
      <View style={styles.flexDirectionRow}>
        <View style={styles.left}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            {questionsCategory.map((item, index) => {
              const isFocus = item.type === onFocusType
              return (
                <TitleCell
                  title={item.title}
                  key={index}
                  type={item.type}
                  isFocus={isFocus}
                  didSelected={didSelectedItem}
                />
              )
            })}
          </ScrollView>
        </View>
        <View style={styles.right}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            <QuestionCell type={onFocusType} questionsData={questionsData} />
          </ScrollView>
        </View>
      </View>
    )
  }
}

class TitleCell extends PureComponent {
  _didSelectedItem = () => {
    const { didSelected, type } = this.props
    didSelected(type)
  }
  render = () => {
    const { title, isFocus } = this.props
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={isFocus ? styles.textViewOnFocus : styles.textView}
        onPress={this._didSelectedItem}>
        <Text style={isFocus ? styles.onFocusText : styles.text}>{title}</Text>
      </TouchableOpacity>
    )
  }
}

class QuestionCell extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { activeSectionIndex: false }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.type !== nextProps.type) {
      this.setState({ activeSectionIndex: false })
    }
  }
  _renderHeader(section, index, isActive) {
    return (
      <View
        transition="backgroundColor"
        key={index}
        style={[styles.header, index !== 0 && styles.headerBorder]}>
        <View style={styles.container}>
          <Text style={styles.headerText}>{section.title}</Text>
        </View>
        <ImageView
          source={require('../../../assets/images/sizeTutorial/arrow.png')}
          style={isActive && styles.arrow}
        />
      </View>
    )
  }
  _renderContent = section => {
    return section.content.map((item, index) => {
      return (
        <View key={index} style={styles.contentView}>
          <Text style={styles.contentText}>{item}</Text>
        </View>
      )
    })
  }
  render() {
    const { type, questionsData } = this.props
    return (
      <View style={styles.accordion}>
        <Accordion
          sections={questionsData[type]}
          renderHeader={this._renderHeader}
          renderContent={this._renderContent}
          onChange={activeSectionIndex => {
            this.setState({ activeSectionIndex })
          }}
          activeSection={this.state.activeSectionIndex}
          underlayColor={'#FFF'}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  flexDirectionRow: {
    flex: 1,
    flexDirection: 'row'
  },
  left: {
    width: 110,
    backgroundColor: '#F7F7F7'
  },
  right: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  textViewOnFocus: {
    flexDirection: 'row',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#FFF',
    backgroundColor: '#FFF',
    borderLeftWidth: 4,
    borderLeftColor: '#EA5C39'
  },
  straightLine: {
    width: 4,
    height: 61,
    backgroundColor: '#EA5C39'
  },
  textView: {
    flexDirection: 'row',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#FFF',
    backgroundColor: '#F7F7F7'
  },
  text: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 16,
    color: '#000'
  },
  onFocusText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 16,
    color: '#EA5C39'
  },
  rightContainer: {
    flex: 1,
    paddingHorizontal: 15
  },
  header: {
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF'
  },
  headerBorder: {
    borderTopColor: '#F2F2F2',
    borderTopWidth: 1,
    backgroundColor: '#FFF'
  },
  headerText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
    marginRight: 10,
    lineHeight: 17
  },
  arrow: {
    transform: [{ rotate: '-180deg' }]
  },
  contentView: {
    flex: 1,
    flexDirection: 'row',
    marginRight: 20,
    marginLeft: 10,
    marginBottom: 10
  },
  contentText: {
    fontSize: 11,
    color: '#666666',
    lineHeight: 16
  },
  accordion: {
    marginHorizontal: 15
  }
})
