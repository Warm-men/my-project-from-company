import ReactDOM from 'react-dom'
import GlobalManager from './app/global'
import App from './app/router/index'

GlobalManager.polyfill()
ReactDOM.render(
  <App globalManager={GlobalManager} />,
  document.getElementById('root')
)
