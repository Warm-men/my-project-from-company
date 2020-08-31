import { compose, renderNothing, branch, lifecycle } from 'recompose'
/**
 * @param {*life_cycle} object react component lifecycle
 * @param {*isHidden} boolen true => render null false => render TargetComponent
 */
export default (isHidden = false, life_cycle = {}) => TargetComponent =>
  compose(
    lifecycle(life_cycle),
    branch(isHidden, renderNothing)
  )(TargetComponent)
