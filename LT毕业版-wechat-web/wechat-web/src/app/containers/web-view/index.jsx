import './index.scss'

export default function WebView({ location }) {
  return (
    <iframe className="web-view" title="托特衣箱" src={location.query.url} />
  )
}
