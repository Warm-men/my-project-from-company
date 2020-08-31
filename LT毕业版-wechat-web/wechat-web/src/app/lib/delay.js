/**
 * delay function
 * timeout: delay time
 **/
export default (timeout = 2000) =>
  new Promise((resolve, reject) => {
    try {
      setTimeout(resolve, timeout)
    } catch (error) {
      reject(error)
    }
  })
