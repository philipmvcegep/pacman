// constants/gameEnums.js

export const GhostState = Object.freeze({
    NORMAL: 'NORMAL',
    FRIGHTENED: 'FRIGHTENED',
    EATEN: 'EATEN'
});

export const GhostType = Object.freeze({
    CHASE: 'CHASE',
    WANDER: 'WANDER',
    AMBUSH: 'AMBUSH'
});

export const Direction = Object.freeze({
    UP: { dx: 0, dy: -1 },
    DOWN: { dx: 0, dy: 1 },
    LEFT: { dx: -1, dy: 0 },
    RIGHT: { dx: 1, dy: 0 },
    NONE: { dx: 0, dy: 0 }
});

export const GhostRegistry = Object.freeze({
    BLINKY: {
        name: 'Blinky',
        color: '#ef4444',
        type: GhostType.CHASE,
        homeX: 18,
        homeY: 1,
        speed: 0.08
    },
    PINKY: {
        name: 'Pinky',
        color: '#ec4899',
        type: GhostType.WANDER,
        homeX: 1,
        homeY: 11,
        speed: 0.07
    },
    INKY: {
        name: 'Inky',
        color: '#06b6d4',
        type: GhostType.AMBUSH,
        homeX: 18,
        homeY: 11,
        speed: 0.075
    }
});