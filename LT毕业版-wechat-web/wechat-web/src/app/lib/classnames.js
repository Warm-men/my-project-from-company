export default function classnames(...parameters) {
  let classname = ''
  if (parameters.length > 0) {
    for (let index = 0; index < parameters.length; index++) {
      const param = parameters[index]
      if (typeof param === 'string') {
        classname += `${param} `
      } else if (typeof param === 'object') {
        for (let i in param) {
          if (typeof param[i] === 'boolean') {
            classname += `${param[i] === true ? i : ''} `
          } else {
            try {
              throw new Error('参数Object需要设置boolean!')
            } catch (error) {
              console.log(error)
            }
          }
        }
      }
    }
  }
  return classname.trim()
}
