import React, { PureComponent } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { SizeButton } from '../style'
export default class PickerMeSizeCircular extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      width: 0
    }
  }
  render() {
    const {
      title,
      dataType,
      data,
      size,
      sizeChange,
      disabled,
      numColumns
    } = this.props
    let style = { width: this.state.width / (numColumns || 5) }
    return (
      <View
        style={styles.container}
        onLayout={event => {
          var { width } = event.nativeEvent.layout
          this.setState({ width })
        }}>
        {title && <Text style={styles.blackText}>{title}</Text>}
        <View>
          <SizeButton
            style={style}
            dataType={dataType}
            sizeArray={data}
            size={size}
            disabled={disabled}
            onPress={sizeChange}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20
  },
  blackText: {
    color: '#333333',
    fontSize: 14,
    marginBottom: 15
  }
})
