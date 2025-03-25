import { config } from '../utils/config.js';
import { utils } from '../utils/utils.js';

var eventListeners = [
    {
        type: 'keydown',
        handle: function(e) {
            if (e.shiftKey && e.location == 2) {
                if (!config.hacks.airBreak.tank.position.x || !config.hacks.airBreak.tank.position.y || !config.hacks.airBreak.tank.position.z) {
                    var pos = utils.tankPosition;
                    config.hacks.airBreak.tank.position = {
                        x: pos.c18_1,
                        y: pos.d18_1,
                        z: pos.e18_1,
                    };
                };
                config.hacks.airBreak.enabled = !config.hacks.airBreak.enabled;
            };
        }
    }
];
