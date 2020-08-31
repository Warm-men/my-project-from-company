/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, ScrollView, Text } from 'react-native'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar/index.js'
import Accordion from 'react-native-collapsible/Accordion'
import p2d from '../../../src/expand/tool/p2d'
import Image from '../image'
import {
  SECTIONS,
  MEASUREDATA
} from '../../../src/expand/tool/size/sizeTutorial'

const arrow = require('../../../assets/images/sizeTutorial/arrow.png')
export default class DetailTutorial extends PureComponent {
  _goBack = () => {
    this.props.navigation.goBack()
  }
  _renderHeader(section, index, isActive) {
    return (
      <View
        transition="backgroundColor"
        style={[styles.header, !isActive && styles.headerBoder]}>
        <Text style={styles.headerText}>{section.title}</Text>
        <Image source={arrow} style={isActive && styles.arrow} />
      </View>
    )
  }

  _renderContent(section) {
    if (section.type === 'upperBust') {
      return (
        <View style={styles.content}>
          {section.content.map((item, index) => {
            return (
              <View key={index} style={styles.itemView}>
                <View style={styles.imageWrap}>
                  <Image
                    source={item.image.url}
                    style={{
                      width: p2d(item.image.width),
                      height: p2d(item.image.height)
                    }}
                  />
                </View>
                <View style={styles.description}>
                  {item.description.map((item, i) => {
                    return (
                      <Text key={i} style={styles.descriptionTitle}>
                        {item.title}
                        <Text style={styles.descriptionContent}>
                          {item.content}
                        </Text>
                      </Text>
                    )
                  })}
                </View>
                <View style={styles.standardView}>
                  <View style={styles.justifyContent}>
                    <Text style={styles.restTitle}>
                      {MEASUREDATA[index]['standardTitle']}
                    </Text>
                  </View>
                  {MEASUREDATA[index]['standard'].map(item => {
                    return (
                      <View style={styles.keyItems} key={item.title}>
                        <Text style={styles.keyTitle}>{item.title}</Text>
                        <Text style={styles.keyUnit}>{item.unit}</Text>
                      </View>
                    )
                  })}
                </View>
                <View style={styles.differenceView}>
                  <View style={styles.justifyContent}>
                    <Text style={styles.restTitle}>
                      {MEASUREDATA[index]['rangeTitle']}
                    </Text>
                  </View>
                  {MEASUREDATA[index]['range'].map(item => {
                    return (
                      <View style={styles.keyItems} key={item.value}>
                        <Text style={styles.keyTitle}>{item.value}</Text>
                      </View>
                    )
                  })}
                </View>
              </View>
            )
          })}
          <View style={styles.restView}>
            <Text style={styles.rest}>{section.rest}</Text>
          </View>
        </View>
      )
    }
    return (
      <View style={styles.content}>
        <View style={styles.imageWrap}>
          <Image
            source={section.content.image.url}
            style={{
              width: p2d(section.content.image.width),
              height: p2d(section.content.image.height)
            }}
          />
        </View>
        <Text style={styles.descriptionText}>
          {section.content.description}
        </Text>
      </View>
    )
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          title="测量尺码教程"
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <Accordion
            sections={SECTIONS}
            renderHeader={this._renderHeader}
            renderContent={this._renderContent}
            underlayColor={'#FFF'}
          />
        </ScrollView>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollView: {
    flex: 1,
    paddingTop: 17
  },
  content: {
    paddingBottom: 33
  },
  header: {
    height: 54,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF'
  },
  headerBoder: {
    borderBottomColor: '#F0F0F0',
    borderBottomWidth: 1,
    backgroundColor: '#FFF'
  },
  headerText: {
    fontSize: 14,
    color: '#242424'
  },
  arrow: {
    transform: [{ rotate: '-180deg' }]
  },
  itemView: {
    marginBottom: 40
  },
  imageWrap: {
    alignItems: 'center'
  },
  description: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15
  },
  rest: {
    marginTop: 20,
    lineHeight: 20,
    fontSize: 12,
    color: '#FFF',
    textAlign: 'center',
    paddingHorizontal: 15,
    marginBottom: 18
  },
  standardView: {
    marginHorizontal: 15,
    height: 44,
    backgroundColor: '#EEEEEE',
    flexDirection: 'row'
  },
  differenceView: {
    marginHorizontal: 15,
    paddingVertical: 11,
    backgroundColor: '#F9F9F9',
    flexDirection: 'row'
  },
  justifyContent: {
    justifyContent: 'center',
    marginLeft: 13,
    marginRight: 10
  },
  restTitle: {
    fontSize: 11,
    color: '#242424'
  },
  keyItems: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  keyTitle: {
    fontWeight: '400',
    fontSize: 13,
    color: '#242424',
    lineHeight: 11,
    paddingTop: 4,
    paddingBottom: 3
  },
  keyUnit: {
    fontWeight: '400',
    fontSize: 11,
    color: '#989898',
    lineHeight: 10
  },
  descriptionTitle: {
    fontSize: 12,
    color: '#242424',
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 10
  },
  descriptionText: {
    marginTop: 20,
    fontSize: 12,
    color: '#5E5E5E',
    textAlign: 'center',
    lineHeight: 20
  },
  descriptionContent: {
    color: '#5E5E5E'
  },
  restView: {
    flex: 1,
    marginHorizontal: 15,
    height: 50,
    backgroundColor: ' rgba(52,63,93,0.80)',
    justifyContent: 'center',
    alignItems: 'center'
  }
})
