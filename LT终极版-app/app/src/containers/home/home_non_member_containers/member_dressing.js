/* @flow */
import React, { Component } from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { SERVICE_TYPES, QNetwork } from '../../../expand/services/services.js'
import { NonMemberCommonTitle } from '../../../../storybook/stories/home/titleView'
import p2d from '../../../expand/tool/p2d'
import MemberDressingItem from '../../../../storybook/stories/member_dressing/member_dressing_item'

export default class MemberDressing extends Component {
  constructor(props) {
    super(props)
    this.state = { exhibitingTotes: [] }
    this.variable = { page: 1, perPage: 1 }
  }

  componentDidMount() {
    this._getRecommendTote()
  }

  _getRecommendTote = () => {
    QNetwork(
      SERVICE_TYPES.memberDressing.QUERY_MEMBER_DRESSING,
      this.variable,
      response => {
        if (response.data.exhibiting_totes) {
          this.setState({ exhibitingTotes: response.data.exhibiting_totes })
        }
      }
    )
  }

  _more = () => this.props.navigation.navigate('MemberDressingList')

  render() {
    const { titleText, navigation } = this.props
    const { exhibitingTotes } = this.state
    if (!exhibitingTotes.length) {
      return null
    }
    return (
      <View style={styles.contianer}>
        <NonMemberCommonTitle title={titleText} />
        {exhibitingTotes.map((item, index) => {
          return (
            <MemberDressingItem
              key={index}
              exhibitingTote={item}
              currentColunm={'home'}
              navigation={navigation}
            />
          )
        })}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.buttonView}
          onPress={this._more}>
          <Text style={styles.moreText}>{'查看更多'}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  contianer: {
    marginTop: 19
  },
  buttonView: {
    marginHorizontal: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#F3F3F3',
    height: p2d(48),
    justifyContent: 'center',
    alignItems: 'center'
  },
  moreText: {
    fontSize: 14,
    color: '#242424'
  }
})
