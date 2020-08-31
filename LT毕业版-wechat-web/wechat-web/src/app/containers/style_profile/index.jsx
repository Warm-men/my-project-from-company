import 'src/assets/stylesheets/mobile/style_profile.scss'
import './index.scss'

class StyleProfile extends React.PureComponent {
  render() {
    return (
      <div id="style-profile-react-group" className="quiz">
        {this.props.children}
      </div>
    )
  }
}

export default StyleProfile
