import { Platform } from 'react-native'
import RNAnalytics from 'react-native-letote-baidumjt'

const channel =
  Platform.OS === 'ios' ? 'AppStore' : RNAnalytics.getChannel() || 'letote'

export default channel
