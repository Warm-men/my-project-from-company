import React, { PureComponent } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  AppState,
  Text,
  Image
} from 'react-native'
import Video from 'react-native-video'
import p2d from '../../../../src/expand/tool/p2d'
const height = Dimensions.get('window').height
export default class ToteStyling extends PureComponent {
  constructor(props) {
    super(props)
    this.listeners = []
  }

  _setInformation = () => {
    this.props.setInformation()
  }
  render() {
    return (
      <View style={styles.container}>
        <Image
          resizeMode="contain"
          style={styles.title}
          source={require('../../../../assets/images/totes/letote.png')}
        />
        <View style={styles.line} />
        <Text style={styles.textDescription}>{'创建你的第一个衣箱'}</Text>
        <Text style={styles.textSubDescription}>
          {'根据你的身材和偏好为你智能推荐衣箱服饰'}
        </Text>
        <Image
          resizeMode="contain"
          style={styles.firstTote}
          source={require('../../../../assets/images/totes/first_tote.png')}
        />

        <TouchableOpacity
          style={styles.buttonView}
          onPress={this._setInformation}>
          <Text style={styles.buttonText}>{'立即开始'}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: height - 150
  },
  title: {
    width: p2d(104),
    height: p2d(16)
  },
  line: {
    width: p2d(16),
    height: 2,
    backgroundColor: '#242424',
    marginTop: 12
  },
  textDescription: {
    fontSize: 16,
    color: '#242424',
    lineHeight: 24,
    marginTop: 16,
    textAlign: 'center',
    fontWeight: '500'
  },
  textSubDescription: {
    fontSize: 12,
    color: '#989898',
    marginTop: 12
  },
  firstTote: {
    marginTop: 24,
    marginBottom: 20,
    width: p2d(264),
    height: p2d(226)
  },
  buttonView: {
    marginTop: 20,
    width: 164,
    height: 44,
    backgroundColor: '#EA5C39',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 14,
    color: '#FFF'
  }
})
