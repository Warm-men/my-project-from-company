import React, { Component } from 'react'
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet
} from 'react-native'
import Image from '../../../storybook/stories/image'
import Video from 'react-native-video'
import p2d from '../../../src/expand/tool/p2d'

export default class OpenFreeService extends Component {
  constructor(props) {
    super(props)
    this.state = {
      paused: true,
      openMoreFaq: false
    }
  }
  openMoreFaq = () => {
    this.setState({ openMoreFaq: true })
  }
  playVideo = () => {
    this.setState({ paused: false })
  }
  onEnd = () => {
    this.setState({ paused: true })
  }

  render() {
    const {
      isContarcted,
      openFreeServiceHelp,
      openFreeService,
      openClothesCleanFlow
    } = this.props
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          {this.state.paused ? (
            <TouchableOpacity
              style={styles.imageBanner}
              onPress={this.playVideo}>
              <Image
                style={styles.imageBanner}
                resizeMode="contain"
                source={require('../../../assets/images/free_service/free_service_banner.png')}
                description={'自在选开通视频播放点击'}
              />
            </TouchableOpacity>
          ) : (
            <Video
              hideShutterView={true}
              onEnd={this.onEnd}
              ref={ref => {
                this.player = ref
              }}
              style={styles.imageBanner}
              source={{
                uri:
                  'https://static.letote.cn/free_service/vedio/free_service.mp4'
              }}
              resizeMode={'contain'}
              controls={true}
              paused={this.state.paused}
            />
          )}
          <View style={styles.imageContainer}>
            <View>
              <Image
                style={styles.imageDesc}
                source={require('../../../assets/images/free_service/free_service_desc.png')}
              />
              <View style={styles.openFreeServiceButton}>
                <Text style={styles.desc}>
                  {isContarcted
                    ? '自动续费会员可免费开通自在选服务'
                    : '开通自动续费，免费享自在选特权，可随时取消'}
                </Text>
                <TouchableOpacity
                  onPress={openFreeService}
                  style={styles.openFreeService}>
                  <Text style={styles.openText}>{'免费开通'}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <Image
                style={styles.imageUsageHelp}
                source={require('../../../assets/images/free_service/free_service_usage_help.png')}
              />
              <TouchableOpacity
                onPress={openFreeServiceHelp}
                style={styles.moreDetailContainer}>
                <Text style={styles.moreDetail}>进一步了解>></Text>
              </TouchableOpacity>
            </View>
            <View>
              <Image
                style={styles.experience}
                source={require('../../../assets/images/free_service/free_service_experience.png')}
              />
              <View style={styles.openFreeServiceButton}>
                <Text style={styles.desc}>
                  {isContarcted
                    ? '自动续费会员可免费开通自在选服务'
                    : '开通自动续费，免费享自在选特权，可随时取消'}
                </Text>
                <TouchableOpacity
                  onPress={openFreeService}
                  style={styles.openFreeService}>
                  <Text style={styles.openText}>{'免费开通'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {!this.state.openMoreFaq ? (
              <View>
                <Image
                  style={styles.faqMini}
                  source={require('../../../assets/images/free_service/faq_mini.png')}
                />
                <TouchableOpacity
                  testID="test-more-faq"
                  style={styles.moreFaq}
                  onPress={this.openMoreFaq}>
                  <Text>展开全部</Text>
                  <Image
                    style={styles.arrowDown}
                    source={require('../../../assets/images/sizeTutorial/arrow.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.handleFlow}
                  onPress={openClothesCleanFlow}>
                  <Text style={styles.moreDetail}>点击查看处理流程>></Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View testID="test-more-faq-container">
                <Image
                  style={styles.faqComplete1}
                  source={require('../../../assets/images/free_service/faq_complete1.png')}
                />
                <Image
                  style={styles.faqComplete2}
                  source={require('../../../assets/images/free_service/faq_complete2.png')}
                />
                <TouchableOpacity
                  style={styles.handleFlowMore}
                  onPress={openClothesCleanFlow}>
                  <Text style={styles.moreDetail}>点击查看处理流程>></Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageBanner: {
    position: 'absolute',
    width: '100%',
    height: p2d(211)
  },
  imageContainer: {
    marginTop: p2d(211)
  },
  imageDesc: {
    height: p2d(665),
    width: '100%'
  },
  imageUsageHelp: {
    width: '100%',
    height: p2d(616)
  },
  experience: {
    width: '100%',
    height: p2d(747)
  },
  faqMini: {
    width: '100%',
    height: p2d(751)
  },
  faqComplete1: {
    width: '100%',
    height: p2d(630)
  },
  faqComplete2: {
    width: '100%',
    height: p2d(699)
  },
  imageFeature: {
    width: '100%',
    height: p2d(380)
  },
  openContainer: {
    width: '100%',
    position: 'absolute',
    top: p2d(400),
    alignItems: 'center',
    justifyContent: 'center'
  },
  openFreeService: {
    alignItems: 'center',
    justifyContent: 'center',
    width: p2d(303),
    height: p2d(44),
    backgroundColor: '#E85C40',
    borderRadius: 4
  },
  openText: {
    fontSize: 14,
    color: '#FFFFFF'
  },
  openFreeServiceButton: {
    width: '100%',
    position: 'absolute',
    bottom: p2d(45),
    alignItems: 'center',
    justifyContent: 'center'
  },
  moreFaq: {
    width: '100%',
    position: 'absolute',
    bottom: p2d(80),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  handleFlow: {
    width: '100%',
    position: 'absolute',
    bottom: p2d(134),
    justifyContent: 'center',
    marginLeft: p2d(99)
  },
  handleFlowMore: {
    width: '100%',
    position: 'absolute',
    top: p2d(597),
    justifyContent: 'center',
    marginLeft: p2d(99)
  },
  desc: {
    marginBottom: 16,
    fontSize: 12,
    color: '#989898'
  },
  helpContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  help: {
    fontSize: 13,
    color: '#5E5E5E',
    marginLeft: 6
  },
  moreDetail: {
    color: '#70AAEF'
  },
  moreDetailContainer: {
    width: '100%',
    bottom: p2d(40),
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  },
  arrowDown: {
    width: 11,
    height: 6,
    marginLeft: 3
  }
})
