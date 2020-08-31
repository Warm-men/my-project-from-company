import React from 'react'
import PropTypes from 'prop-types'

const CollectionCell = React.memo(
  ({ didSelected, section, row, cellSize, cell }) => {
    if (!cell) {
      return null
    }
    const style = {
      width: cellSize.x,
      height: cellSize.y,
      marginBottom: '5px',
      overflow: 'hidden'
    }
    return (
      <li onClick={didSelected(section, row)} style={style}>
        {cell}
      </li>
    )
  }
)

export default class CollectionView extends React.PureComponent {
  componentDidMount() {
    const { onScroll, onScrollToBottom } = this.props
    if (onScroll || onScrollToBottom) {
      window.addEventListener('scroll', this.handleScroll)
    }
  }

  componentWillUnmount() {
    const { onScroll, onScrollToBottom } = this.props
    if (onScroll || onScrollToBottom) {
      window.removeEventListener('scroll', this.handleScroll)
    }
  }

  handleScroll = () => {
    const { onScroll, onScrollToBottom, isMore, isLoading } = this.props

    let scrollPosition =
        document.body.scrollTop || document.documentElement.scrollTop,
      totalPageLength = document.body.scrollHeight,
      visibleHeight = window.innerHeight

    onScroll && onScroll(scrollPosition)

    if (scrollPosition + visibleHeight * 1.67 >= totalPageLength) {
      if (!isLoading && isMore) {
        onScrollToBottom && onScrollToBottom()
      }
    }
  }

  renderRowItem = (section, row) => {
    const { collectionCell, didSelected, itemSize } = this.props
    const indexPath = { section: section, row: row }
    const cell = collectionCell(indexPath)
    const cellSize = itemSize(indexPath)

    return (
      <CollectionCell
        didSelected={didSelected}
        section={section}
        row={row}
        cellSize={cellSize}
        cell={cell}
        key={'section' + section + 'row' + row}
      />
    )
  }

  renderHeaderItem = section => {
    return (
      <div style={{ overflow: 'hidden' }} key={'headerSection' + section}>
        {this.props.headerView(section)}
      </div>
    )
  }

  renderFooterItem = section => {
    return (
      <div style={{ overflow: 'hidden' }} key={'footerSection' + section}>
        {this.props.footerView(section)}
      </div>
    )
  }

  renderSectionItem = (section, row) => {
    const header = this.renderHeaderItem(section)
    const footer = this.renderFooterItem(section)
    const items = []
    for (let i = 0; i < row; i++) {
      items.push(this.renderRowItem(section, i))
    }
    return (
      <div style={this.props.style} key={'collectionSection' + section}>
        {header}
        <ul style={{ margin: 0, padding: 0 }}> {items} </ul>
        {footer}
      </div>
    )
  }

  render() {
    const {
      numberOfSections,
      numberOfItemsInSection,
      collectionName
    } = this.props

    const numberOfSectionAndItems = []
    for (let i = 0; i < numberOfSections; i++) {
      numberOfSectionAndItems.push(numberOfItemsInSection(i))
    }
    return (
      <div className={collectionName || ''} style={{ textAlign: 'left' }}>
        {numberOfSectionAndItems.map((item, index) =>
          this.renderSectionItem(index, item)
        )}
      </div>
    )
  }
}

CollectionView.propTypes = {
  numberOfSections: PropTypes.number.isRequired,
  numberOfItemsInSection: PropTypes.func.isRequired,
  collectionCell: PropTypes.func.isRequired,
  headerView: PropTypes.func,
  footerView: PropTypes.func,
  itemSize: PropTypes.func,
  didSelected: PropTypes.func,
  collectionName: PropTypes.string,
  onScroll: PropTypes.func,
  onScrollToBottom: PropTypes.func,
  isMore: PropTypes.bool,
  isLoading: PropTypes.bool
}

CollectionView.defaultProps = {
  itemSize: () => ({ x: '100%', y: 'auto' }),
  footerView: () => {},
  headerView: () => {},
  isMore: false,
  isLoading: false
}
