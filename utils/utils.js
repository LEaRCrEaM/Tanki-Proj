import { functions } from './helper.js';

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
        return functions.getPositionOfTank(functions.getTanks('self')[0]);
    },
    get interpolatedTankPosition() {
        return functions.getIntPosOfTank(myTank);
    },
    get tankPositionVelocity() {
        return functions.getInfoOfTank(functions.getTanks('self')[0])[0];
    },
    get tankQuaternions() {
        return functions.getInfoOfTank(functions.getTanks('self')[0])[1];
    },
    get shells() {
        return Object.entries(Object.values(functions.searchInObject(Utils.gunParamsCalculator, '==19'))[0]).filter(t => typeof t[1] == 'object')[0][1];
    },
    get tankOrientationVelocity() {
        return functions.getInfoOfTank(functions.getTanks('self')[0])[2];
    },
    get camera() {
        return Utils.followCamera;
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
    getTurretDirectionOfTank: function (t) {
        return Object.values(Object.values(functions.searchInObject(Object.values(functions.searchInObject(Object.entries(Object.values(Object.values(functions.searchInObject(Object.values(functions.searchInObject(t.espInfo, '==15'))[0], '==18'))[0])[0]).filter(t => t[1]?.m12z_1)[0][1], '==14'))[0], '==19'))[1])[1][0][utils.turretDirectionName];
    },
    setTurretDirectionOfTank: function (t, p) {
        return Object.values(Object.values(functions.searchInObject(Object.values(functions.searchInObject(Object.entries(Object.values(Object.values(functions.searchInObject(Object.values(functions.searchInObject(t.espInfo, '==15'))[0], '==18'))[0])[0]).filter(t => t[1]?.m12z_1)[0][1], '==14'))[0], '==19'))[1])[1][0][utils.turretDirectionName] = p;
    }
};

export { utils };
