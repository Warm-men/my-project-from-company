import SelectSize from 'src/app/containers/product/sizechart/select_size'
import { SIZE_LIMIT } from 'src/app/containers/product/sizechart/utils'
import * as storage from 'src/app/lib/storage.js'
import { PICKER_OPTIONS } from './utils'
import { SHAPE_UTILS } from 'src/app/containers/onboarding/size.js'
import Actions from 'src/app/actions/actions.js'

const unLockArray = ['height_inches', 'weight', 'shape']

export default function FigureInputItem(props) {
  const { isReceivedRule, data, style, dispatch } = props
  const isShape = data.type === 'shape'

  const handleSelectChange = e => {
    const index = e.currentTarget.getAttribute('data-index')
    dispatch(
      Actions.customerStyleInfo.updateUserDataAction({
        data: { style: { [index]: Number(e.currentTarget.value) } }
      })
    )
  }

  const linkToSelectSize = type => () => {
    storage.set('displayedTips', true)
    storage.set('isReceivedRule', isReceivedRule)
    if (isShape) {
      props.router.push({ pathname: '/style_profile/shape' })
      return null
    }
    if (!isReceivedRule) {
      const tips = { isShow: true, content: `请签收卷尺后再填写` }
      dispatch(Actions.tips.changeTips(tips))
      return null
    }
    props.router.push(`/select_size/${type}`)
  }

  const typeClass = type => {
    return isReceivedRule || _.includes(unLockArray, type)
      ? 'title'
      : 'lockTitle'
  }

  return (
    <div className="input-row">
      <span className={typeClass(data.type)}>
        {data.title}
        {data.required && <span className="tips-icon">*</span>}
      </span>
      {_.includes(PICKER_OPTIONS, data.type) ? (
        <span className="input-box">
          <SelectSize
            dataIndex={data.type}
            value={style[data.type] || ''}
            unit={data.unit}
            className="detail-input"
            handleChange={_.debounce(handleSelectChange, 100, {
              leading: true
            })}
            minLimit={SIZE_LIMIT[data.type].min}
            maxLimit={SIZE_LIMIT[data.type].max}
            placeholder="点击选择"
          />
        </span>
      ) : (
        <div className="input-button" onClick={linkToSelectSize(data.type)}>
          {isShape
            ? SHAPE_UTILS[style[data.type]] || ''
            : style[data.type]
            ? `${style[data.type]}${data.unit}`
            : ''}
          <i
            className={!isReceivedRule && !isShape ? 'icon-lock' : 'icon-next'}
          />
        </div>
      )}
    </div>
  )
}
