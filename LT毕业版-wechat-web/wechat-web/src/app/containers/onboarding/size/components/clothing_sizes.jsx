import React from 'react'
import SizeButtons from './size_buttons'
import {
  TOP_SIZES_ABBR,
  DRESS_SIZES,
  PANT_SIZES,
  SKIRT_SIZES,
  JEAN_SIZES
} from '../../size'

export default class ClothingSizes extends React.PureComponent {
  render() {
    const { data, changeUserInfo, isHiddenJean } = this.props
    if (!data) return
    const { top_size, pant_size, jean_size, dress_size, skirt_size } = data
    return (
      <>
        <SizeButtons
          title="上衣"
          activeKey="top_size"
          defaultValue={top_size}
          options={TOP_SIZES_ABBR}
          onChange={changeUserInfo}
        />
        <SizeButtons
          title="裤子"
          activeKey="pant_size"
          defaultValue={pant_size}
          options={PANT_SIZES}
          onChange={changeUserInfo}
        />
        {isHiddenJean ? null : (
          <SizeButtons
            title="牛仔裤"
            activeKey="jean_size"
            defaultValue={jean_size}
            options={JEAN_SIZES}
            onChange={changeUserInfo}
          />
        )}

        <SizeButtons
          title="连衣裙"
          activeKey="dress_size"
          defaultValue={dress_size}
          options={DRESS_SIZES}
          onChange={changeUserInfo}
        />
        <SizeButtons
          title="半裙"
          activeKey="skirt_size"
          defaultValue={skirt_size}
          options={SKIRT_SIZES}
          onChange={changeUserInfo}
        />
      </>
    )
  }
}
