import PageHelmet from 'src/app/lib/pagehelmet'
import { browserHistory } from 'react-router'
import SizeContainer from './clothing_size'
import 'src/assets/stylesheets/mobile/style_profile.scss'
import * as storage from 'src/app/lib/storage.js'
import 'src/app/containers/onboarding/index.scss'

export default function ProfileSizeInput(props) {
  const submitSuccess = isComplete => {
    if (storage.get('StyleOutside')) {
      storage.remove('StyleOutside')
      // NOTE：成功跳转incentive_url
      if (isComplete) {
        browserHistory.replace('/complete_size_success')
      } else {
        browserHistory.replace('/account')
      }
    } else {
      if (isComplete) {
        browserHistory.replace('/complete_size_success')
      } else {
        browserHistory.go(-2)
      }
    }
  }

  return (
    <>
      <p className="tips-text padding-both">
        请根据你以往的穿衣习惯，核对以下常穿尺码
      </p>
      <SizeContainer {...props} submitSuccess={submitSuccess} />
      <PageHelmet title={`填写尺码`} link={`/style_profile/size_input`} />
    </>
  )
}
