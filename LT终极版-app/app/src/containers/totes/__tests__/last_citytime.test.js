import 'react-native'

const LAST_CITYTIME = '17:00'
const getCityTime = jest.fn(() => ({
  深圳: '21:00',
  北京: '20:00',
  广州: '20:00',
  上海: '19:00',
  天水: '14:00'
}))
const getLastTime = async info => {
  const cityTime = await getCityTime()
  let lastCityTime = LAST_CITYTIME
  const validAddress = info.addressInfo,
    { state, city, district } = validAddress

  Object.keys(cityTime).map(key => {
    if (state.match(key) || city.match(key) || district.match(key)) {
      lastCityTime = cityTime[key]
    }
  })
  return lastCityTime
}
describe('Test Address LastTime', () => {
  let info
  beforeEach(() => {
    info = {
      addressInfo: {
        state: '广东省', // 国标收货地址第一级地址（省）
        city: '深圳市', // 国标收货地址第二级地址（市）
        district: '南山区' // 国标收货地址第三级地址（区）
      }
    }
  })
  it('Test 北京市', async () => {
    info = {
      addressInfo: {
        state: '北京市', // 国标收货地址第一级地址（省）
        city: '北京市', // 国标收货地址第二级地址（市）
        district: '海淀区' // 国标收货地址第三级地址（区）
      }
    }
    const res = await getLastTime(info)
    return expect(res).toEqual('20:00')
  })
  it('Test 北京', async () => {
    info = {
      addressInfo: {
        state: '北京', // 国标收货地址第一级地址（省）
        city: '北京市', // 国标收货地址第二级地址（市）
        district: '海淀区' // 国标收货地址第三级地址（区）
      }
    }
    const res = await getLastTime(info)
    return expect(res).toEqual('20:00')
  })
  it('Test 深圳', async () => {
    info = {
      addressInfo: {
        state: '广东省', // 国标收货地址第一级地址（省）
        city: '深圳市', // 国标收货地址第二级地址（市）
        district: '南山区' // 国标收货地址第三级地址（区）
      }
    }
    const res = await getLastTime(info)
    return expect(res).toEqual('21:00')
  })
  it('Test 广州 ', async () => {
    info = {
      addressInfo: {
        state: '广东省', // 国标收货地址第一级地址（省）
        city: '广州市', // 国标收货地址第二级地址（市）
        district: '天河区' // 国标收货地址第三级地址（区）
      }
    }
    const res = await getLastTime(info)
    return expect(res).toEqual('20:00')
  })
  it('Test 上海市', async () => {
    info = {
      addressInfo: {
        state: '上海市', // 国标收货地址第一级地址（省）
        city: '上海市', // 国标收货地址第二级地址（市）
        district: '浦东新区' // 国标收货地址第三级地址（区）
      }
    }
    const res = await getLastTime(info)
    return expect(res).toEqual('19:00')
  })
  it('Test 上海', async () => {
    info = {
      addressInfo: {
        state: '上海', // 国标收货地址第一级地址（省）
        city: '上海市', // 国标收货地址第二级地址（市）
        district: '浦东新区' // 国标收货地址第三级地址（区）
      }
    }
    const res = await getLastTime(info)
    return expect(res).toEqual('19:00')
  })
  it('Test 天水', async () => {
    info = {
      addressInfo: {
        state: '甘肃省', // 国标收货地址第一级地址（省）
        city: '天水市', // 国标收货地址第二级地址（市）
        district: '天水区' // 国标收货地址第三级地址（区）
      }
    }
    const res = await getLastTime(info)
    return expect(res).toEqual('14:00')
  })
  it('Test 没有城市信息', async () => {
    info = {
      addressInfo: {
        state: '广东省', // 国标收货地址第一级地址（省）
        city: '东莞市', // 国标收货地址第二级地址（市）
        district: '厚街区' // 国标收货地址第三级地址（区）
      }
    }
    const res = await getLastTime(info)
    return expect(res).toEqual('17:00')
  })
})
