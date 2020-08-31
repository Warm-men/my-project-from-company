import PastTote from './individual_past_tote'
import ResponsiveInfiniteScroll from 'src/app/components/shared/responsive_infinite_scroll'
import { connect } from 'react-redux'
import LoadingIndicator from 'src/app/containers/browse_collection/loading_indicator'
import Actions from 'src/app/actions/actions.js'
import PageHelmet from 'src/app/lib/pagehelmet'
import ProductsLoading from 'src/app/containers/products/products_loading/index'
import { useState, useEffect } from 'react'
import './index.scss'

function mapStateToProps(state) {
  return { totes: state.totes }
}

export default connect(mapStateToProps)(PastTotesList)
function PastTotesList(props) {
  const [isLoading, setIsLoading] = useState(false)
  const { totes, dispatch } = props

  useEffect(() => {
    if (_.isEmpty(props.totes.past_totes)) {
      dispatch(Actions.totes.fetchPastTotes(1))
    }
  }, [])

  const fetchPastTotes = () => {
    if (!isLoading) {
      setIsLoading(true)
      dispatch(
        Actions.totes.fetchPastTotes(totes.past_totes_page, () =>
          setIsLoading(false)
        )
      )
    }
  }

  if (!_.isEmpty(totes) && !_.isEmpty(totes.past_totes)) {
    const { past_totes, additional_past_totes_available } = totes
    return (
      <div className="past-tote-container">
        <PageHelmet title="历史衣箱" link="/past_totes_list" />
        <ResponsiveInfiniteScroll
          onScrollToBottom={fetchPastTotes}
          isLoading={isLoading}
          isMore={additional_past_totes_available}
        >
          {_.map(past_totes, tote => (
            <PastTote tote={tote} key={tote.id} dispatch={props.dispatch} />
          ))}
          {additional_past_totes_available && !isLoading && (
            <LoadingIndicator />
          )}
        </ResponsiveInfiniteScroll>
        {isLoading && <ProductsLoading />}
      </div>
    )
  } else {
    return null
  }
}
