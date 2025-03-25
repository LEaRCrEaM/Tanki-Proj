import { functions, binderFuncs } from '../utils/helper.js';
import { config } from '../utils/config.js'
import { utils } from '../utils/utils.js'

var animationFrameId;
function animationFrameFunc() {
    animationFrameId = requestAnimationFrame(animationFrameFunc);
    if (config.hacks.airBreak.enabled) {
        binderFuncs.airBreak(utils.tankPosition, functions.getInfoOfTank(functions.getTanks('self')), utils.mapBounds, config.target.position);
    };
};
try {
    animationFrameFunc();
} catch (e) {
    console.log('error in animationFrame', e);
    cancelAnimationFrame(animationFrameId);
};
