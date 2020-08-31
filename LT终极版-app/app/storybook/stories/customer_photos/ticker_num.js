import React, { Component } from 'react'
import { Animated, Easing, StyleSheet, Text, View } from 'react-native'
import PropTypes from 'prop-types'

const NumberTicker = ({
  style,
  textSize = 13,
  textStyle,
  number,
  duration
}) => {
  const mapToDigits = () => {
    return (number + '').split('').map(data => {
      var reg = new RegExp('^[0-9]*$')
      if (!reg.test(data)) {
        return (
          <Text key={data} style={[textStyle, { fontSize: textSize }]}>
            {data}
          </Text>
        )
      }
      return (
        <TextTicker
          key={data}
          textSize={textSize}
          textStyle={textStyle}
          targetNumber={parseFloat(data, 10)}
          duration={duration}
        />
      )
    })
  }

  return (
    <View style={style}>
      <View style={{ flexDirection: 'row' }}>{mapToDigits()}</View>
    </View>
  )
}

class TextTicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      animatedValue: new Animated.Value(0),
      isAnimating: true,
      delay: 800,
      number: 1
    }
    const { targetNumber } = this.props
    for (let i = 0; i <= targetNumber; i++) {
      this.numberList.push({ id: i })
    }
  }

  componentDidMount() {
    this.startAnimation()
  }

  numberList = []

  startAnimation = () => {
    const { animatedValue } = this.state
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: this.props.duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true
    }).start()
  }

  getInterpolatedVal = val => {
    return val.interpolate({
      inputRange: [0, 1],
      outputRange: [this.props.textSize * this.numberList.length, 0],
      extrapolate: 'clamp'
    })
  }

  renderNumbers = styles => {
    return this.numberList.map(data => {
      return (
        <Text key={data.id} style={[this.props.textStyle, styles.text]}>
          {data.id}
        </Text>
      )
    })
  }

  render() {
    const { animatedValue } = this.state
    const styles = generateStyles(this.props.textSize)

    return (
      <View style={styles.container}>
        <Animated.View
          style={{
            transform: [{ translateY: this.getInterpolatedVal(animatedValue) }]
          }}>
          {this.renderNumbers(styles)}
        </Animated.View>
      </View>
    )
  }
}

TextTicker.defaultProps = {
  duration: 1800,
  targetNumber: 7,
  movingDown: true,
  textSize: 35
}

TextTicker.propTypes = {
  duration: PropTypes.number,
  targetNumber: PropTypes.number,
  movingDown: PropTypes.bool,
  textSize: PropTypes.number,
  textStyle: PropTypes.any
}

const generateStyles = textSize =>
  StyleSheet.create({
    container: {
      width: textSize * 0.62,
      height: textSize,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'flex-end'
    },
    text: {
      fontSize: textSize,
      lineHeight: textSize,
      textAlign: 'center'
    }
  })

export default NumberTicker
