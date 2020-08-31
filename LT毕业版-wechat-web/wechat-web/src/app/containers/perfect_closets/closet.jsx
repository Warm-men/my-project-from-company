import on from 'src/app/components/customer_photos/images/on.png'
import off from 'src/app/components/customer_photos/images/off.png'

export default function Closet(props) {
  const onSelected = () => props.updatePerfectClosetsIds(props.closet.id)
  return (
    <div className="closet-item" onClick={onSelected}>
      <img
        src={props.closet.product.catalogue_photos[0].medium_url}
        alt=""
        className="closet-img"
      />
      <img src={props.isSelected ? on : off} alt="" className="icon" />
    </div>
  )
}
