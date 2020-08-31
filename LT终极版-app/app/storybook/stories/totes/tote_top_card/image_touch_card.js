import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native'
import p2d from '../../../../src/expand/tool/p2d'
import { Experiment, Variant } from '../../../../src/components/ab_testing'

export default class ImageTouchCard extends PureComponent {
  render() {
    const { onClick } = this.props
    return (
      <View style={styles.container}>
        <TouchableOpacity activeOpacity={0.8} onPress={onClick}>
          <Experiment flagName={'new_role_card_in_tote'} defaultValue={1}>
            <Variant value={1}>
              <Image
                style={{ width: p2d(319), height: p2d(93) }}
                source={require('../../../../assets/images/totes/tote_role.png')}
              />
            </Variant>
            <Variant value={2}>
              <Image
                style={{ width: p2d(319), height: p2d(85) }}
                source={require('../../../../assets/images/totes/tote_role_test.png')}
              />
            </Variant>
          </Experiment>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: p2d(12),
    marginHorizontal: p2d(16),
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#f3f3f3',
    elevation: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    backgroundColor: '#FFF'
  }
})
