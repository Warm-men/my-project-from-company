import { StatisticService } from './index'

export class BaiduStatisService implements StatisticService {
  static id = 'BaiduStatis'

  private _sensor: any

  public async sensor() {
    if (!this._sensor) {
      this._sensor = await this._init()
    }
    return this._sensor
  }

  public onAppDidMount() {
    this._init()
    this.push(['_setAutoPageview', true])
  }

  public track(...args: any[]) {
    this.sensor().then(baidu => {
      baidu.track(...args)
    })
  }

  public push(...args: any[]) {
    this.sensor().then(() => {
      const _window = window as any
      if (!_window._hmt) {
        _window._hmt = []
      }
      _window._hmt.push(...args)
    })
  }

  private _track(category: any, opt_label: any, action = null) {
    this.push([
      '_trackEvent',
      category,
      action || category,
      JSON.stringify(opt_label)
    ])
  }

  private _init() {
    return new Promise(res => {
      const hm = document.createElement('script')

      hm.onload = () => {
        res({ track: this._track.bind(this) })
      }
      hm.onloadend = () => {
        res({ track: this._track.bind(this) })
      }
      hm.onerror = () => {
        console.warn('Script load failed')
        res(undefined)
      }
      hm.src = 'https://hm.baidu.com/hm.js?f10937653ce6a3e5f9def6a4654fb55f'
      const s = document.getElementsByTagName('script')[0]
      s.parentNode.insertBefore(hm, s)
    })
  }
}
