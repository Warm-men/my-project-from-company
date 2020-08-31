import 'src/assets/stylesheets/components/desktop/tote_swap/overrides.scss'
const HOCSwap = WrapperComponent =>
  class extends React.Component {
    componentWillMount() {
      this.bodySelector('add')
    }
    componentWillUnmount() {
      this.bodySelector('remove')
    }
    bodySelector = (type = 'add') => {
      const isMobile = this.props.app.platform !== 'wechat_pc',
        className = isMobile ? ' tote-swap tote-swap-mobile' : ' tote-swap',
        body = document.getElementsByTagName('body')[0]
      body.className =
        type === 'add'
          ? body.className + className
          : (body.className = body.className.replace(className, ''))
    }
    render() {
      return <WrapperComponent {...this.props} />
    }
  }

export default HOCSwap
