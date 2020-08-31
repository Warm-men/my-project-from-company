import 'src/assets/stylesheets/components/shared/sticky_button_container.scss'

const StickyButtonContainer = React.memo(({ children }) => (
  <div className="sticky-button-container">
    <div className="sticky-button-fixed">
      <div
        style={{
          padding: '10px 15px',
          width: 'auto',
          display: 'flex',
          flex: 1
        }}
      >
        {children}
      </div>
    </div>
  </div>
))

export default StickyButtonContainer
