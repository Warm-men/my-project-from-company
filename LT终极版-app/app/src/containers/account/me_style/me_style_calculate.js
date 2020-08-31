import React, { Component } from 'react'
import { DeviceEventEmitter } from 'react-native'
import { inject } from 'mobx-react'
import {
  DRESS_SIZES,
  PANT_SIZES,
  TOP_SIZES_ABBR,
  SKIRT_SIZES,
  JEAN_SIZES,
  calJeanSize
} from '../../../expand/tool/size/size'
import { calSize } from '../../../expand/tool/size/calSize'
import { CustomAlertView } from '../../../../storybook/stories/alert/custom_alert_view'
import { SizeComponent } from '../../../../storybook/stories/style'
@inject('currentCustomerStore', 'modalStore')
export default class MeStyleCalculation extends Component {
  // 通过 state 更新
  constructor(props) {
    super(props)
    const {
      top_size,
      pant_size,
      dress_size,
      jean_size,
      skirt_size
    } = this.props.currentCustomerStore.style
    DRESS_SIZES.map(item => {
      if (item.type === dress_size) {
        this.dressSize = item.name
        this.dressSizeType = item.type
      }
    })
    PANT_SIZES.map(item => {
      if (item.type === pant_size) {
        this.pantSize = item.name
        this.pantSizeType = item.type
      }
    })
    TOP_SIZES_ABBR.map(item => {
      if (item.type === top_size) {
        this.topSize = item.name
      }
    })
    SKIRT_SIZES.map(item => {
      if (item.type === skirt_size) {
        this.skirtSize = item.name
      }
    })
    JEAN_SIZES.map(item => {
      if (item.type === jean_size) {
        this.jeanSize = item.name
      }
    })
    this.state = {
      style: {
        topSize: this.topSize,
        pantSize: this.pantSize,
        dressSize: this.dressSize,
        jeanSize: this.jeanSize,
        skirtSize: this.skirtSize
      },
      isDone: false,
      isLoading: false
    }
    this.listeners = []
    this.shouldShowHint = true
  }

  componentDidMount() {
    this.listeners.push(
      DeviceEventEmitter.addListener('onRefreshSize', data => {
        this._onRefreshSize(data.style)
      })
    )
    this.judgeDone()
  }
  componentWillUnmount() {
    this.listeners.map(item => {
      item.remove()
    })
  }

  _onRefreshSize = style => {
    const { height_inches, weight, waist_size } = style
    const {
      top_size,
      pant_size,
      dress_size,
      jean_size,
      skirt_size
    } = this.props.currentCustomerStore.style
    if (height_inches && weight) {
      let size = calSize(height_inches, weight * 2, 3)
      if (size) {
        !dress_size &&
          DRESS_SIZES.map(item => {
            if (item.name === size) {
              this.dressSize = item.name
              this.dressSizeType = item.type
            }
          })
        !pant_size &&
          PANT_SIZES.map(item => {
            if (item.name === size) {
              this.pantSize = item.name
              this.pantSizeType = item.type
            }
          })
        !top_size &&
          TOP_SIZES_ABBR.map(item => {
            if (item.name === size) {
              this.topSize = item.name
            }
          })
        !skirt_size &&
          SKIRT_SIZES.map(item => {
            if (item.name === size) {
              this.skirtSize = item.name
            }
          })
      }
      if (!jean_size) {
        if (!!waist_size) {
          if (weight < 48) {
            let size = Math.ceil(waist_size / 2.54)
            this.jeanSize = this._fixSizeRange(25, 32, size)
          } else {
            let size = Math.floor(waist_size / 2.54)
            this.jeanSize = this._fixSizeRange(25, 32, size)
          }
        } else {
          if (this.pantSizeType) {
            let size = calJeanSize(this.pantSizeType)
            this.jeanSize = this._fixSizeRange(25, 32, size)
          } else if (this.dressSizeType) {
            let size = calJeanSize(this.dressSizeType)
            this.jeanSize = this._fixSizeRange(25, 32, size)
          }
        }
      }
    }
    this.setState(
      {
        style: {
          topSize: this.topSize,
          pantSize: this.pantSize,
          dressSize: this.dressSize,
          jeanSize: this.jeanSize + '',
          skirtSize: this.skirtSize
        }
      },
      () => {
        this.judgeDone()
      }
    )
  }

  _fixSizeRange = (minSize, maxSize, size) => {
    return size >= maxSize ? maxSize : size <= minSize ? minSize : size
  }

  judgeDone = () => {
    if (
      !this.state.style.topSize ||
      !this.state.style.pantSize ||
      !this.state.style.dressSize ||
      !this.state.style.jeanSize ||
      !this.state.style.skirtSize
    ) {
      this.setState({ isDone: false })
      return
    }
    this.setState({ isDone: true })
  }

  _sizeChange = value => {
    let style = {}
    if (this.state.style[value.dataType] !== value.data) {
      this.shouldShowHint = false
      let values = value.data
      style[value.dataType] = values
      let newStyle = { ...this.state.style, ...style }
      this.setState({ style: newStyle }, this.judgeDone)
    }
  }

  _updateStyle = () => {
    TOP_SIZES_ABBR.map(item => {
      if (item.name === this.state.style.topSize) {
        this.newTopSize = item.type
      }
    })
    PANT_SIZES.map(item => {
      if (item.name === this.state.style.pantSize) {
        this.newPantSize = item.type
      }
    })
    DRESS_SIZES.map(item => {
      if (item.name === this.state.style.dressSize) {
        this.newDressSize = item.type
      }
    })
    SKIRT_SIZES.map(item => {
      if (item.name === this.state.style.skirtSize) {
        this.newSkirtSize = item.type
      }
    })
    const newTopSize = this.newTopSize
    const newPantSize = parseInt(this.newPantSize)
    const newDressSize = parseInt(this.newDressSize)
    const newJeanSize = parseInt(this.state.style.jeanSize)
    const newSkirtSize = parseInt(this.newSkirtSize)
    const {
      top_size,
      pant_size,
      dress_size,
      jean_size,
      skirt_size
    } = this.props.currentCustomerStore.style
    if (
      newTopSize !== top_size ||
      newPantSize !== pant_size ||
      newDressSize !== dress_size ||
      newJeanSize !== jean_size ||
      newSkirtSize !== skirt_size
    ) {
      const style = {
        top_size: newTopSize,
        pant_size: newPantSize,
        dress_size: newDressSize,
        jean_size: newJeanSize,
        skirt_size: newSkirtSize
      }
      const canCreateFirstTote = true
      this.props.updateStyle(style, canCreateFirstTote)
    } else {
      this.props.createFirstTote && this.props.createFirstTote()
    }
  }

  _alertCheck = () => {
    if (!this.shouldShowHint) {
      this._next()
      return
    }

    const { modalStore } = this.props
    modalStore.show(
      <CustomAlertView
        message={'常穿尺码都正确吗？'}
        cancel={{ title: '我再看看', type: 'highLight' }}
        other={[{ title: '是的', type: 'highLight', onClick: this._next }]}
      />
    )
    return
  }

  _next = () => {
    this.shouldShowHint = false
    if (!this.state.isDone) {
      return
    }
    if (!this.state.isLoading) {
      this.setState({ isLoading: true })
      this._updateStyle()
    }
    const { next } = this.props
    if (next) {
      setTimeout(() => {
        this.setState({ isLoading: false })
      }, 300)
      next()
    }
  }
  render() {
    const { isDone, style, isLoading } = this.state
    const { goback } = this.props
    return (
      <SizeComponent
        showStep={true}
        goback={goback}
        isDone={isDone}
        style={style}
        isLoading={isLoading}
        sizeChange={this._sizeChange}
        alertCheck={this._alertCheck}
      />
    )
  }
}
