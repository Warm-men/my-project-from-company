const initScrollTop = delayTime => {
  const { pathname, search } = window.location
  let scrollTop = sessionStorage.getItem(pathname + search)
  scrollTop = scrollTop ? parseInt(scrollTop, 10) : 0
  let dom = !window.SCROLL_ELEMENT
    ? document.documentElement || document.body
    : document[window.SCROLL_ELEMENT]
  if (delayTime && delayTime > 0) {
    setTimeout(() => {
      dom.scrollTop = scrollTop
    }, delayTime)
  } else {
    dom.scrollTop = scrollTop
  }
}

export default initScrollTop
