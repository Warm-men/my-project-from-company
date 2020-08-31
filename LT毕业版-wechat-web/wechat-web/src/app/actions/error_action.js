const reportErrorMessage = errorInfo => ({
  type: 'REPORT:ERROR:MESSAGE',
  API: true,
  method: 'GET',
  url: `/static/err?stack=${encodeURIComponent(JSON.stringify(errorInfo))}`
})

export default {
  reportErrorMessage
}
