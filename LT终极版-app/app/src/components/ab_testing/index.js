import Variant from './variant'
import Experiment from './experiment'
import {
  abTestHOC,
  abTrack,
  abTrackWithAttribute,
  abTrackPageView,
  getAbFlag
} from './ab_testing'

export {
  Experiment,
  Variant,
  abTestHOC,
  abTrack,
  abTrackWithAttribute,
  abTrackPageView,
  getAbFlag
}

/* Example:

<Experiment flagName={'showTestView'} defaultValue={false}>
  <Variant value={false}>
    <Text>Normal</Text>
  </Variant>
  <Variant value={true}>
    <Text>Test</Text>
  </Variant>
</Experiment>
*/
