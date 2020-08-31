import React, { PureComponent } from 'react'
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native'
import p2d from '../../../src/expand/tool/p2d'
export default class RuleTipsView extends PureComponent {
  hasRule = () => {
    const { changeHasRule } = this.props
    changeHasRule && changeHasRule(true)
  }
  noRule = () => {
    const { changeHasRule } = this.props
    changeHasRule && changeHasRule(false)
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.containerView}>
          <Text style={styles.headerText}>请使用卷尺测量填写</Text>
          <Text style={styles.textDescription}>
            只有提供准确的个人身材数据，智能尺码推荐才会更精准，选码无忧更省心
          </Text>
          <View style={styles.tipsView}>
            <Text style={styles.tipsText}>
              *首个衣箱会赠送卷尺，也可签收后再来测量
            </Text>
          </View>
          <View style={styles.buttonView}>
            <TouchableOpacity style={styles.button} onPress={this.noRule}>
              <Text style={styles.buttonText}>我没卷尺</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={this.hasRule}>
              <Text style={styles.buttonText}>我有卷尺</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'rgba(0,0,0, 0.5)'
  },
  containerView: {
    backgroundColor: '#fff',
    paddingVertical: p2d(32),
    borderRadius: 6,
    width: p2d(313),
    alignItems: 'center',
    paddingHorizontal: p2d(26)
  },
  headerText: {
    fontSize: 16,
    color: '#242424',
    fontWeight: '700'
  },
  textDescription: {
    fontSize: 14,
    color: '#5e5e5e',
    lineHeight: 22,
    textAlign: 'center',
    marginTop: p2d(12)
  },
  tipsView: {
    backgroundColor: '#FFF5F4',
    padding: p2d(6),
    borderRadius: 4,
    marginTop: p2d(8),
    marginBottom: p2d(16)
  },
  tipsText: {
    fontSize: 12,
    color: '#5e5e5e',
    lineHeight: 20
  },
  buttonView: {
    flexDirection: 'row'
  },
  button: {
    borderWidth: 1,
    borderColor: '#E85C40',
    borderRadius: 22,
    paddingHorizontal: p2d(32),
    paddingVertical: p2d(10),
    marginHorizontal: p2d(8)
  },
  buttonText: {
    fontSize: p2d(14),
    color: '#E85C40'
  }
})
