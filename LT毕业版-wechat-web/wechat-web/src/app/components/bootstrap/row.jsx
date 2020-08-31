const Row = props => {
  return (
    <div className={`row ${props.className ? props.className : ''}`}>
      {props.children}
    </div>
  )
}

export default Row
