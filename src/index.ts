import { DirectiveOptions } from 'vue';

import WaterRipple from './water-ripple';

const MapleWaterRipple: DirectiveOptions = {
    inserted(el) {
        new WaterRipple(el);
    }
}

export default MapleWaterRipple;