// /* @flow */
//
// import React, { Component } from 'react'
// import { inject, observer } from 'mobx-react'
//
// const onNavigationState = WrappedComponent => {
//   return @inject('modalStore')
//   @observer
//   class extends Component {
//     render() {
//       const { modalStore, navigation } = this.props
//       let shouldReleaseCurrentPageComponent = false
//       if (modalStore && navigation) {
//         const index = modalStore.currentRoutes.findIndex(i => {
//           return i.key === navigation.state.key
//         })
//
//         if (index !== -1) {
//           const maxIndex = modalStore.currentRoutes.length - 1
//           shouldReleaseCurrentPageComponent = maxIndex - index > 1
//         }
//       }
//       return (
//         <WrappedComponent
//           {...this.props}
//           shouldReleaseCurrentPageComponent={shouldReleaseCurrentPageComponent}
//         />
//       )
//     }
//   }
// }
//
// export { onNavigationState }
