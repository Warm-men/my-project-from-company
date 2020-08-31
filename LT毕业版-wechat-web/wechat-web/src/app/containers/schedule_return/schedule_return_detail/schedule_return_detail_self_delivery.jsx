import React, { PureComponent } from 'react'
import ScheduleReturnProductsCard from 'src/app/components/schedule_return/schedule_return_products_card'
import { format } from 'date-fns'
import next from 'src/assets/images/totes/right_arrow.png'
import ScheduleReturnFreeServiceDetails from 'src/app/components/schedule_return/schedule_return_free_service_detail'
import Actions from 'src/app/actions/actions'
import ClipboardJS from 'clipboard'

export default class ToteReturnDetailSelfDelivery extends PureComponent {
  componentDidMount() {
    this.Clipboard()
  }

  componentWillUnmount() {
    this.clipboard && this.clipboard.destroy()
  }

  handleCopy = () => this.Clipboard()

  Clipboard = () => {
    const { fc_address } = this.props.tote
    const dispathTips = this.dispatchTips
    this.clipboard = new ClipboardJS('.copyButtonView', {
      text: function() {
        return fc_address
      }
    })
    this.clipboard.on('success', function(e) {
      if (typeof dispathTips === 'function') {
        dispathTips('复制成功')
      } else {
        dispathTips('复制失败！请手动复制')
      }
      e.clearSelection()
    })
    this.clipboard.on('error', function() {
      dispathTips('复制失败！请手动复制')
    })
  }

  dispatchTips = tips => {
    this.props.dispatch(
      Actions.tips.changeTips({
        isShow: true,
        content: tips
      })
    )
  }
  render() {
    const { gotoSeflDeliveryGuide, tote, isToteScheduledReturn } = this.props
    const { scheduled_self_delivery } = isToteScheduledReturn
      ? tote.scheduled_return
      : tote.tote_free_service.scheduled_return
    const toteFreeService = tote.tote_free_service
    const latestReturnAt =
      !!scheduled_self_delivery &&
      format(scheduled_self_delivery.latest_return_at, 'YYYY年MM月DD日 HH:mm')
    const shippingCode =
      !!scheduled_self_delivery && scheduled_self_delivery.shipping_code
    const deathLineText =
      latestReturnAt &&
      `请在${latestReturnAt}前务必上传顺丰快递单号，否则会影响新衣箱的下单或者产生商品滞还金`
    return (
      <div className={'toteReturnDetailSelfDeliveryComponent'}>
        <div className={'detailContent'}>
          <div className={'viewWrapper'}>
            <div className={'titleView'}>
              <div className={'titleText'}>{'寄回地址'}</div>
              <div onClick={this.handleCopy} className={'copyButtonView'}>
                <div className={'buttonText'}>{'复制'}</div>
              </div>
            </div>
            <div className={'descriptionText'}>{tote.fc_address}</div>
          </div>
          {!!deathLineText && !shippingCode && (
            <div className={'viewWrapper'}>
              <div className={'titleView'}>
                <div className={'titleText'}>{'寄回时间'}</div>
              </div>
              <div className={'descriptionText'}>{deathLineText}</div>
            </div>
          )}
          <div className={'viewWrapper'}>
            <div className={'titleView'}>
              <div className={'titleText'}>{'寄回方式'}</div>
            </div>
            <div className={'guideView'}>
              <div className={'descriptionText'}>
                {'可自行联系顺丰或使用丰巢智能柜自助寄回'}
              </div>
              <div
                onClick={gotoSeflDeliveryGuide}
                className={'guideButtonView'}
              >
                <div className={'guideText'}>{'丰巢寄回指南'}</div>
                <img alt="" src={next} />
              </div>
            </div>
          </div>
          <div className={'viewWrapper'}>
            <div className={'titleView'}>
              <div className={'titleText'}>{'快递公司'}</div>
            </div>
            <div className={'descriptionText'}>
              {'顺丰快递运费到付，其他快递不接受到付'}
            </div>
          </div>
        </div>
        {isToteScheduledReturn ? (
          <ScheduleReturnProductsCard tote={tote} />
        ) : (
          <div className={'fixUiWrapper'}>
            <ScheduleReturnFreeServiceDetails
              toteFreeService={toteFreeService}
            />
          </div>
        )}
      </div>
    )
  }
}
