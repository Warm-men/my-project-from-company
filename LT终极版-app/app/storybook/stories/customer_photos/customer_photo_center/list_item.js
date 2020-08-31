import React, { PureComponent } from 'react'
import { View, StyleSheet, Image, Text } from 'react-native'
import Photos from '../customer_photos_in_product/customer_photo/photos'
import Customers from '../customer_photo/customers'
import { Column } from '../../../../src/expand/tool/add_to_closet_status'
import dateFns from 'date-fns'
export default class CustomerPhotoList extends PureComponent {
  goLandingPage = uri => {
    const { navigation } = this.props
    navigation.navigate('WebPage', { uri, hideShareButton: true })
  }

  _onClick = index => {
    const { navigation, data } = this.props
    navigation.navigate('CustomerPhotoFinished', {
      data,
      id: data.id,
      column: Column.CustomerPhotoFinished,
      sharePoster: true,
      index
    })
  }

  _getShareTopics = () => {
    const { share_topics } = this.props.data
    let topics = []
    share_topics.map((item, index) => {
      topics.push(
        <Text
          key={index}
          style={styles.shareTopics}
          onPress={() => this.goLandingPage(item.url)}>
          {item.title}
        </Text>
      )
    })
    topics.push(<Text key={share_topics.length + 1}>{'  '}</Text>)
    return topics
  }

  render() {
    const { data } = this.props
    if (!data) return
    const { featured, content, photos, id, created_at, customer } = data
    const time = dateFns.format(created_at, 'YYYY-MM-DD')
    const shareTopics = this._getShareTopics()
    return (
      <View style={styles.container}>
        <View style={styles.textView}>
          <Text style={styles.time}>{time}</Text>
          <View>
            <Text style={styles.content}>
              {featured && <Text>{`                `}</Text>}
              {shareTopics}
              {content}
            </Text>
            {featured && (
              <Image
                style={styles.featuredIcon}
                source={require('../../../../assets/images/customer_photos/featured_icon.png')}
              />
            )}
          </View>
        </View>
        <Photos photos={photos} id={id} onClick={this._onClick} />
        <View style={styles.customersView}>
          <Customers id={id} customer={customer} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    borderBottomColor: '#f7f7f7',
    borderBottomWidth: 7
  },
  textView: {
    paddingHorizontal: 15,
    marginBottom: 12
  },
  time: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginBottom: 12
  },
  featuredIcon: {
    position: 'absolute',
    width: 45,
    height: 18,
    backgroundColor: '#E85C40',
    borderRadius: 2,
    top: 1
  },
  content: {
    color: '#000',
    fontSize: 14,
    lineHeight: 20,
    zIndex: 99
  },
  shareTopics: {
    color: '#E85C40'
  },
  customersView: {
    flex: 1,
    marginTop: 24
  }
})
