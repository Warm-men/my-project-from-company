import StatisticManager from './index'
import { BaiduStatisService } from './baidu'
import { ShenceStatisService } from './shence'

// APP统计服务管理器实例
const APPStatisticManager = new StatisticManager()
// APP 注册的统计服务
APPStatisticManager.registerService(
  BaiduStatisService.id,
  new BaiduStatisService()
)
APPStatisticManager.registerService(
  ShenceStatisService.id,
  new ShenceStatisService()
)

export { APPStatisticManager, BaiduStatisService, ShenceStatisService }
