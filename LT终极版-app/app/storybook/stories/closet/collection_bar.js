import React, { PureComponent } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import p2d from '../../../src/expand/tool/p2d'
import ToggleSwitch from '../../../src/expand/tool/toggle_switch'

export default class CollectionBar extends PureComponent {
  render() {
    const { onPressToggleSwitch, inToggleSwitchOn, title } = this.props
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title || '收藏单品'}</Text>
        <View>
          <ToggleSwitch
            isOn={inToggleSwitchOn}
            onColor="#FF8D68"
            offColor="#E0E0E0"
            label="在架优先"
            labelStyle={{ fontSize: 12, color: '#989898' }}
            size="medium"
            onToggle={isOn => {
              onPressToggleSwitch(isOn)
            }}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: p2d(40),
    flexDirection: 'row',
    marginHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 13
  },
  title: { fontSize: 18, color: '#242424', fontWeight: '500' }
})
