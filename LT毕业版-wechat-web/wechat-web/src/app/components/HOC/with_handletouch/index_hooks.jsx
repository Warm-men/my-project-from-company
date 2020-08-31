import { useEffect, useRef } from 'react'

export default function withHandleTouch(WrappedComponent) {
  return function WithHandleTouch(props) {
    const picker = useRef(null)

    useEffect(() => {
      const handleTouch = e => e.preventDefault()
      picker.current.addEventListener('touchmove', handleTouch)
      return () => {
        picker.current.removeEventListener('touchmove', handleTouch)
      }
    }, [picker])

    return (
      <div ref={picker}>
        <WrappedComponent {...props} />
      </div>
    )
  }
}
