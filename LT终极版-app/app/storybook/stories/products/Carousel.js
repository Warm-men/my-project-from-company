import React from 'react'
import { Platform, StatusBar } from 'react-native'
import { AlbumView, Overlay } from '../../../storybook/stories/teaset'

function dismissFullscreenImage(fullscreenImage) {
  fullscreenImage && fullscreenImage.close()
}

function showFullscreenImage(
  imgRefs,
  index,
  getProductImages,
  fullscreenImage
) {
  let pressView = imgRefs
  pressView.measure((x, y, width, height, pageX, pageY) => {
    let overlayView = (
      <Overlay.PopView
        style={{}}
        containerStyle={{ flex: 1 }}
        overlayOpacity={1}
        type="custom"
        customBounds={{ x: pageX, y: pageY, width, height }}
        ref={ref => (fullscreenImage = ref)}>
        <AlbumView
          style={{ flex: 1 }}
          control={true}
          images={getProductImages()}
          defaultIndex={index}
          onPress={() => {
            dismissFullscreenImage(fullscreenImage)
          }}
        />
        <StatusBar
          animated={false}
          hidden={Platform.OS === 'ios' ? true : false}
        />
      </Overlay.PopView>
    )
    Overlay.show(overlayView)
  })
}

export { dismissFullscreenImage, showFullscreenImage }
