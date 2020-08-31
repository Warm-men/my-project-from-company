import PageHelmet from 'src/app/lib/pagehelmet'
import PayBottom from '../pay_bottom'
import Agreement from '../agreement'
import SubscriptionList from '../subscription_list'
import PlansCancelQuestion from 'src/app/containers/questionnaire/plans_cancel'
import './old_version.scss'

export default ({
  data,
  subscriptionData,
  authentication,
  platform,
  amount,
  cash_price,
  valid_promo_code,
  valid_promo_codes,
  classname,
  available_promo_codes,
  codeState,
  discountAmount,
  needPrice,
  expiration_date,
  hasButtonActivated,
  cancelQuestionarie,
  isWechat,
  handleSelectSub,
  handleGoPromoCode,
  gotoAgreement,
  showPaymentTipsText,
  handlePayment,
  questionAlert,
  abTestCancelText,
  closeQuestionAlert,
  customer
}) => (
  <div className="plans">
    <PageHelmet title={`会员支付`} link={`/plans`} />
    <div className="mid">
      <div
        className="card"
        style={{
          backgroundImage: `url(${
            data.operation_plan
              ? data.operation_plan.new_banner_url
              : data.new_banner_url
          })`
        }}
      />
      <SubscriptionList
        subscription={
          subscriptionData[0] && subscriptionData[0].subscription_types
        }
        customer={customer}
        authentication={authentication}
        selectSub={data}
        isWechat={isWechat}
        handleSelectSub={handleSelectSub}
      />
      {platform === 'jd' && (
        <div className="jd-credit">
          <div>小白信用免押金</div>
          <div className="referral-amount">&yen;0</div>
        </div>
      )}
      {!!valid_promo_code && valid_promo_codes.length !== 0 && (
        <span className="vip" onClick={handleGoPromoCode}>
          <div>优惠券</div>
          <div className={classname}>
            {!_.isEmpty(available_promo_codes) &&
            _.isArray(available_promo_codes) ? (
              codeState === 'valid' ? (
                <span style={{ fontSize: '14px' }}>-&yen;{discountAmount}</span>
              ) : (
                `${available_promo_codes.length}张可用`
              )
            ) : (
              '暂无可用'
            )}
            <i />
          </div>
        </span>
      )}
      {!!amount && (
        <div className="referral-code">
          奖励金
          <span className="referral-amount">
            奖励金共<span>¥{amount}</span>，本次可使用
            <span>&yen;{cash_price}</span>
          </span>
        </div>
      )}
      {platform === 'jd' && (
        <div className="jd-credit border-buttom">
          <div>支付方式</div>
          <div className="jd-payment-icon" />
        </div>
      )}
      <Agreement gotoAgreement={gotoAgreement} />
    </div>
    <PayBottom
      needPrice={needPrice}
      expirationDate={showPaymentTipsText(
        authentication.isSubscriber,
        expiration_date
      )}
      hasButtonActivated={hasButtonActivated}
      activePayment={handlePayment}
    />
    {questionAlert && (
      <PlansCancelQuestion
        title={abTestCancelText || '支付遇到困难？'}
        queryData={cancelQuestionarie}
        handleCancel={closeQuestionAlert}
        activePayment={handlePayment}
      />
    )}
  </div>
)
