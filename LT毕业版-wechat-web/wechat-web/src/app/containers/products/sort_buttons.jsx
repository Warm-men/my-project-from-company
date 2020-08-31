import 'src/assets/stylesheets/components/desktop/filter_modal/sort_buttons.scss'

export default function SortButtons(props) {
  const {
    toggleModal,
    isShowIntelBox,
    intelligentSelect,
    products_size_filter
  } = props
  return (
    <div className="sort-buttons">
      <ul>
        <li className="sort-buttons-selected">推荐单品</li>
      </ul>
      <div className="filters-button" onClick={toggleModal}>
        更多筛选 <span className="refine-icon" />
      </div>
      {isShowIntelBox && (
        <div className="intel-select-size" onClick={intelligentSelect}>
          智能选码&nbsp;
          <span
            className={`intel-select-box ${
              products_size_filter ? 'selected-box' : ''
            }`}
          />
        </div>
      )}
    </div>
  )
}
