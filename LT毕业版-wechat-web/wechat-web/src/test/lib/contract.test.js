import { wechatContractUrl } from 'src/app/lib/contract.js'

describe('Test Wechat Contract Url', () => {
  let submitData
  it('Test Empty SubmitData', () => {
    submitData = null
    expect(wechatContractUrl(submitData)).toEqual('')
    submitData = {}
    expect(wechatContractUrl(submitData)).toEqual('')
    submitData = ''
    expect(wechatContractUrl(submitData)).toEqual('')
  })
  it('Test Valid SubmitData', () => {
    submitData = {
      appid: 1,
      contract_code: '12',
      contract_display_account: 2,
      mch_id: 1,
      notify_url: 'https://wechat.letote.com',
      plan_id: 1,
      request_serial: '123',
      timestamp: '123',
      version: '20',
      sign: 123,
      return_web: 1
    }
    expect(wechatContractUrl(submitData)).toEqual(
      `https://api.mch.weixin.qq.com/papay/entrustweb?appid=1&contract_code=12&contract_display_account=2&mch_id=1&notify_url=https%3A%2F%2Fwechat.letote.com&plan_id=1&request_serial=123&timestamp=123&version=20&sign=123&return_web=1`
    )
  })
})
