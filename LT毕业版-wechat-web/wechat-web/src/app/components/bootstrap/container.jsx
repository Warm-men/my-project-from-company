const Container = props => {
  return (
    <div
      className={`${props.fluid ? 'container-fluid' : 'container'} ${
        props.className ? props.className : ''
      }`}
    >
      {props.children}
    </div>
  )
}

export default Container
