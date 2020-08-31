import React, { PureComponent } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import Title from './title'
import PickerMeSizeCircular from '../picker_me_size_circular'
import {
  JEAN_SIZES_WITH_UNKNOW,
  JEAN_WAIST_FIT
} from '../../../../src/expand/tool/size/size'
import p2d from '../../../../src/expand/tool/p2d'

export default class SizeJeanSize extends PureComponent {
  constructor(props) {
    super(props)
    const { jean_size, jean_size_unknow, jean_waist_fit } = props.style
    this.state = {
      style: {
        jeanSize: jean_size_unknow || jean_size,
        jeanWaistFit: jean_waist_fit
      }
    }
  }

  sizeChange = value => {
    if (value.data) {
    }
    let style = {}
    if (this.state.style[value.dataType] !== value.data) {
      let values = value.data
      style[value.dataType] = values
      let newStyle = { ...this.state.style, ...style }
      this.setState({ style: newStyle })
    }
  }
  isDone = () => {
    const { jeanSize, jeanWaistFit } = this.state.style
    return jeanSize && (jeanSize === 'Unknow' || jeanWaistFit)
  }

  updateData = updateStyle => {
    const { jeanSize, jeanWaistFit } = this.state.style
    if (this.isDone()) {
      if (this.needToRefresh()) {
        let style
        if (jeanSize === 'Unknow') {
          style = {
            jean_size_unknow: 'Unknow',
            jean_size: null,
            jean_waist_fit: null
          }
        } else {
          style = {
            jean_size: parseInt(jeanSize),
            jean_waist_fit: jeanWaistFit,
            jean_size_unknow: null
          }
        }
        updateStyle(style)
      }
      return 'CREAT_FIRST_TOTE'
    } else {
      return false
    }
  }

  needToRefresh = () => {
    const { jeanSize, jeanWaistFit } = this.state.style
    const { jean_size, jean_waist_fit } = this.props.style
    return jeanSize !== jean_size || jeanWaistFit !== jean_waist_fit
  }

  getSizeData = () => {
    let data = {}
    const { jeanSize } = this.state.style
    if (jeanSize) {
      JEAN_SIZES_WITH_UNKNOW.map(item => {
        if (item.type === jeanSize) {
          data = item
        }
      })
    }
    return data
  }
  render() {
    const { jeanSize, jeanWaistFit } = this.state.style
    const data = this.getSizeData()
    const showView = jeanSize && jeanSize !== 'Unknow'
    return (
      <View>
        <Title style={styles.title} title={'牛仔裤常穿哪个尺码？'} />
        <PickerMeSizeCircular
          size={jeanSize}
          sizeChange={this.sizeChange}
          dataType={'jeanSize'}
          data={JEAN_SIZES_WITH_UNKNOW}
        />
        {showView && (
          <Text style={styles.text}>
            {`${jeanSize}码≈ ${data.size}码，${
              data.standard ? `国标${data.standard}，` : ''
            }腰围${data.waist}cm，臀围${data.hip}cm`}
          </Text>
        )}

        {showView && (
          <Title style={styles.title} title={'这个尺码的腰部松紧效果如何？'} />
        )}
        {showView && (
          <PickerMeSizeCircular
            numColumns={3}
            size={jeanWaistFit}
            sizeChange={this.sizeChange}
            dataType={'jeanWaistFit'}
            data={JEAN_WAIST_FIT}
          />
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    color: '#242424',
    fontWeight: '500'
  },
  text: {
    marginTop: 5,
    backgroundColor: '#F7F7F7',
    fontSize: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    color: '#5E5E5E'
  }
})
