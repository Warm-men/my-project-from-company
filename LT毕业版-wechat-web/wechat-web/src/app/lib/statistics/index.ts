/**
 * 统计服务抽象类
 *
 * @export
 * @class StatisticService
 */
export abstract class StatisticService {
  // 服务id
  static id: string
  public sensor: () => any
  public onRouterLeaveBefore?: () => void
  public onUserUpdate?: (user: any) => void
  public onLoginSuccess?: (user: any) => void
  public track: (...args: any[]) => void
  public onClickElement?: (element: HTMLElement) => void
  public onAppDidMount?: (props: { platform: string }) => void
}

/**
 * App统计服务
 *
 * @export
 * @class StatisticManager
 */
export default class StatisticManager {
  private _statisticServicesMap: Map<string, StatisticService> = new Map()

  async sensor(id: string) {
    const sensor = await this._statisticServicesMap.get(id).sensor()
    return sensor
  }

  service(id: string) {
    return this._statisticServicesMap.get(id)
  }

  registerService(id: string, service: StatisticService) {
    this._statisticServicesMap.set(id, service)
  }

  onAppWillUnMount() {
    this._statisticServicesMap.clear()
  }

  onAppDidMount(props: { platform: string }) {
    this._statisticServicesMap.forEach(service => {
      if (service.onAppDidMount) {
        setTimeout(() => service.onAppDidMount(props), 0)
      }
    })
  }

  onUserUpdate(user: any) {
    this._statisticServicesMap.forEach(service => {
      setTimeout(() => {
        if (service.onUserUpdate) {
          service.onUserUpdate(user)
        }
      }, 0)
    })
  }

  onLoginSuccess(user: any) {
    this._statisticServicesMap.forEach(service => {
      setTimeout(() => {
        if (service.onLoginSuccess) {
          service.onLoginSuccess(user)
        }
      }, 0)
    })
  }

  onClickElement(element: HTMLElement) {
    this._statisticServicesMap.forEach(service => {
      setTimeout(() => {
        if (service.onClickElement) {
          service.onClickElement(element)
        }
      }, 0)
    })
  }

  onRouterLeaveBefore() {
    this._statisticServicesMap.forEach(service => {
      setTimeout(() => {
        if (service.onRouterLeaveBefore) {
          service.onRouterLeaveBefore()
        }
      }, 0)
    })
  }
}
