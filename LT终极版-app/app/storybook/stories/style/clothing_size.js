import React, { PureComponent } from 'react'
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native'
import { SafeAreaView } from '../navigationbar'
import PickerMeSizeCircular from '../account/picker_me_size_circular'
import BottomButton from '../../../src/containers/account/me_style/me_style_bottom_button'
import MeStyleCommonTitle from '../account/me_style_common_title'
import {
  DRESS_SIZES,
  PANT_SIZES,
  TOP_SIZES_ABBR,
  SKIRT_SIZES,
  JEAN_SIZES
} from '../../../src/expand/tool/size/size'

export default class SizeComponent extends PureComponent {
  render() {
    const {
      showStep,
      goback,
      isDone,
      style,
      isLoading,
      sizeChange,
      alertCheck
    } = this.props
    return (
      <SafeAreaView>
        <ScrollView
          style={styles.container}
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}>
          <MeStyleCommonTitle
            titleText={'合身-常穿尺码'}
            descriptText={'请根据你以往的穿衣习惯，核对以下常穿尺码'}
            style={styles.meStyleCommonTitle}
            step={'5/6'}
            showStep={showStep}
          />
          <View style={styles.sizeView}>
            <PickerMeSizeCircular
              size={style.topSize}
              sizeChange={sizeChange}
              title={'上衣'}
              dataType={'topSize'}
              data={TOP_SIZES_ABBR}
              disabled={isLoading}
            />
            <PickerMeSizeCircular
              size={style.pantSize}
              sizeChange={sizeChange}
              title={'裤子'}
              dataType={'pantSize'}
              data={PANT_SIZES}
              disabled={isLoading}
            />
            <PickerMeSizeCircular
              size={style.jeanSize}
              sizeChange={sizeChange}
              title={'牛仔裤'}
              dataType={'jeanSize'}
              data={JEAN_SIZES}
              disabled={isLoading}
            />
            <PickerMeSizeCircular
              size={style.dressSize}
              sizeChange={sizeChange}
              title={'连衣裙'}
              dataType={'dressSize'}
              data={DRESS_SIZES}
              disabled={isLoading}
            />
            <PickerMeSizeCircular
              size={style.skirtSize}
              sizeChange={sizeChange}
              title={'半裙'}
              dataType={'skirtSize'}
              data={SKIRT_SIZES}
              disabled={isLoading}
            />
          </View>
        </ScrollView>
        <BottomButton
          goback={goback}
          next={alertCheck}
          isDone={isDone}
          nextText={'确认无误'}
        />
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
    flexDirection: 'column',
    marginTop: 20,
    width: Dimensions.get('window').width
  },
  sizeView: {
    marginBottom: 20
  }
})
