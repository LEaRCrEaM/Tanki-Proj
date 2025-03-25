var config = {
    tank: {
        position: {
            x: null,
            y: null,
            z: null
        }
    },
    target: {
        tank: {
            position: null
        }
    },
    hacks: {
        antiAim: {
            enabled: false,
            top: false
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
            faceTurret: false
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
        spectate: {
            enabled: false,
            type: 'freefly',
            player: null
        },
        autoPress: []
    },
    keysPressed: []
};

export { config };
