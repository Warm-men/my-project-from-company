/**
 * 用户设备环境
 */
const deviceEnv = env => {
  if (_.isEmpty(env)) {
    return null
  }
  const ua = env.toLowerCase()
  if (ua.match(/jdapp/i) || ua.match(/jdjr-app/i)) {
    return 'jd'
  } else if (ua.match(/miniProgram/i)) {
    return 'mini_app'
  } else if (ua.match(/MicroMessenger/i)) {
    return 'wechat'
  } else if (ua.match(/(iPhone|iPad|iPod|iOS|Android|Adr)/i)) {
    return 'wechat_web'
  } else {
    return 'wechat_pc'
  }
}

export default deviceEnv
