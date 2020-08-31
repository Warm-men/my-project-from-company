import { StyleSheet } from 'react-native'

export const base = {
  container: {},
  text: {
    color: '#ffffff',
    fontWeight: 'bold',
    paddingLeft: 16,
    paddingRight: 30,
    lineHeight: 25
  }
}

export default {
  info: {
    icon: {
      name: 'emoji-neutral',
      color: 'white',
      image: require('../../../assets/images/toast/icon_info.png')
    },
    styles: StyleSheet.create({
      container: StyleSheet.flatten([
        base.container,
        { backgroundColor: '#2487DB' }
      ]),
      text: base.text
    })
  },
  success: {
    icon: {
      name: 'emoji-happy',
      color: '#32CD32',
      image: require('../../../assets/images/toast/icon_success.png')
    },
    styles: StyleSheet.create({
      container: StyleSheet.flatten([
        base.container,
        { backgroundColor: '#32CD32' }
      ]),
      text: base.text
    })
  },
  warning: {
    icon: {
      name: 'emoji-neutral',
      color: 'white',
      image: require('../../../assets/images/toast/icon_info.png')
    },
    styles: StyleSheet.create({
      container: StyleSheet.flatten([
        base.container,
        { backgroundColor: '#ec971f' }
      ]),
      text: base.text
    })
  },
  error: {
    icon: {
      name: 'emoji-sad',
      color: '#FF4500',
      image: require('../../../assets/images/toast/icon_error.png')
    },
    styles: StyleSheet.create({
      container: StyleSheet.flatten([
        base.container,
        { backgroundColor: '#FF4500' }
      ]),
      text: base.text
    })
  }
}
