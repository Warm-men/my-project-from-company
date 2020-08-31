import deviceEnv from 'src/app/lib/device_env.js'

describe('Test deviceEnv func', () => {
  let ua
  it('Test jd deviceEnv', () => {
    ua = 'jdapp'
    expect(deviceEnv(ua)).toEqual('jd')
    ua = 'jdapp iPhone'
    expect(deviceEnv(ua)).toEqual('jd')
    ua = 'jdapp Android'
    expect(deviceEnv(ua)).toEqual('jd')
    ua = 'jdjr-app'
    expect(deviceEnv(ua)).toEqual('jd')
    ua = 'jdjr-app iPhone'
    expect(deviceEnv(ua)).toEqual('jd')
    ua = 'jdjr-app Android'
    expect(deviceEnv(ua)).toEqual('jd')
  })
  it('Test miniProgram deviceEnv', () => {
    ua = 'miniProgram'
    expect(deviceEnv(ua)).toEqual('mini_app')
    ua = 'miniProgram MicroMessenger'
    expect(deviceEnv(ua)).toEqual('mini_app')
  })
  it('Test wechat deviceEnv', () => {
    ua = 'MicroMessenger'
    expect(deviceEnv(ua)).toEqual('wechat')
    ua = 'MicroMessenger iPhone'
    expect(deviceEnv(ua)).toEqual('wechat')
    ua = 'MicroMessenger Android'
    expect(deviceEnv(ua)).toEqual('wechat')
  })
  it('Test wechat_web deviceEnv', () => {
    ua = 'iPhone'
    expect(deviceEnv(ua)).toEqual('wechat_web')
    ua = 'iPad'
    expect(deviceEnv(ua)).toEqual('wechat_web')
    ua = 'iPod'
    expect(deviceEnv(ua)).toEqual('wechat_web')
    ua = 'iOS'
    expect(deviceEnv(ua)).toEqual('wechat_web')
    ua = 'Android'
    expect(deviceEnv(ua)).toEqual('wechat_web')
    ua = 'Adr'
    expect(deviceEnv(ua)).toEqual('wechat_web')
  })
  it('Test wechat_pc deviceEnv', () => {
    ua = 'Chrome'
    expect(deviceEnv(ua)).toEqual('wechat_pc')
    ua = 'Safari'
    expect(deviceEnv(ua)).toEqual('wechat_pc')
  })
})
