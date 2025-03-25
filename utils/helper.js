import { utils } from './utils.js';
import { config } from './config.js';

var functions = {
    faceTargetQuaternion: function (myTankPos, otherTankPos, myTankInfo) {
        if (!myTankPos || !otherTankPos || !myTankInfo) {
            console.log('error in params of faceTargetQuaternion');
            return;
        };
        let direction = {
            x: otherTankPos.c18_1 - myTankPos.c18_1,
            y: otherTankPos.d18_1 - myTankPos.d18_1,
            z: otherTankPos.e18_1 - myTankPos.e18_1
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
        myTankInfo[1].i1b_1 = -quaternion.x;
        myTankInfo[1].h1b_1 = -quaternion.z;
        myTankInfo[1].g1b_1 = -quaternion.y;
        myTankInfo[1].j1b_1 = quaternion.w;
        return quaternion;
    },
    updateTankOrientationToCamera: function () {
        const cameraYaw = functions.getCamYaw();
        const adjustedYaw = cameraYaw;
        const halfYaw = adjustedYaw * 0.5;
        const sinYaw = Math.sin(halfYaw);
        const cosYaw = Math.cos(halfYaw);
        const yawQuat = {
            g1b_1: cosYaw,
            h1b_1: 0,
            i1b_1: 0,
            j1b_1: sinYaw
        };
        myTankInfo[1].g1b_1 = yawQuat.g1b_1;
        myTankInfo[1].h1b_1 = yawQuat.h1b_1;
        myTankInfo[1].i1b_1 = yawQuat.i1b_1;
        myTankInfo[1].j1b_1 = yawQuat.j1b_1;
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
                return typeof Object.values(functions.searchInObject(Object.values(third1)[2], '==0'))[2] == 'number';
            });
        } else if (t == 'self') {
            return Object.values(utils.allTanks).filter(p => {
                var first1 = Object.values(functions.searchInObject(Object.values(p).filter(t => t?.__proto__), '=== 15'))[0];
                var second1 = functions.searchInObject(Object.values(first1).filter(t => t?.__proto__), '=== 18');
                var third1 = functions.searchInObject(Object.values(Object.values(second1)[0])[0], '==8');
                return typeof Object.values(functions.searchInObject(Object.values(third1)[2], '==0'))[2] == 'boolean';
            });
        } else if (t.includes('player')) {
            return Object.values(utils.allTanks).filter(p => {
                var first1 = Object.values(functions.searchInObject(Object.values(p).filter(t => t?.__proto__), '=== 15'))[0];
                var second1 = functions.searchInObject(Object.values(first1).filter(t => t?.__proto__), '=== 18');
                var third1 = functions.searchInObject(Object.values(Object.values(second1)[0])[0], '==8');
                return Object.values(functions.searchInObject(Object.values(third1)[2], '==0'))[1]?.toString()?.includes(t.replace('player', ''));
            });
        } else if (t.includes('enemies')) {
            return Object.values(utils.allTanks).filter(p => {
                var first1 = Object.values(functions.searchInObject(Object.values(p).filter(t => t?.__proto__), '=== 15'))[0];
                var second1 = functions.searchInObject(Object.values(first1).filter(t => t?.__proto__), '=== 18');
                var third1 = functions.searchInObject(Object.values(Object.values(second1)[0])[0], '==8');
                var fourth1;
                try {
                    fourth1 = Object.values(Object.values(functions.searchInObject(Object.values(third1)?.[2], '==1'))?.[2])?.[0] == 'ENEMY';
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
                    fourth1 = Object.values(Object.values(functions.searchInObject(Object.values(third1)?.[2], '==1'))?.[2])?.[0] == 'ALLY';
                } catch (e){};
                if (fourth1) return fourth1;
            });
        } else {
            return;
        };
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
        myTankInfo[0].c18_1 = 0;
        myTankInfo[0].d18_1 = 0;
        myTankInfo[0].e18_1 = 0;
        if (config.hacks.airBreak.type == 'tilt') {
            myTankPos.c18_1 = Math.max(Object.values(mapBounds)[0], Math.min(Object.values(mapBounds)[3], config.hacks.airBreak.tank.position.x));
            myTankPos.d18_1 = Math.max(Object.values(mapBounds)[1], Math.min(Object.values(mapBounds)[4], config.hacks.airBreak.tank.position.y));
        };
        myTankPos.e18_1 = Math.max(Object.values(mapBounds)[2], Math.min(Object.values(mapBounds)[5] + 100, config.hacks.airBreak.tank.position.z));
        if (config.hacks.airBreak.faceTarget && otherTankPos) {
            functions.faceTargetQuaternion(myTankPos, otherTankPos, myTankInfo);
        } else {
            updateTankOrientationToCamera();
        };
        const cameraYaw = -functions.getCamYaw();
        const forwardX = Math.sin(cameraYaw);
        const forwardZ = Math.cos(cameraYaw);
        if (!functions.isChatOpen() && !config.hacks.spectate.enabled) {
            if (config.keysPressed.includes('w')) {
                if (config.hacks.airBreak.type == 'tilt') {
                    config.hacks.airBreak.tank.position.x += forwardX * config.hacks.airBreak.speed;
                    config.hacks.airBreak.tank.position.y += forwardZ * config.hacks.airBreak.speed;
                } else if (config.hacks.airBreak.type == 'airWalk') {
                    myTankInfo[0].c18_1 += forwardX * 1000;
                    myTankInfo[0].d18_1 += forwardZ * 1000;
                };
            }
            if (config.keysPressed.includes('s')) {
                if (config.hacks.airBreak.type == 'tilt') {
                    config.hacks.airBreak.tank.position.x -= forwardX * config.hacks.airBreak.speed;
                    config.hacks.airBreak.tank.position.y -= forwardZ * config.hacks.airBreak.speed;
                } else if (config.hacks.airBreak.type == 'airWalk') {
                    myTankInfo[0].c18_1 -= forwardX * 1000;
                    myTankInfo[0].d18_1 -= forwardZ * 1000;
                };
            };
            const rightX = Math.cos(cameraYaw);
            const rightZ = -Math.sin(cameraYaw);
            if (config.keysPressed.includes('d')) {
                if (config.hacks.airBreak.type == 'tilt') {
                    config.hacks.airBreak.tank.position.x += rightX * config.hacks.airBreak.speed;
                    config.hacks.airBreak.tank.position.y += rightZ * config.hacks.airBreak.speed;
                } else if (config.hacks.airBreak.type == 'airWalk') {
                    myTankInfo[0].c18_1 += rightX * 1000;
                    myTankInfo[0].d18_1 += rightZ * 1000;
                };
            };
            if (config.keysPressed.includes('a')) {
                if (config.hacks.airBreak.type == 'tilt') {
                    config.hacks.airBreak.tank.position.x -= rightX * config.hacks.airBreak.speed;
                    config.hacks.airBreak.tank.position.y -= rightZ * config.hacks.airBreak.speed;
                } else if (config.hacks.airBreak.type == 'airWalk') {
                    myTankInfo[0].c18_1 -= rightX * 1000;
                    myTankInfo[0].d18_1 -= rightZ * 1000;
                };
            };
            if (config.keysPressed.includes('f')) {
                config.hacks.airBreak.tank.position.z += config.hacks.airBreak.speed;
            };
            if (config.keysPressed.includes('v')) {
                config.hacks.airBreak.tank.position.z -= config.hacks.airBreak.speed;
            };
        };
    }
}

export { functions, binderFuncs };
