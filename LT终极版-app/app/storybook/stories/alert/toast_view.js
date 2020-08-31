import React, { PureComponent } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import PropTypes from 'prop-types'
// eslint-disable-next-line
import Spinner from 'react-native-spinkit'
/*
  Example:

  this.props.modalStore.show(
    <ToastView
      message={'内容'}
    />
  )
*/

class ToastView extends PureComponent {
  render() {
    const { message, loadingText, loadingView } = this.props
    return (
      <View style={styles.queryDialog}>
        <View style={loadingView ? loadingView : styles.queryDialogView}>
          <Spinner
            isVisible={true}
            size={15}
            type={'FadingCircleAlt'}
            color={'#FFFFFF'}
          />
          <Text style={loadingText ? loadingText : styles.queryDialogText}>
            {message}
          </Text>
        </View>
      </View>
    )
  }
}

ToastView.propTypes = {
  message: PropTypes.string
}

const styles = StyleSheet.create({
  queryDialog: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  queryDialogView: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    width: 162,
    backgroundColor: '#03050D',
    opacity: 0.8,
    borderRadius: 2,
    paddingHorizontal: 14
  },
  queryDialogText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 9
  }
})
export { ToastView }
