import React, { PureComponent } from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import Image from '../image'
import { SafeAreaView } from '../navigationbar'

export default class BuyClothesGuide extends PureComponent {
  render() {
    const { onFinishedGuide, style } = this.props
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={style} onPress={onFinishedGuide}>
          <Image
            style={styles.image}
            source={require('../../../assets/images/guide/buy_clothes_guide.png')}
          />
        </TouchableOpacity>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: { backgroundColor: 'rgba(0,0,0,0.7)', flex: 1 },
  image: { marginLeft: 108, marginTop: 24 }
})
