export default TargetComponent => {
  class PreventScroll extends React.Component {
    constructor() {
      super()
      this.defaultBodyStyle = this.getDom('body').cssText
      this.defaultHTMLStyle = this.getDom('html').cssText
    }

    getDom = tag => document.getElementsByTagName(tag)[0].style

    componentWillMount() {
      this.overflowHidden()
    }

    componentWillUnmount() {
      this.styleInit()
    }

    overflowHidden = () => {
      const bodyStlye = this.getDom('body'),
        htmlStlye = this.getDom('html')

      htmlStlye.overflow = 'hidden' // NOTE: compatible ios
      bodyStlye.overflowY = 'hidden'
      bodyStlye.height = '100%'
      bodyStlye.width = '100%'
      bodyStlye.position = 'fixed'
    }

    styleInit = () => {
      const bodyStlye = this.getDom('body'),
        htmlStlye = this.getDom('html')
      bodyStlye.cssText = this.defaultBodyStyle
      htmlStlye.cssText = this.defaultHTMLStyle
    }

    render() {
      return <TargetComponent {...this.props} />
    }
  }
  return PreventScroll
}
