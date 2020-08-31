import React, { PureComponent } from 'react'
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView
} from 'react-native'
import WelfareIntroduction from './welfare_introduction'
import Image from '../../../../storybook/stories/image'
import p2d from '../../../../src/expand/tool/p2d'
export default class OpenContract extends PureComponent {
  render() {
    const {
      openAgreement,
      enableContract,
      contractTextData: { openContractWelfare, agreement }
    } = this.props

    return (
      <View style={styles.container}>
        <ScrollView style={styles.container}>
          <Image
            style={styles.bannerImage}
            source={{
              uri: openContractWelfare && openContractWelfare.bannerUrl
            }}
          />
          <View style={styles.introView}>
            {openContractWelfare &&
              openContractWelfare.contentArray &&
              openContractWelfare.contentArray.map((item, index) => {
                return (
                  <WelfareIntroduction
                    key={index}
                    title={item.title}
                    logoUrl={item.logoUrl}
                    description={item.description}
                    subDescription={item.subDescription}
                  />
                )
              })}
          </View>
          {agreement && (
            <TouchableOpacity
              style={styles.agreementView}
              onPress={openAgreement}>
              <Text style={styles.agreementText}>{'《免密支付协议》'}</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
        <TouchableOpacity
          style={styles.enableContractButton}
          onPress={enableContract}>
          <View style={styles.enableContractView}>
            <Text style={styles.enableContractText}>{'去开通'}</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  bannerImage: {
    width: p2d(375),
    height: p2d(120)
  },
  introView: {
    marginTop: p2d(34)
  },
  agreementView: {
    marginTop: p2d(5),
    alignItems: 'center',
    marginBottom: p2d(55)
  },
  agreementText: {
    fontSize: 14,
    color: '#70AAEF'
  },
  enableContractButton: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingVertical: p2d(8),
    paddingHorizontal: p2d(15)
  },
  enableContractView: {
    width: '100%',
    height: p2d(44),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E85C40',
    borderRadius: p2d(3)
  },
  enableContractText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '600'
  }
})
