import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
export default class MeStyleCity extends PureComponent {
  _next = () => {
    this.props.isDone && this.props.next()
  }
  _goback = () => {
    this.props.goback()
  }
  render() {
    return (
      <View style={styles.buttonView}>
        <TouchableOpacity style={styles.backButton} onPress={this._goback}>
          <Text style={styles.backText}>{'上一步'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={this.props.isDone ? styles.doneButton : styles.unDoneButton}
          onPress={this._next}>
          <Text style={styles.nextText}>{this.props.nextText}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  buttonView: {
    flexDirection: 'row',
    height: 60,
    width: '100%',
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  unDoneButton: {
    height: 40,
    flex: 1,
    backgroundColor: '#F8CFC4',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5
  },
  doneButton: {
    height: 40,
    flex: 1,
    backgroundColor: '#EA5C39',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5
  },
  backButton: {
    height: 40,
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#EA5C39'
  },
  nextText: {
    fontSize: 14,
    color: '#FFFFFF'
  },
  backText: {
    fontSize: 14,
    color: '#EA5C39'
  }
})
