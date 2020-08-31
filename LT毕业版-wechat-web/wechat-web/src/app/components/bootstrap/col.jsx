import capitalize from 'src/app/lib/capitalize'

const Col = props => {
  let classes = []

  if (props.className) classes.push(props.className)

  _.each(['xs', 'sm', 'md', 'lg', 'xl'], function(size) {
    const offset = `offset${capitalize(size)}`

    if (props[size]) classes.push(`col-${size}-${props[size]}`)
    if (props[offset]) classes.push(`offset-${size}-${props[offset]}`)
  })

  return (
    <div className={`col-sm ${classes.join(' ')}`} style={props.style}>
      {props.children}
    </div>
  )
}

export default Col
