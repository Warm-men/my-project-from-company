import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity, Text } from 'react-native'
import p2d from '../../../src/expand/tool/p2d'
import Image from '../image'
import { inject, observer } from 'mobx-react'
@inject('modalStore')
@observer
export default class StyleTipsCard extends Component {
  constructor(props) {
    super(props)
  }

  hideView = () => {
    this.props.modalStore.hide()
  }

  buttonOnpress = () => {
    const { buttonOnpress, modalStore } = this.props
    buttonOnpress && buttonOnpress()
    modalStore.hide()
  }

  returnText = () => {
    const { value, min, max, type, number } = this.props
    const status = value === 'tight' ? '偏紧' : '偏松'
    const name = type === 'bust' ? '胸围' : type === 'waist' ? '腰围' : '臀围'
    return `这件商品${name}${min}cm-${max}cm，你的${name}${number}cm，如果穿着${status}，可能是你的尺码有误哦，`
  }

  render() {
    const { title, buttontitle, type } = this.props
    return (
      <TouchableOpacity style={styles.overlay} onPress={this.hideView}>
        <TouchableOpacity style={styles.view} activeOpacity={1}>
          <TouchableOpacity style={styles.delIconView} onPress={this.hideView}>
            <Image
              style={styles.delIcon}
              source={require('../../../assets/images/totes/del_icon.png')}
            />
          </TouchableOpacity>
          <Text style={styles.title}>
            {type ? this.returnText() : title}
            <Text style={styles.buttontitle} onPress={this.buttonOnpress}>
              {buttontitle} >
            </Text>
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)',
    alignItems: 'center'
  },
  view: {
    position: 'absolute',
    bottom: p2d(60),
    width: p2d(345),
    paddingLeft: p2d(24),
    paddingBottom: p2d(24),
    backgroundColor: '#fff',
    elevation: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4
  },
  delIconView: {
    alignSelf: 'flex-end',
    height: p2d(32),
    width: p2d(32),
    justifyContent: 'center',
    alignItems: 'center'
  },
  delIcon: {
    height: p2d(16),
    width: p2d(16)
  },
  title: {
    fontSize: 12,
    color: '#5E5E5E',
    lineHeight: p2d(22),
    marginRight: p2d(24)
  },
  buttontitle: {
    color: '#EA5C39'
  }
})
