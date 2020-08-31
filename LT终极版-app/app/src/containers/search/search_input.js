import React, { Component, PureComponent } from 'react'
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  Image
} from 'react-native'
import { SafeAreaView } from 'react-navigation'
import p2d from '../../expand/tool/p2d'
import { ScrollView } from 'react-native-gesture-handler'
import { inject, observer } from 'mobx-react'
import { SERVICE_TYPES, QNetwork } from '../../expand/services/services.js'

@inject('searchStore', 'appStore')
@observer
export default class SearchInputContainer extends Component {
  constructor(props) {
    super(props)
    this.state = { searchText: '', topSearchs: null }
  }
  onSubmitEditing = e => {
    if (e.nativeEvent.text.length < 2) {
      this.props.appStore.showToastWithOpacity('至少输入两个字哦')
      return
    }
    this.handleSearch(e.nativeEvent.text)
  }
  handleSearch = text => {
    const { searchHistory } = this.props.searchStore
    const result = searchHistory.filter(item => item === text)
    result.length && searchHistory.remove(result[0])
    searchHistory.unshift(text)
    if (searchHistory.length > 20) searchHistory.slice(0, 20)
    this.setState({ searchText: text })
    this.props.navigation.navigate('SearchProductResult', {
      keyword: text
    })
  }
  _onChangeText = text => {
    this.setState({ searchText: text })
  }
  cancel = () => {
    this.props.navigation.goBack()
  }
  clearSearchHistory = () => {
    this.props.searchStore.searchHistory = []
  }
  clearCurrentInputText = () => {
    this.setState({ searchText: '' })
  }
  componentDidMount() {
    this.listener = this.props.navigation.addListener('didFocus', () => {
      this.textInput.focus()
    })
    this.getTopSearchs()
  }
  componentWillUnmount() {
    this.listener && this.listener.remove()
  }

  getTopSearchs = () => {
    QNetwork(
      SERVICE_TYPES.search.TOP_SEARCHES,
      {},
      response => {
        this.setState({ topSearchs: response.data.top_searches })
      },
      error => {}
    )
  }
  render() {
    const { searchHistory } = this.props.searchStore
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <TextInput
            maxLength={60}
            returnKeyType={'search'}
            selectionColor={'#4974F0'}
            ref={ref => {
              this.textInput = ref
            }}
            value={this.state.searchText}
            placeholder={'海量单品等你来搜'}
            onChangeText={this._onChangeText}
            autoFocus={true}
            onSubmitEditing={this.onSubmitEditing}
            style={styles.textInput}
            underlineColorAndroid="transparent"
            textAlignVertical={'center'}
          />
          <TouchableOpacity onPress={this.cancel}>
            <Text style={styles.cancelText}>取消</Text>
          </TouchableOpacity>

          {this.state.searchText ? (
            <TouchableOpacity
              hitSlop={styles.hitSlop}
              style={styles.clearIcon}
              onPress={this.clearCurrentInputText}>
              <Image
                style={styles.imageClaer}
                source={require('../../../assets/images/search/clear.png')}
              />
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={styles.headerLine} />

        <ScrollView
          style={styles.scrollContainer}
          keyboardShouldPersistTaps={'handled'}>
          {!!searchHistory.length && (
            <SearchTips
              onPressItem={this.handleSearch}
              onPressHeaaderButton={this.clearSearchHistory}
              data={searchHistory}
              title={'历史搜索'}
              showRightButton={true}
              rows={2}
              style={styles.history}
            />
          )}
          {!!this.state.topSearchs && (
            <SearchTips
              onPressItem={this.handleSearch}
              data={this.state.topSearchs}
              title={'热门搜索'}
              rows={4}
              style={!searchHistory.length ? styles.history : styles.hot}
            />
          )}
        </ScrollView>
      </SafeAreaView>
    )
  }
}

class SearchTips extends Component {
  render() {
    const {
      title,
      showRightButton,
      data,
      rows,
      style,
      onPressHeaaderButton,
      onPressItem
    } = this.props
    return (
      <View style={style}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          {showRightButton ? (
            <TouchableOpacity onPress={onPressHeaaderButton}>
              <Image
                source={require('../../../assets/images/search/trash.png')}
              />
            </TouchableOpacity>
          ) : null}
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            maxHeight: 38 * rows,
            flexWrap: 'wrap',
            overflow: 'hidden',
            marginTop: 8
          }}>
          {data.map((item, index) => {
            return (
              <SearchText
                key={index}
                item={item.text || item}
                onPress={onPressItem}
              />
            )
          })}
        </View>
      </View>
    )
  }
}
class SearchText extends PureComponent {
  onPress = () => {
    const { onPress, item } = this.props
    onPress && onPress(item)
  }
  render() {
    const { item } = this.props
    return (
      <TouchableOpacity style={styles.searchTagButton} onPress={this.onPress}>
        <Text numberOfLines={1} style={styles.searchContentText}>
          {item}
        </Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { paddingHorizontal: 16, width: '100%', paddingBottom: 100 },
  headerContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  textInput: {
    backgroundColor: '#F7F7F7',
    width: p2d(300),
    height: p2d(32),
    borderRadius: 16,
    padding: 0,
    paddingLeft: 10,
    fontSize: 14,
    color: '#5E5E5E',
    paddingRight: p2d(32)
  },
  cancelText: { color: '#989898', fontSize: 14 },
  hitSlop: { top: 10, bottom: 10, left: 10, right: 10 },
  clearIcon: { position: 'absolute', left: p2d(290) },
  headerLine: {
    backgroundColor: '#F7F7F7',
    height: 1,
    width: '100%',
    marginTop: 5
  },
  titleContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginRight: 10
  },
  title: { fontSize: 14, color: '#242424' },
  searchTagButton: {
    backgroundColor: '#F7F7F7',
    height: 26,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginRight: 10,
    marginTop: 12
  },
  searchContentText: { fontSize: 12, color: '#989898' },
  history: {
    marginTop: 24
  },
  hot: { marginTop: 45 },
  imageClaer: { height: p2d(15), width: p2d(15) }
})
