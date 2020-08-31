import { shareReferralUrl } from 'src/app/lib/share_referral_url.js'

describe('Test Share Referral Url', () => {
  let customer
  beforeEach(() => {
    customer = {
      nickname: 'test',
      referral_url: null,
      subscription: {}
    }
  })
  it('具备分享资格的默认分享', () => {
    customer = {
      nickname: 'test',
      referral_url: 'http://staging.letote.com/freetote/ELAINE1',
      isFreeUser: false,
      isFreeTote79: false,
      avatar_url: 'avatar',
      subscription: {
        id: 6
      }
    }
    const url = `https://localhost/?referral_code=ELAINE1&referral_url=https%3A%2F%2Flocalhost%2Freferral_free_tote%3Freferral_code%3DELAINE1`
    expect(shareReferralUrl(customer)).toEqual(url)
  })
  it('具备分享资格的指定分享', () => {
    customer = {
      nickname: 'test',
      referral_url: 'http://staging.letote.com/freetote/ELAINE1',
      isFreeUser: false,
      isFreeTote79: false,
      avatar_url: 'avatar',
      subscription: {
        id: 6
      }
    }
    const productUrl = `https://localhost/products/1664?referral_code=ELAINE1&referral_url=https%3A%2F%2Flocalhost%2Freferral_free_tote%3Freferral_code%3DELAINE1`
    expect(
      shareReferralUrl(customer, `https://localhost/products/1664`)
    ).toEqual(productUrl)
  })
  it('用户customer为空', () => {
    customer = {}
    expect(shareReferralUrl(customer)).toEqual('https://localhost/')
  })
  it('referral_url为空', () => {
    customer = {
      nickname: 'test',
      referral_url: '',
      subscription: null
    }
    expect(shareReferralUrl(customer)).toEqual('https://localhost/')
    customer = {
      nickname: 'test',
      referral_url: null,
      subscription: null
    }
    expect(shareReferralUrl(customer)).toEqual('https://localhost/')
  })
  it('免费衣箱用户', () => {
    customer = {
      nickname: 'test',
      referral_url: 'http://staging.letote.com/freetote/ELAINE1',
      isFreeUser: true,
      isFreeTote79: false,
      subscription: {
        id: 6
      }
    }
    expect(shareReferralUrl(customer)).toEqual('https://localhost/')
  })
  it('79会员用户', () => {
    customer = {
      nickname: 'test',
      referral_url: 'http://staging.letote.com/freetote/ELAINE1',
      isFreeUser: false,
      isFreeTote79: true,
      subscription: {
        id: 6
      }
    }
    expect(shareReferralUrl(customer)).toEqual('https://localhost/')
  })
  it('非会员用户', () => {
    customer = {
      nickname: 'test',
      referral_url: 'http://staging.letote.com/freetote/ELAINE1',
      isFreeUser: false,
      isFreeTote79: false,
      subscription: null
    }
    expect(shareReferralUrl(customer)).toEqual('https://localhost/')
  })
})
