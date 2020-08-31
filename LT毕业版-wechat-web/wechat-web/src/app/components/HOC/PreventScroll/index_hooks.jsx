import { useEffect } from 'react'

export default TargetComponent => {
  return function PreventScroll(props) {
    const getDom = tag => document.getElementsByTagName(tag)[0].style

    const defaultBodyStyle = getDom('body').cssText
    const defaultHTMLStyle = getDom('html').cssText

    useEffect(() => {
      overflowHidden()
      return () => {
        const bodyStlye = getDom('body'),
          htmlStlye = getDom('html')
        bodyStlye.cssText = defaultBodyStyle
        htmlStlye.cssText = defaultHTMLStyle
      }
    }, [])

    const overflowHidden = () => {
      const bodyStlye = getDom('body'),
        htmlStlye = getDom('html')

      htmlStlye.overflow = 'hidden' // NOTE: compatible ios
      bodyStlye.overflowY = 'hidden'
      bodyStlye.height = '100%'
      bodyStlye.width = '100%'
      bodyStlye.position = 'fixed'
    }

    return <TargetComponent {...props} />
  }
}
