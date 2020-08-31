import ToteTracker from 'src/app/containers/totes/components/tote_tracker'

const EmptyView = React.lazy(() =>
  import('src/app/containers/totes/components/empty_totes')
)

export default function CurrentTotesContainer(props) {
  const {
    totes,
    dispatch,
    customer,
    authentication,
    hasAbnormalCard,
    customerPhotosHint,
    markToteAsDelivered
  } = props
  if (!totes) return null
  if (!totes.length && !hasAbnormalCard) {
    return <EmptyView showButton={customer.display_cart_entry} />
  }
  return _.map(totes, v => {
    return (
      <ToteTracker
        tote={v}
        key={v.id}
        totes={totes}
        dispatch={dispatch}
        customer={customer}
        authentication={authentication}
        hasAbnormalCard={hasAbnormalCard}
        customerPhotosHint={customerPhotosHint}
        markToteAsDelivered={markToteAsDelivered}
      />
    )
  })
}
