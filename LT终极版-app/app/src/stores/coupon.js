import { observable, action } from 'mobx'

class CouponStore {
  @observable validCoupons = []
  @observable validPromoCodes = []
  @observable usedCoupons = []
  @observable usedPromoCodes = []
  @observable expiredCoupons = []
  @observable expiredPromoCodes = []
  @observable updateTime = null

  @action
  updateCoupon = me => {
    const {
      used_coupons,
      valid_coupons,
      expired_coupons,
      used_promo_codes,
      valid_promo_codes,
      expired_promo_codes
    } = me
    this.usedPromoCodes = used_promo_codes ? used_promo_codes : []
    this.usedCoupons = used_coupons ? used_coupons : []
    this.validPromoCodes = valid_promo_codes ? valid_promo_codes : []
    this.validCoupons = valid_coupons ? valid_coupons : []
    this.expiredPromoCodes = expired_promo_codes ? expired_promo_codes : []
    this.expiredCoupons = expired_coupons ? expired_coupons : []
  }

  @action
  updateValidCoupons = me => {
    this.validPromoCodes = me.valid_promo_codes ? me.valid_promo_codes : []
    this.validCoupons = me.valid_coupons ? me.valid_coupons : []
  }

  @action
  resetCoupon = () => {
    this.validCoupons = []
    this.validPromoCodes = []
    this.usedCoupons = []
    this.usedPromoCodes = []
    this.expiredCoupons = []
    this.expiredPromoCodes = []
    this.updateTime = null
  }
}

export default new CouponStore()
