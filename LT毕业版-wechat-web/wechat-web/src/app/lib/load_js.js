export default function loadJs(url, loadSuccess) {
  if (!url) {
    return null
  }
  let script = document.createElement('script')
  script.type = 'text/javascript'
  if (script.readyState) {
    script.onreadystatechange = () => {
      const state = script.readyStat
      if (state === 'loaded' || state === 'complete') {
        script.onreadystatechange = null
        loadSuccess && loadSuccess()
      }
    }
  } else {
    script.onload = () => {
      loadSuccess && loadSuccess()
    }
  }
  script.src = url
  document.body.appendChild(script)
}
