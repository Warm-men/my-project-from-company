import { isBoolean, isFunction } from 'lodash'
export type Excutor = {
  id: string
  desc?: string
  excute: (() => boolean) | (() => Promise<boolean>)
}

export type StreamPromiseResolve = (
  value?: boolean | PromiseLike<boolean>
) => void

export type ExcutorStream = {
  id: string
  onTrue: () => boolean
  onFalse: () => boolean
}

export default class StreamUtil {
  private _excutor: Map<string, Map<string, Excutor>> = new Map()
  /**
   * 注册执行器
   *
   * @param {string} id
   * @param {Excutor[]} excutors
   * @memberof StreamUtil
   */
  public registerExcutor(id: string, excutors: Excutor[]) {
    const map = new Map()
    excutors.forEach(data => map.set(data.id, data))
    this._excutor.set(id, map)
  }
  /**
   *获取执行器
   *
   * @param {string} id
   * @returns
   * @memberof StreamUtil
   */
  public getExcutor(id: string) {
    const steamMap = this._excutor.get(id)
    return {
      excuteStream: (steams: ExcutorStream[]) =>
        this.excuteStream(steams, steamMap)
    }
  }
  /**
   *执行任务流
   *
   * @param {ExcutorStream[]} streams
   * @param {Map<string, Excutor>} [steamMap]
   * @returns
   * @memberof StreamUtil
   */
  public excuteStream(
    streams: ExcutorStream[],
    steamMap?: Map<string, Excutor>
  ) {
    if (!steamMap || !streams.length) {
      return Promise.reject()
    }
    return this._goPromise(0, streams, steamMap)
  }

  private _getExcutorStreamPromise(
    stream: ExcutorStream,
    steamMap: Map<string, Excutor>
  ) {
    return Promise.race([
      new Promise(res => {
        const excutor = steamMap.get(stream.id)
        if (excutor) {
          const onTrue = stream.onTrue || (() => true)
          const onFalse = stream.onFalse || (() => false)
          const next = excutor.excute() as any
          if (isBoolean(next)) {
            next ? res(onTrue()) : res(onFalse())
          } else {
            if (next.then && isFunction(next.then)) {
              next.then(excuteResult => {
                if (excuteResult) {
                  res(onTrue())
                } else {
                  res(onFalse())
                }
              })
            }
          }
        } else {
          res(false)
        }
        // 暂未提示未注册的excutor
      }),
      new Promise(res => setTimeout(() => res(false), 5000))
    ])
  }

  private _goPromise(
    index: number,
    streams: ExcutorStream[],
    steamMap: Map<string, Excutor>
  ) {
    if (index > streams.length - 1) {
      return Promise.resolve(false)
    }
    return new Promise(res => {
      let currentPromise = this._getExcutorStreamPromise(
        streams[index],
        steamMap
      )
      currentPromise.then((result: boolean) => {
        if (result) {
          this._goPromise(index + 1, streams, steamMap).then(result =>
            res(result)
          )
        } else {
          res(result)
        }
      })
    })
  }
}
