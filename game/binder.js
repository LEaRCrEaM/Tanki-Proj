/*import { functions, binderFuncs } from '../utils/helper.js';
import { config } from '../utils/config.js'
import { utils } from '../utils/utils.js'
import { eventListeners, setEventListeners, removeEventListeners } from './eventListeners.js';

setEventListeners();
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
*/





/*import { functions, binderFuncs } from '../utils/helper.js';
import { config } from '../utils/config.js'
import { utils } from '../utils/utils.js'*/

var functions = {
    faceTargetQuaternion: function (myTankPos, otherTankPos, myTankInfo) {
        if (!myTankPos || !otherTankPos || !myTankInfo) {
            console.log('error in params of faceTargetQuaternion');
            return;
        };
        let direction = {
            x: otherTankPos.f1m_1 - myTankPos.f1m_1,
            y: otherTankPos.g1m_1 - myTankPos.g1m_1,
            z: otherTankPos.h1m_1 - myTankPos.h1m_1
        };
        let magnitude = Math.sqrt(direction.x ** 2 + direction.y ** 2 + direction.z ** 2);
        if (magnitude < 1e-6) {
            console.warn("Positions are too close or identical. No rotation needed.");
            return;
        };
        direction.x /= magnitude;
        direction.y /= magnitude;
        direction.z /= magnitude;
        let yaw = Math.atan2(-direction.x, direction.y) + Math.PI;
        let pitch = Math.asin(-direction.z);
        let cy = Math.cos(yaw * 0.5);
        let sy = Math.sin(yaw * 0.5);
        let cp = Math.cos(pitch * 0.5);
        let sp = Math.sin(pitch * 0.5);
        let quaternion = {
            w: cy * cp,
            x: sp * cy,
            y: sy * cp,
            z: -sy * sp
        };
        myTankInfo[1].l1p_1 = -quaternion.x;
        myTankInfo[1].k1p_1 = -quaternion.z;
        myTankInfo[1].j1p_1 = -quaternion.y;
        myTankInfo[1].m1p_1 = quaternion.w;
        return quaternion;
    },
    updateTankOrientationToCamera: function (myTankInfo) {
        const cameraYaw = functions.getCamYaw();
        const pitchAngle = -Math.PI / 12 * (utils.cameraElavation * 5);
        const halfYaw = cameraYaw * 0.5;
        const halfPitch = pitchAngle * 0.5;
        const sinYaw = Math.sin(halfYaw);
        const cosYaw = Math.cos(halfYaw);
        const sinPitch = Math.sin(halfPitch);
        const cosPitch = Math.cos(halfPitch);
        const yawQuat = {
            j1p_1: cosYaw,
            k1p_1: 0,
            l1p_1: 0,
            m1p_1: sinYaw
        };
        const pitchQuat = {
            j1p_1: cosPitch,
            k1p_1: sinPitch,
            l1p_1: 0,
            m1p_1: 0
        };
        const resultQuat = {
            j1p_1: yawQuat.j1p_1 * pitchQuat.j1p_1 - yawQuat.k1p_1 * pitchQuat.k1p_1 - yawQuat.l1p_1 * pitchQuat.l1p_1 - yawQuat.m1p_1 * pitchQuat.m1p_1,
            k1p_1: yawQuat.j1p_1 * pitchQuat.k1p_1 + yawQuat.k1p_1 * pitchQuat.j1p_1 + yawQuat.l1p_1 * pitchQuat.m1p_1 - yawQuat.m1p_1 * pitchQuat.l1p_1,
            l1p_1: yawQuat.j1p_1 * pitchQuat.l1p_1 - yawQuat.k1p_1 * pitchQuat.m1p_1 + yawQuat.l1p_1 * pitchQuat.j1p_1 + yawQuat.m1p_1 * pitchQuat.k1p_1,
            m1p_1: yawQuat.j1p_1 * pitchQuat.m1p_1 + yawQuat.k1p_1 * pitchQuat.l1p_1 - yawQuat.l1p_1 * pitchQuat.k1p_1 + yawQuat.m1p_1 * pitchQuat.j1p_1
        };
        myTankInfo[1].j1p_1 = resultQuat.j1p_1;
        myTankInfo[1].k1p_1 = resultQuat.k1p_1;
        myTankInfo[1].l1p_1 = resultQuat.l1p_1;
        myTankInfo[1].m1p_1 = resultQuat.m1p_1;
    },
    searchInObject: function (objectToSearch, comparisonString) {
        try {
            objectToSearch = Object.values(objectToSearch).filter(t => t?.__proto__);
            if (typeof objectToSearch !== 'object' || objectToSearch === null) {
                throw new TypeError('First argument must be a non-null object');
            };
            let comparisonFunction;
            try {
                comparisonFunction = new Function('value', `return Object.values(value?.__proto__)?.length ${comparisonString};`);
            } catch (e) {
                throw new Error('Invalid comparison string');
            };
            return Object.fromEntries(
                Object.entries(objectToSearch).filter(([key, value]) => 
                                                      comparisonFunction(value)
                                                     )
            );
        } catch (e){}
    },
    getTanks: function (t) {
        if (t == 'others') {
            return Object.values(utils.allTanks).filter(p => {
                var first1 = Object.values(functions.searchInObject(Object.values(p).filter(t => t?.__proto__), '=== 15'))[0];
                var second1 = functions.searchInObject(Object.values(first1).filter(t => t?.__proto__), '=== 18');
                var third1 = functions.searchInObject(Object.values(Object.values(second1)[0])[0], '==8');
                return typeof Object.values(functions.searchInObject(Object.values(third1)[1], '==0'))[2] == 'number';
            });
        } else if (t == 'self') {
            return Object.values(utils.allTanks).filter(p => {
                var first1 = Object.values(functions.searchInObject(Object.values(p).filter(t => t?.__proto__), '=== 15'))[0];
                var second1 = functions.searchInObject(Object.values(first1).filter(t => t?.__proto__), '=== 18');
                var third1 = functions.searchInObject(Object.values(Object.values(second1)[0])[0], '==8');
                return typeof Object.values(functions.searchInObject(Object.values(third1)[1], '==0'))[2] == 'boolean';
            });
        } else if (t.includes('player')) {
            return Object.values(utils.allTanks).filter(p => {
                var first1 = Object.values(functions.searchInObject(Object.values(p).filter(t => t?.__proto__), '=== 15'))[0];
                var second1 = functions.searchInObject(Object.values(first1).filter(t => t?.__proto__), '=== 18');
                var third1 = functions.searchInObject(Object.values(Object.values(second1)[0])[0], '==8');
                return Object.values(functions.searchInObject(Object.values(third1)[1], '==0'))[1]?.toString()?.includes(t.replace('player', ''));
            });
        } else if (t.includes('enemies')) {
            return Object.values(utils.allTanks).filter(p => {
                var first1 = Object.values(functions.searchInObject(Object.values(p).filter(t => t?.__proto__), '=== 15'))[0];
                var second1 = functions.searchInObject(Object.values(first1).filter(t => t?.__proto__), '=== 18');
                var third1 = functions.searchInObject(Object.values(Object.values(second1)[0])[0], '==8');
                var fourth1;
                try {
                    fourth1 = Object.values(Object.values(functions.searchInObject(Object.values(third1)?.[1], '==1'))?.[2])?.[0] == 'ENEMY';
                } catch (e){};
                if (fourth1) return fourth1;
            });
        } else if (t.includes('allies')) {
            return Object.values(utils.allTanks).filter(p => {
                var first1 = Object.values(functions.searchInObject(Object.values(p).filter(t => t?.__proto__), '=== 15'))[0];
                var second1 = functions.searchInObject(Object.values(first1).filter(t => t?.__proto__), '=== 18');
                var third1 = functions.searchInObject(Object.values(Object.values(second1)[0])[0], '==8');
                var fourth1;
                try {
                    fourth1 = Object.values(Object.values(functions.searchInObject(Object.values(third1)?.[1], '==1'))?.[2])?.[0] == 'ALLY';
                } catch (e){};
                if (fourth1) return fourth1;
            });
        } else {
            return;
        };
    },
    specPlayer: function(nick) {
        
    },
    setSpec: function() {
        utils.tank[utils.tankMoveableVar] = false;
        if (Object.values(config.hacks.spectate.camera.originalFuncStorage).length == 0) {
            functions.saveCameraFuncs();
        };
        for (const k in t = utils.specCamera) {
            if (typeof t[k] == 'function') {
                t[k] = function() {};
            };
        };
    },
    resetSpec: function() {
        utils.tank[utils.tankMoveableVar] = true;
        for (const k in t = config.hacks.spectate.camera.originalFuncStorage) {
            utils.specCamera[k] = t[k];
        };
    },
    saveCameraFuncs: function() {
        for (const k in t = utils.specCamera) {
            config.hacks.spectate.camera.originalFuncStorage[k] = t[k];
        };
    },
    resetVelocity: function() {
        for (const k in t = utils.tankOrientationVelocity) {
            (typeof t[k] == 'number') && (t[k] = 0);
        };
        for (const k in t = utils.tankPositionVelocity) {
            (typeof t[k] == 'number') && (t[k] = 0);
        };
    },
    getTankYaw2: function(t) {
        const { l1p_1, k1p_1, j1p_1, m1p_1 } = t[1];
        const sinY = 2 * (m1p_1 * l1p_1 + j1p_1 * l1p_1);
        const cosY = 1 - 2 * (l1p_1 * l1p_1 + j1p_1 * j1p_1);
        return Math.atan2(sinY, cosY);
    },
    getRandomNumberBetween: function(min, max) {
        return Math.random() * (max - min) + min;
    },
    getPositionOfTank: function (t) {
        return Object.values(Object.values(functions.searchInObject(t, '=== 2'))[0])[3];
    },
    getIntPosOfTank: function (t) {
        return Object.values(functions.searchInObject(Object.values(functions.searchInObject(t, '==14'))[0], '==41'))[1];
    },
    getInfoOfTank: function (t) {
        return Object.values(Object.values(functions.searchInObject(t, '=== 2'))[0])
    },
    getCamYaw: function () {
        return utils.cameraDirection;
    },
    isChatOpen: function() {
        return document.querySelectorAll('input[type="text"]').length > 0;
    }
};

var binderFuncs = {
    airBreak: function (myTankPos, myTankInfo, mapBounds, otherTankPos) {
        if (!myTankPos || !myTankInfo || !mapBounds) {
            console.log('error in params of binderFuncs.airBreak');
            return;
        };
        if (config.hacks.airBreak.type == 'tilt') {
            myTankPos.f1m_1 = Math.max(Object.values(mapBounds)[0], Math.min(Object.values(mapBounds)[3], config.hacks.airBreak.tank.position.x));
            myTankPos.g1m_1 = Math.max(Object.values(mapBounds)[1], Math.min(Object.values(mapBounds)[4], config.hacks.airBreak.tank.position.y));
        };
        myTankPos.h1m_1 = Math.max(Object.values(mapBounds)[2], Math.min(Object.values(mapBounds)[5] + 100, config.hacks.airBreak.tank.position.z));
        if (config.hacks.airBreak.faceTarget && otherTankPos) {
            functions.faceTargetQuaternion(myTankPos, otherTankPos, myTankInfo);
        } else {
            functions.updateTankOrientationToCamera(utils.tankInfo);
        };
        const cameraYaw = -functions.getCamYaw();
        const forwardX = Math.sin(cameraYaw);
        const forwardZ = Math.cos(cameraYaw);
        if (!functions.isChatOpen() && !config.hacks.spectate.enabled) {
            if (config.keysPressed.includes('w')) {
                if (config.hacks.airBreak.type == 'tilt') {
                    config.hacks.airBreak.tank.position.x = Math.max(Object.values(mapBounds)[0], Math.min(Object.values(mapBounds)[3], config.hacks.airBreak.tank.position.x + forwardX * config.hacks.airBreak.speed));
                    config.hacks.airBreak.tank.position.y = Math.max(Object.values(mapBounds)[1], Math.min(Object.values(mapBounds)[4], config.hacks.airBreak.tank.position.y + forwardZ * config.hacks.airBreak.speed));
                } else if (config.hacks.airBreak.type == 'airWalk') {
                    myTankInfo[0].f1m_1 += forwardX * 1000;
                    myTankInfo[0].g1m_1 += forwardZ * 1000;
                };
            }
            if (config.keysPressed.includes('s')) {
                if (config.hacks.airBreak.type == 'tilt') {
                    config.hacks.airBreak.tank.position.x = Math.max(Object.values(mapBounds)[0], Math.min(Object.values(mapBounds)[3], config.hacks.airBreak.tank.position.x - forwardX * config.hacks.airBreak.speed));
                    config.hacks.airBreak.tank.position.y = Math.max(Object.values(mapBounds)[1], Math.min(Object.values(mapBounds)[4], config.hacks.airBreak.tank.position.y - forwardZ * config.hacks.airBreak.speed));
                } else if (config.hacks.airBreak.type == 'airWalk') {
                    myTankInfo[0].f1m_1 -= forwardX * 1000;
                    myTankInfo[0].g1m_1 -= forwardZ * 1000;
                };
            };
            const rightX = Math.cos(cameraYaw);
            const rightZ = -Math.sin(cameraYaw);
            if (config.keysPressed.includes('d')) {
                if (config.hacks.airBreak.type == 'tilt') {
                    config.hacks.airBreak.tank.position.x = Math.max(Object.values(mapBounds)[0], Math.min(Object.values(mapBounds)[3], config.hacks.airBreak.tank.position.x + rightX * config.hacks.airBreak.speed));
                    config.hacks.airBreak.tank.position.y = Math.max(Object.values(mapBounds)[1], Math.min(Object.values(mapBounds)[4], config.hacks.airBreak.tank.position.y + rightZ * config.hacks.airBreak.speed));
                } else if (config.hacks.airBreak.type == 'airWalk') {
                    myTankInfo[0].f1m_1 += rightX * 1000;
                    myTankInfo[0].g1m_1 += rightZ * 1000;
                };
            };
            if (config.keysPressed.includes('a')) {
                if (config.hacks.airBreak.type == 'tilt') {
                    config.hacks.airBreak.tank.position.x = Math.max(Object.values(mapBounds)[0], Math.min(Object.values(mapBounds)[3], config.hacks.airBreak.tank.position.x - rightX * config.hacks.airBreak.speed));
                    config.hacks.airBreak.tank.position.y = Math.max(Object.values(mapBounds)[1], Math.min(Object.values(mapBounds)[4], config.hacks.airBreak.tank.position.y - rightZ * config.hacks.airBreak.speed));
                } else if (config.hacks.airBreak.type == 'airWalk') {
                    myTankInfo[0].f1m_1 -= rightX * 1000;
                    myTankInfo[0].g1m_1 -= rightZ * 1000;
                };
            };
            if (config.keysPressed.includes('f')) {
                config.hacks.airBreak.tank.position.z = Math.max(Object.values(mapBounds)[2], Math.min(Object.values(mapBounds)[5] + 100, config.hacks.airBreak.tank.position.z + config.hacks.airBreak.speed));
            };
            if (config.keysPressed.includes('v')) {
                config.hacks.airBreak.tank.position.z = Math.max(Object.values(mapBounds)[2], Math.min(Object.values(mapBounds)[5] + 100, config.hacks.airBreak.tank.position.z - config.hacks.airBreak.speed));
            };
        };
    },
    antiAim: function (myTankPos, mapBounds) {
        myTankPos.f1m_1 = functions.getRandomNumberBetween(Object.values(mapBounds)[0], Object.values(mapBounds)[3]);
        myTankPos.g1m_1 = functions.getRandomNumberBetween(Object.values(mapBounds)[1], Object.values(mapBounds)[4]);
        myTankPos.h1m_1 = config.hacks.antiAim.top ? Object.values(mapBounds)[5] : Object.values(mapBounds)[2];
    },
    spectate: function() {
        const cameraYaw = utils.cameraDirection;
        const forwardX = Math.cos(cameraYaw + Math.PI/2);
        const forwardZ = Math.sin(cameraYaw + Math.PI/2);
        const rightX = Math.cos(cameraYaw);
        const rightZ = Math.sin(cameraYaw);
        if (config.keysPressed.includes('w')) {
            config.hacks.spectate.camera.position.x += forwardX * config.hacks.spectate.speed;
            config.hacks.spectate.camera.position.y += forwardZ * config.hacks.spectate.speed;
        };
        if (config.keysPressed.includes('s')) {
            config.hacks.spectate.camera.position.x -= forwardX * config.hacks.spectate.speed;
            config.hacks.spectate.camera.position.y -= forwardZ * config.hacks.spectate.speed;
        };
        if (config.keysPressed.includes('a')) {
            config.hacks.spectate.camera.position.x -= rightX * config.hacks.spectate.speed;
            config.hacks.spectate.camera.position.y -= rightZ * config.hacks.spectate.speed;
        };
        if (config.keysPressed.includes('d')) {
            config.hacks.spectate.camera.position.x += rightX * config.hacks.spectate.speed;
            config.hacks.spectate.camera.position.y += rightZ * config.hacks.spectate.speed;
        };
        if (config.keysPressed.includes('f')) {
            config.hacks.spectate.camera.position.z += config.hacks.spectate.speed;
        };
        if (config.keysPressed.includes('v')) {
            config.hacks.spectate.camera.position.z -= config.hacks.spectate.speed;
        };
        utils.specCamera.f1m_1 = config.hacks.spectate.camera.position.x;
        utils.specCamera.g1m_1 = config.hacks.spectate.camera.position.y;
        utils.specCamera.h1m_1 = config.hacks.spectate.camera.position.z;
        if (config.hacks.spectate.type == 'player') {
            config.hacks.spectate.camera.position.x = config.target.position.f1m_1;
            config.hacks.spectate.camera.position.y = config.target.position.g1m_1;
            config.hacks.spectate.camera.position.z = config.target.position.h1m_1;
            utils.specCamera.f1m_1 = config.hacks.spectate.camera.position.x;
            utils.specCamera.g1m_1 = config.hacks.spectate.camera.position.y;
            utils.specCamera.h1m_1 = config.hacks.spectate.camera.position.z;
            if (config.hacks.spectate.faceTurret) {
                var player = functions.getTanks('player' + config.target.nick)[0];
                if (player) {
                    utils.cameraDirection = functions.getTankYaw2(functions.getInfoOfTank(player)) + utils.getTurretDirectionOfTank(player);
                } else {
                    config.hacks.spectate.type = 'freefly';
                };
            };
        };
    }
};

var config = {
    target: {
        nick: '',
        object: null,
        tank: {
            position: null
        }
    },
    hacks: {
        antiAim: {
            enabled: false,
            top: false,
            originalPos: {
                x: null,
                y: null,
                z: null
            }
        },
        airBreak: {
            enabled: false,
            speed: 100,
            type: 'tilt',
            faceTarget: false,
            tank: {
                position: {
                    x: null,
                    y: null,
                    z: null
                }
            }
        },
        followTank: {
            enabled: false,
            player: null,
            index: 0,
            height: 50
        },
        flagTp: {
            index: true
        },
        spectate: {
            enabled: false,
            faceTurret: false,
            speed: 25,
            type: 'freefly',
            camera: {
                position: {
                    x: null,
                    y: null,
                    z: null
                },
                originalFuncStorage: {}
            }
        },
        neverFlip: {
            enabled: false,
            amount: .4
        },
        turretAim: {
            enabled: false,
            type: 'turret'
        },
        freezeTanks: {
            enabled: false
        },
        hitbox: {
            enabled: false,
            amount: 2
        },
        noClip: {
            enabled: false
        },
        speed: {
            enabled: false,
            amount: 2
        },
        turnSpeed: {
            enabled: false,
            amount: 2
        },
        acceleration: {
            enabled: false,
            amount: 2
        },
        aimAssist: {
            enabled: false,
            amount: 16
        },
        verticalAim: {
            enabled: false
        },
        esp: {
            enemies: {
                enabled: false,
                color: 16711680
            },
            allies: {
                enabled: false,
                color: 16777215
            },
            self: {
                enabled: false,
                color: 16777215
            },
            target: {
                enabled: false,
                color: 6684927
            }
        },
        freezeTanks: {
            enabled: false,
            hotkey: 't'
        },
        skinSpoofer: {
            enabled: false,
            turret: {
                name: null,
                skin: null
            },
            hull: {
                name: null,
                skin: null
            }
        },
        autoPress: []
    },
    isInGame: false,
    keysPressed: []
};

var utils = {
    get mapBounds() {
        return window.mapBounds;
    },
    get allTanks() {
        if (!Utils.cameraComponent) return;
        var t = Object.values(Object.values(functions.searchInObject(Object.values(functions.searchInObject(Object.values(functions.searchInObject(Object.values(functions.searchInObject(Utils.cameraComponent, '==15'))[0], '==65'))[0], '==21'))[0], '==18'))[0])[0];
        for (let i=0;i<t.length;i++) {
            t[i].espInfo = Object.values(functions.searchInObject(Object.values(Object.values(functions.searchInObject(Object.values(functions.searchInObject(t[i], '==15'))[0], '==18'))[0])[0], '==2'))[0]
        };
        return t;
    },
    get tankPhysicsComponent() {
        return Utils.tankPhysicsComponent;
    },
    get tankPosition() {
        return functions.getPositionOfTank(utils.tank);
    },
    get tank() {
        return functions.getTanks('self')[0];
    },
    get interpolatedTankPosition() {
        return functions.getIntPosOfTank(myTank);
    },
    get tankPositionVelocity() {
        return utils.tankInfo[0];
    },
    get tankQuaternions() {
        return utils.tankInfo[1];
    },
    get shells() {
        return Object.entries(Object.values(functions.searchInObject(Utils.gunParamsCalculator, '==19'))[0]).filter(t => typeof t[1] == 'object')[0][1];
    },
    get tankOrientationVelocity() {
        return utils.tankInfo[2];
    },
    get tankInfo() {
        return functions.getInfoOfTank(utils.tank);
    },
    get camera() {
        return Utils.followCamera;
    },
    get specCamera() {
        var first2 = functions.searchInObject(Utils.followCamera, '==1');
        var second2 = functions.searchInObject(Object.values(first2)[3], '==43');
        return Object.values(second2)[0];
    },
    get cameraDirectionName() {
        return Object.entries(Utils.followCamera).filter(t => typeof t[1] == 'number')[0][0];
    },
    get cameraElavationName() {
        return Object.entries(Utils.followCamera).filter(t => typeof t[1] == 'number')[2][0];
    },
    get cameraDirection() {
        return Utils.followCamera[utils.cameraDirectionName];
    },
    get cameraElavation() {
        return Utils.followCamera[utils.cameraElavationName];
    },
    get cameraPosition() {
        return Object.values(functions.searchInObject(Object.values(functions.searchInObject(Utils.followCamera, '==1'))[3], '==41'))[0];
    },
    get flags() {
        return Utils.flags;
    },
    get teamFlagPosition() {
        return Object.values(functions.searchInObject(Object.values(functions.searchInObject(Utils.flags[0], '==3'))[0], '==41'))[0];
    },
    get enemyFlagPosition() {
        return Object.values(functions.searchInObject(Object.values(functions.searchInObject(Utils.flags[1], '==3'))[0], '==41'))[0];
    },
    set cameraDirection(t) {
        return Utils.followCamera[utils.cameraDirectionName] = t;
    },
    set cameraElavation(t) {
        return Utils.followCamera[utils.cameraElavationName] = t;
    },
    get turretDirectionName() {
        return Object.entries(Utils.turret, '==0').filter(t => typeof t[1] == 'number')[0][0];
    },
    get turretDirection() {
        return Utils.turret[utils.turretDirectionName];
    },
    set turretDirection(t) {
        return Utils.turret[utils.turretDirectionName] = t;
    },
    get tankMoveableVar() {
        return Object.entries(utils.tank).filter(t => typeof t[1] == 'boolean')[0][0];
    },
    get tankMoveable() {
        return utils.tank[utils.tankMoveableVar];
    },
    getTurretDirectionOfTank: function (t) {
        return Object.values(Object.values(functions.searchInObject(Object.values(functions.searchInObject(Object.entries(Object.values(Object.values(functions.searchInObject(Object.values(functions.searchInObject(t.espInfo, '==15'))[0], '==18'))[0])[0]).filter(t => t[1]?.m12z_1)[0][1], '==14'))[0], '==19'))[1])[1][0][utils.turretDirectionName];
    },
    setTurretDirectionOfTank: function (t, p) {
        return Object.values(Object.values(functions.searchInObject(Object.values(functions.searchInObject(Object.entries(Object.values(Object.values(functions.searchInObject(Object.values(functions.searchInObject(t.espInfo, '==15'))[0], '==18'))[0])[0]).filter(t => t[1]?.m12z_1)[0][1], '==14'))[0], '==19'))[1])[1][0][utils.turretDirectionName] = p;
    }
};

var eventListeners = [
    {
        type: 'keydown',
        handle: function(e) {
            if (!config.keysPressed.includes(e.key)) config.keysPressed.push(e.key);
            if (config.isInGame) {
                if (e.shiftKey && e.location == 2) {
                    var pos = utils.tankPosition;
                    config.hacks.airBreak.tank.position = {
                        x: pos.f1m_1,
                        y: pos.g1m_1,
                        z: pos.h1m_1
                    };
                    config.hacks.airBreak.enabled = !config.hacks.airBreak.enabled;
                    if (!config.hacks.airBreak.enabled) functions.resetVelocity();
                };
                if (e.key == 'J') {
                    if (config.hacks.antiAim.enabled) {
                        if (config.hacks.antiAim.top) {
                            config.hacks.antiAim.top = false;
                        } else {
                            config.hacks.antiAim.top = true;
                            config.hacks.antiAim.enabled = false;
                            var pos = utils.tankPosition;
                            pos.f1m_1 = config.hacks.antiAim.originalPos.x;
                            pos.g1m_1 = config.hacks.antiAim.originalPos.y;
                            pos.h1m_1 = config.hacks.antiAim.originalPos.z;
                        };
                    } else {
                        config.hacks.antiAim.enabled = true;
                        var pos = utils.tankPosition;
                        config.hacks.antiAim.originalPos = {
                            x: pos.f1m_1,
                            y: pos.g1m_1,
                            z: pos.h1m_1
                        };
                    };
                };
                if (e.key == 'K') {
                    config.hacks.spectate.enabled = !config.hacks.spectate.enabled;
                    if (config.hacks.spectate.enabled) {
                        functions.setSpec();
                    } else {
                        functions.resetSpec();
                        functions.resetVelocity();
                    };
                };
            };
        }
    },
    {
        type: 'keyup',
        handle: function(e) {
            if (config.keysPressed.includes(e.key)) config.keysPressed = config.keysPressed.filter(t => t !== e.key);
        }
    },
    {
        type: 'mousemove',
        handle: function(e) {
            if (document.pointerLockElement && (config.hacks.airBreak.enabled || config.hacks.spectate.enabled)) {
                var sensitivity = 0.0005;
                utils.cameraElavation -= -e.movementY * sensitivity;
            };
        }
    },
    {
        type: 'click',
        handle: function(e) {
            if (e.target.classList[1]?.includes('Common-whiteSpaceNoWrap')) {
                var nick = '';
                if (!e.target.textContent.includes(' ')) {
                    nick = e.target.textContent;
                } else {
                    nick = e.target.textContent.split(' ')[1];
                };
                if (config.hacks.spectate.enabled) {
                    functions.specPlayer(nick);
                };
                config.target.position = functions.getPositionOfTank(functions.getTanks('player' + nick)[0]);
            };
        };
    }
];

function setEventListeners() {
    eventListeners.forEach(listener => {
        document.addEventListener(listener.type, listener.handle);
    });
};

function removeEventListeners() {
    eventListeners.forEach(listener => {
        document.removeEventListener(listener.type, listener.handle);
    });
};

setEventListeners();
var animationFrameId;
function animationFrameFunc() {
    animationFrameId = requestAnimationFrame(animationFrameFunc);
    if (!config.isInGame && document.querySelector('canvas[class]:not([class*=" "])')) {
        config.isInGame = true;
    };
    if (config.isInGame && !document.querySelector('canvas[class]:not([class*=" "])')) {
        config.isInGame = false;
    };
    if (config.isInGame) {
        try {
            if (config.hacks.airBreak.enabled && (utils.allTanks.length > 0)) {
                if (Utils) {
                    if (utils.tankMoveable) utils.tank[utils.tankMoveableVar] = false;
                    binderFuncs.airBreak(utils.tankPosition, utils.tankInfo, utils.mapBounds, config.target.position);
                };
            } else if (!config.hacks.spectate.enabled) {
                if (!utils.tankMoveable) utils.tank[utils.tankMoveableVar] = true;
            };
            if (config.hacks.antiAim.enabled) {
                binderFuncs.antiAim(utils.tankPosition, utils.mapBounds);
            };
            if (config.hacks.spectate.enabled) {
                binderFuncs.spectate();
            };
        } catch (e) {};
    };
};
try {
    animationFrameFunc();
} catch (e) {
    console.log('error in animationFrame', e);
    cancelAnimationFrame(animationFrameId);
};

function getTanks(t) {
    return functions.getTanks(t);
};
