import React, { PureComponent, Component } from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import p2d from '../../../src/expand/tool/p2d'
import PropTypes from 'prop-types'
import Image from '../image'
import { inject, observer } from 'mobx-react'
import Icon from 'react-native-vector-icons/EvilIcons'
import Statistics from '../../../src/expand/tool/statistics'

@inject('modalStore')
@observer
class QuitAlert extends Component {
  _close = () => {
    const { modalStore, data } = this.props
    Statistics.profileIncrement(data.sensors_close_id)
    modalStore.setModalVisible(false)
  }
  _didSelectedItem = reasonItem => {
    const routeName = reasonItem.route_name
    const { navigation, modalStore } = this.props
    if (routeName) {
      if (routeName.indexOf('https') > -1) {
        navigation.navigate('WebPage', {
          uri: routeName
        })
      } else {
        navigation.navigate(routeName)
      }
    }
    reasonItem.sensors_id && Statistics.profileIncrement(reasonItem.sensors_id)
    modalStore.setModalVisible(false)
  }
  render() {
    const { data, reportDate, hideChevronRight } = this.props
    return (
      <View style={styles.overlay}>
        <View style={styles.overlayView}>
          <Image
            style={
              data.description
                ? styles.backgroundImageWithDesc
                : styles.backgroundImage
            }
            source={{ uri: data.popBackgroundImage }}
          />
          <TouchableOpacity
            activeOpacity={0.85}
            hitSlop={{ top: 10, left: 20, right: 20, bottom: 10 }}
            onPress={this._close}
            style={styles.closeButton}>
            <Icon name={'close'} size={28} style={styles.closeIcon} />
          </TouchableOpacity>
          <View
            style={
              data.description
                ? styles.titleContainerWithDesc
                : styles.titleContainer
            }>
            <Text style={styles.title}>{data.title}</Text>
            {data.description ? (
              <Text style={styles.description}>{data.description}</Text>
            ) : null}
          </View>
          {data.content.map((item, key) => {
            return (
              <Reason
                reasonItem={item}
                key={key}
                hideChevronRight={hideChevronRight}
                reportDate={reportDate}
                didSelectedItem={this._didSelectedItem}
              />
            )
          })}
        </View>
      </View>
    )
  }
}

class Reason extends PureComponent {
  _didSelectedItem = () => {
    const { reasonItem, didSelectedItem, reportDate } = this.props
    didSelectedItem(reasonItem)
    reportDate && reportDate(reasonItem)
  }
  render() {
    const { reasonItem, hideChevronRight } = this.props
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={this._didSelectedItem}
        style={[
          styles.reasonItem,
          hideChevronRight
            ? { borderRadius: p2d(20), justifyContent: 'center' }
            : null
        ]}>
        <View style={styles.viewWrap}>
          {reasonItem.icon_url && (
            <Image
              style={styles.itemIcon}
              source={{ uri: reasonItem.icon_url }}
            />
          )}
          <Text style={styles.subTitle}>{reasonItem.sub_title}</Text>
        </View>
        {!hideChevronRight && (
          <Icon
            name={'chevron-right'}
            size={20}
            color={'#666'}
            style={styles.chevronIcon}
          />
        )}
      </TouchableOpacity>
    )
  }
}

QuitAlert.propTypes = {
  content: PropTypes.object
}

const styles = StyleSheet.create({
  overlay: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'rgba(0,0,0, 0.5)'
  },
  overlayView: {
    backgroundColor: '#fff',
    width: p2d(250),
    borderRadius: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: p2d(24)
  },
  viewWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 15,
    color: '#FFF',
    paddingTop: p2d(22),
    fontWeight: '600'
  },
  backgroundImage: {
    width: p2d(250),
    height: p2d(64),
    position: 'absolute'
  },
  backgroundImageWithDesc: {
    width: p2d(250),
    height: p2d(84),
    position: 'absolute'
  },
  reasonItem: {
    width: '80%',
    height: p2d(40),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#D9D9D9',
    borderRadius: 3,
    backgroundColor: '#FCFCFC',
    marginTop: p2d(12)
  },
  itemIcon: {
    width: p2d(20),
    height: p2d(20),
    marginLeft: p2d(18),
    marginRight: p2d(10)
  },
  chevronIcon: {
    marginRight: p2d(5)
  },
  subTitle: {
    fontSize: 14,
    color: '#5E5E5E'
  },
  closeButton: {
    zIndex: 1,
    position: 'absolute',
    right: p2d(10),
    top: p2d(10)
  },
  closeIcon: {
    color: '#ddd'
  },
  titleContainer: {
    width: '100%',
    height: p2d(64),
    alignItems: 'center'
  },
  titleContainerWithDesc: {
    width: '100%',
    height: p2d(84),
    alignItems: 'center'
  },
  description: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 10
  }
})

export default QuitAlert
