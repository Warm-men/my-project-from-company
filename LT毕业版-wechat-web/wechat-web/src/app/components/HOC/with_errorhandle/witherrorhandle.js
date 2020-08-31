/*
    用法
    withErrorHandle(WrappedComponent(当前组件), callback（错误回调）, fallbackView（错误显示界面）) 
*/
// import { browserHistory } from 'react-router'
import Actions from 'src/app/actions/actions.js'
import WrongPage from 'src/app/containers/wrongpage/wrongpage'

const withErrorHandler = (WrappedComponent, store) => {
  class WithErrorHandler extends React.Component {
    constructor(props) {
      super(props)
      this.state = { hasError: false }
      this.Jspattern = new RegExp(/^Loading chunk (\d)+ failed\./)
      this.Csspattern = new RegExp(/^Loading CSS chunk (\d)+ failed\./)
    }

    componentDidCatch(error, info) {
      const isJsChunkLoadingFailed = this.Jspattern.test(error.message)
      const isCssChunkLoadingFailed = this.Csspattern.test(error.message)
      if (isJsChunkLoadingFailed || isCssChunkLoadingFailed) {
        window.location.replace(window.location.href)
      } else {
        this.setState({
          hasError: true,
          error,
          errorInfo: info
        })
        const errorInfo = {
          error,
          errorInfo: info
        }
        store &&
          store.dispatch(Actions.errorAction.reportErrorMessage(errorInfo))
      }
    }

    errorResolve = () => {
      // FIXME：目前错误处理,在错误界面点击图标先跳转首页刷新，后续进行调整
      window.location.href = '/'
    }

    render() {
      return this.state.hasError ? (
        <WrongPage
          isMiniApp={store.getState().app.platform === 'mini_app'}
          errorInfo={this.state.error}
          errorHandle={this.errorResolve}
        />
      ) : (
        <WrappedComponent {...this.props} />
      )
    }
  }

  return WithErrorHandler
}

export default withErrorHandler
