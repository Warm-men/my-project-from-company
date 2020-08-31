import { useState, useEffect } from 'react'
import NonMembersCartButton from 'src/app/containers/product/non_members_cart_button'
import NewTotesButtons from 'src/app/containers/product/detail_buttons/new_totes_buttons.jsx'
import { getButtonProps } from 'src/app/containers/product/detail_buttons/utils/product_detail_bottom_btn_util.js'
import CollectionAndCartButton from 'src/app/containers/product/collection_cart_button.jsx'
import ProductDetailGuide from 'src/app/containers/product/guide'
import * as storage from 'src/app/lib/storage.js'
import './index.scss'

export default function ProductDetailButtons(props) {
  const { isVacation, customer, inCloset, product, isOnboardingSwap } = props

  const { isSubscriber } = props.authentication

  const [isShowGuide, setIsShowGuide] = useState(false)

  useEffect(() => {
    if (
      isSubscriber &&
      !storage.get('ProductDetailGuide', localStorage) &&
      !isShowGuide
    ) {
      setIsShowGuide(true)
    }
  }, [isSubscriber])

  const handleFinish = e => {
    storage.set('ProductDetailGuide', true, localStorage)
    setIsShowGuide(false)
    e.preventDefault()
  }

  const {
    loading,
    toggleCloset,
    linkToPlans,
    handleAddToCart,
    selectSizeObject,
    toteCart
  } = props
  const { text, disabled } = getButtonProps(product, selectSizeObject, toteCart)
  if (isOnboardingSwap) {
    return (
      <div className="product-detail-buttons">
        <NewTotesButtons
          inCloset={inCloset}
          addToCollect={toggleCloset}
          handleAddToCart={handleAddToCart}
          displayCartEntry={false}
          buttonText={text}
          disabled={loading || disabled}
        />
      </div>
    )
  }
  return (
    <div className="product-detail-buttons">
      {isSubscriber ? (
        customer.display_cart_entry ? (
          <NewTotesButtons
            buttonText={text}
            inCloset={inCloset}
            addToCollect={toggleCloset}
            disabled={loading || disabled}
            handleAddToCart={handleAddToCart}
            displayCartEntry={customer.display_cart_entry}
          />
        ) : (
          <CollectionAndCartButton
            isShow={true}
            inCloset={inCloset}
            onToggleInCloset={toggleCloset}
          />
        )
      ) : isVacation ? (
        <CollectionAndCartButton
          isShow={true}
          inCloset={inCloset}
          onToggleInCloset={toggleCloset}
        />
      ) : (
        <NonMembersCartButton
          inCloset={inCloset}
          isSubscriber={isSubscriber}
          addToCollect={toggleCloset}
          linkToPlans={linkToPlans}
          full_price={product.full_price}
          location={props.location}
          customer={props.customer}
          dispatch={props.dispatch}
        />
      )}
      {isShowGuide && <ProductDetailGuide handleFinish={handleFinish} />}
    </div>
  )
}
