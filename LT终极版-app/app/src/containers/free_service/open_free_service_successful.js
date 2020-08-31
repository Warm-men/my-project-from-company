import React, { PureComponent } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import Image from '../../../storybook/stories/image'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'
import Icons from 'react-native-vector-icons/MaterialIcons'
import { abTrack } from '../../components/ab_testing'

export default class OpenFreeServiceSuccessfulContainer extends PureComponent {
  componentDidMount() {
    abTrack('open_free_service_successful_page', 1)
  }
  _goBack = () => {
    this.props.navigation.popToTop()
  }

  openFreeServiceHelp = () => {
    this.props.navigation.navigate('FreeServiceHelp')
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          title={'自在选'}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <Image
          style={styles.image}
          source={require('../../../assets/images/free_service/sucsess.png')}
        />
        <Text style={styles.text}>已开通自在选</Text>

        <View style={styles.gobackButtonContainer}>
          <TouchableOpacity style={styles.gobackButton} onPress={this._goBack}>
            <Text style={styles.goback}>返回</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={this.openFreeServiceHelp}
          style={styles.helpContainer}>
          <Text style={styles.help}>使用帮助</Text>
          <Icons size={18} name="keyboard-arrow-right" color={'#333'} />
        </TouchableOpacity>
      </SafeAreaView>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  text: {
    marginTop: 30,
    color: '#989898',
    fontSize: 14
  },
  price: {
    marginTop: 22,
    color: '#242424',
    fontSize: 32
  },
  image: { marginTop: 88 },
  help: {
    fontSize: 13,
    color: '#5E5E5E'
  },
  helpContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 40,
    position: 'absolute',
    bottom: 0,
    marginBottom: 97,
    height: 50,
    width: 100
  },
  goback: {
    color: '#5E5E5E',
    fontSize: 14
  },
  gobackButtonContainer: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    justifyContent: 'flex-end'
  },
  gobackButton: {
    marginBottom: 8,
    width: '90%',
    height: 44,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24
  }
})
