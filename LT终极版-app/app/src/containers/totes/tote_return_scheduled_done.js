import React, { PureComponent } from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import {
  SafeAreaView,
  NavigationBar
} from '../../../storybook/stories/navigationbar'
import Image from '../../../storybook/stories/image'
import p2d from '../../expand/tool/p2d'

class TotesReturnScheduledDone extends PureComponent {
  _goBack = () => {
    this.props.navigation.navigate('Totes')
  }
  _rating = () => {
    const { navigation } = this.props
    const { tote } = navigation.state.params
    navigation.replace('ToteRatingDetails', { tote })
  }
  render() {
    const { return_warn } = this.props.navigation.state.params
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar title="预约完成" />
        <View style={styles.container}>
          <View>
            <View style={styles.topView}>
              <Image
                style={styles.done}
                source={require('../../../assets/images/totes/done.png')}
              />
              <Text style={styles.textView}>预约归还成功</Text>
              {!!return_warn ? (
                <Text style={styles.returnWarn}>{return_warn}</Text>
              ) : null}
            </View>
            <TouchableOpacity
              style={styles.doneBannerTouch}
              onPress={this._rating}
              activeOpacity={0.85}>
              <Image
                style={styles.doneBanner}
                source={require('../../../assets/images/totes/done_banner.png')}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.backButton} onPress={this._goBack}>
            <Text style={styles.backText}>返回衣箱</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
  topView: {
    paddingTop: p2d(54),
    justifyContent: 'center',
    alignItems: 'center'
  },
  textView: {
    fontWeight: '500',
    fontSize: 18,
    color: '#242424',
    marginTop: 17
  },
  done: {
    width: p2d(64),
    height: p2d(64)
  },
  doneBannerTouch: {
    marginTop: 54,
    alignItems: 'center'
  },
  doneBanner: {
    width: p2d(335),
    height: p2d(105),
    borderRadius: 3
  },
  backButton: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 42
  },
  backText: {
    fontSize: 14,
    color: '#242424'
  },
  returnWarn: {
    width: 230,
    color: '#989898',
    fontSize: 13,
    letterSpacing: 0.4,
    lineHeight: 21,
    marginTop: 12,
    textAlign: 'center',
    marginBottom: -10
  }
})

export default TotesReturnScheduledDone
