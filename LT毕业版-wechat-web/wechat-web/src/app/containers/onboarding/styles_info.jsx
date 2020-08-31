// bottoms
import active from 'src/assets/images/onboarding/desktop/styles/bottoms/active.jpg'
import cropped from 'src/assets/images/onboarding/desktop/styles/bottoms/cropped.jpg'
import denimBottoms from 'src/assets/images/onboarding/desktop/styles/bottoms/denim.jpg'
import jumpsuits from 'src/assets/images/onboarding/desktop/styles/bottoms/jumpsuits.jpg'
import leggings from 'src/assets/images/onboarding/desktop/styles/bottoms/leggings.jpg'
import printed from 'src/assets/images/onboarding/desktop/styles/bottoms/printed.jpg'
import shorts from 'src/assets/images/onboarding/desktop/styles/bottoms/shorts.jpg'
import skirts from 'src/assets/images/onboarding/desktop/styles/bottoms/skirts.jpg'
import trousers from 'src/assets/images/onboarding/desktop/styles/bottoms/trousers.jpg'
// dresses
import bodycon from 'src/assets/images/onboarding/desktop/styles/dresses/bodycon.jpg'
import fitAndFlare from 'src/assets/images/onboarding/desktop/styles/dresses/fit-and-flare.jpg'
import maxi from 'src/assets/images/onboarding/desktop/styles/dresses/maxi.jpg'
import midi from 'src/assets/images/onboarding/desktop/styles/dresses/midi.jpg'
import mini from 'src/assets/images/onboarding/desktop/styles/dresses/mini.jpg'
import sheathDresses from 'src/assets/images/onboarding/desktop/styles/dresses/sheath-dresses.jpg'
import shifts from 'src/assets/images/onboarding/desktop/styles/dresses/shifts.jpg'
import shirtDresses from 'src/assets/images/onboarding/desktop/styles/dresses/shirt-dresses.jpg'
import wrapDresses from 'src/assets/images/onboarding/desktop/styles/dresses/wrap-dresses.jpg'
// jackets
import blazers from 'src/assets/images/onboarding/desktop/styles/jackets/blazers.jpg'
import bombers from 'src/assets/images/onboarding/desktop/styles/jackets/bombers.jpg'
import capes from 'src/assets/images/onboarding/desktop/styles/jackets/capes.jpg'
import carCoats from 'src/assets/images/onboarding/desktop/styles/jackets/car-coats.jpg'
import denimJackets from 'src/assets/images/onboarding/desktop/styles/jackets/denim.jpg'
import drapeFrontJackets from 'src/assets/images/onboarding/desktop/styles/jackets/drape-front.jpg'
import moto from 'src/assets/images/onboarding/desktop/styles/jackets/moto.jpg'
import utility from 'src/assets/images/onboarding/desktop/styles/jackets/utility.jpg'
import vests from 'src/assets/images/onboarding/desktop/styles/jackets/vests.jpg'
// jewelry
import everyday from 'src/assets/images/onboarding/desktop/styles/jewelry/everyday.jpg'
import statement from 'src/assets/images/onboarding/desktop/styles/jewelry/statement.jpg'
// sweaters
import cardigans from 'src/assets/images/onboarding/desktop/styles/sweaters/cardigans.jpg'
import drapeFrontSweaters from 'src/assets/images/onboarding/desktop/styles/sweaters/drape-front.jpg'
import dusters from 'src/assets/images/onboarding/desktop/styles/sweaters/dusters.jpg'
import essentials from 'src/assets/images/onboarding/desktop/styles/sweaters/essentials.jpg'
import novelty from 'src/assets/images/onboarding/desktop/styles/sweaters/novelty.jpg'
import oversized from 'src/assets/images/onboarding/desktop/styles/sweaters/oversized.jpg'
import rufflesSweaters from 'src/assets/images/onboarding/desktop/styles/sweaters/ruffles.jpg'
import stripes from 'src/assets/images/onboarding/desktop/styles/sweaters/stripes.jpg'
import turtlenecks from 'src/assets/images/onboarding/desktop/styles/sweaters/turtlenecks.jpg'
// tops
import boho from 'src/assets/images/onboarding/desktop/styles/tops/boho.jpg'
import graphics from 'src/assets/images/onboarding/desktop/styles/tops/graphics.jpg'
import offTheShoulder from 'src/assets/images/onboarding/desktop/styles/tops/off-the-shoulder.jpg'
import rufflesTops from 'src/assets/images/onboarding/desktop/styles/tops/ruffles.jpg'
import shirts from 'src/assets/images/onboarding/desktop/styles/tops/shirts.jpg'
import sleeveless from 'src/assets/images/onboarding/desktop/styles/tops/sleeveless.jpg'
import sweatshirts from 'src/assets/images/onboarding/desktop/styles/tops/sweatshirts.jpg'
import tees from 'src/assets/images/onboarding/desktop/styles/tops/tees.jpg'
import tunics from 'src/assets/images/onboarding/desktop/styles/tops/tunics.jpg'

export default {
  tops: [
    { name: 'Shirts', source: shirts },
    { name: 'Sleeveless', source: sleeveless },
    { name: 'Tees', source: tees },
    { name: 'Off the Shoulder', source: offTheShoulder },
    { name: 'Ruffles', source: rufflesTops },
    { name: 'Sweatshirts', source: sweatshirts },
    { name: 'Tunics', source: tunics },
    { name: 'Graphics', source: graphics },
    { name: 'Boho', source: boho }
  ],
  sweaters: [
    { name: 'Cardigans', source: cardigans },
    { name: 'Drape Front', source: drapeFrontSweaters },
    { name: 'Dusters', source: dusters },
    { name: 'Oversized', source: oversized },
    { name: 'Turtlenecks', source: turtlenecks },
    { name: 'Novelty', source: novelty },
    { name: 'Essentials', source: essentials },
    { name: 'Ruffles', source: rufflesSweaters },
    { name: 'Stripes', source: stripes }
  ],
  jackets: [
    { name: 'Blazers', source: blazers },
    { name: 'Bombers', source: bombers },
    { name: 'Car Coats', source: carCoats },
    { name: 'Denim', source: denimJackets },
    { name: 'Vests', source: vests },
    { name: 'Capes', source: capes },
    { name: 'Drape Front', source: drapeFrontJackets },
    { name: 'Moto', source: moto },
    { name: 'Utility', source: utility }
  ],
  pants: [
    { name: 'Cropped', source: cropped },
    { name: 'Denim', source: denimBottoms },
    { name: 'Jumpsuits', source: jumpsuits },
    { name: 'Leggings', source: leggings },
    { name: 'Trousers', source: trousers },
    { name: 'Skirts', source: skirts },
    { name: 'Active', source: active },
    { name: 'Printed', source: printed },
    { name: 'Shorts', source: shorts }
  ],
  dresses: [
    { name: 'Bodycon', source: bodycon },
    { name: 'Fit and Flare', source: fitAndFlare },
    { name: 'Shifts', source: shifts },
    { name: 'Sheath Dresses', source: sheathDresses },
    { name: 'Shirt Dresses', source: shirtDresses },
    { name: 'Wrap Dresses', source: wrapDresses },
    { name: 'Mini', source: mini },
    { name: 'Midi', source: midi },
    { name: 'Maxi', source: maxi }
  ],
  accessories: [
    { name: 'Everyday', source: everyday },
    { name: 'Statement', source: statement }
  ]
}
