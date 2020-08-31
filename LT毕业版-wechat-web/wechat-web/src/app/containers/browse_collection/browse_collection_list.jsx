import { connect } from 'react-redux'
import ProgressiveImage from 'src/app/components/ProgressiveImage'
import { browserHistory } from 'react-router'
import * as storage from 'src/app/lib/storage.js'
import Actions from 'src/app/actions/actions'
import PageHelmet from 'src/app/lib/pagehelmet'
import CollectionView from 'src/app/components/custom_components/collectionView'
import './index.scss'

function mapStateToProps(state) {
  return {
    collectionList: state.collectionList
  }
}

@connect(mapStateToProps)
export default class BrowseCollectionList extends React.Component {
  componentDidMount() {
    const { collections } = this.props.collectionList
    _.isEmpty(collections) && this.getCollections()
  }

  getCollections = () => {
    const { page } = this.props.collectionList
    const action = Actions.collectionList.collections(page)
    this.props.dispatch(action)
  }

  gotoCollections = collection => async () => {
    if (collection.collection_type === 'link' && collection.link) {
      window.location.href = collection.link
      return null
    }
    const url = `/collections/${collection.id}`
    storage.set(url, 0)
    const action = Actions.browseCollections.clearProducts(collection.id)
    await this.props.dispatch(action)
    browserHistory.push(url)
  }

  render() {
    const { collections, more, loading } = this.props.collectionList
    return (
      <div className="collections-list">
        <PageHelmet title="时尚专题" link="collections_list" />
        <CollectionView
          collectionName="collection"
          numberOfSections={1}
          numberOfItemsInSection={() => collections.length}
          collectionCell={indexPath => {
            const index = indexPath.row
            const { banner_photo_url } = collections[index]
            return (
              <div className="collections-box">
                <ProgressiveImage
                  src={banner_photo_url}
                  placeholder={require('../../../assets/images/placeholder/placeholder_690_279.png')}
                >
                  {image => (
                    <img
                      alt=""
                      src={image}
                      className={
                        index === collections.length - 1 ? '' : 'theme-banner'
                      }
                      onClick={this.gotoCollections(collections[index])}
                    />
                  )}
                </ProgressiveImage>
              </div>
            )
          }}
          isMore={more}
          isLoading={loading}
          onScrollToBottom={this.getCollections}
          didSelected={() => {}}
        />
      </div>
    )
  }
}
