// map.js
const level1 = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,2,1],
    [1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,0,1,1,4,4,1,1,0,1,0,1,1,0,1],
    [1,0,0,0,0,1,0,0,0,4,4,0,0,0,1,0,0,0,0,1],
    [1,1,1,1,0,1,1,1,3,1,1,3,1,1,1,0,1,1,1,1],
    [1,1,1,1,0,1,3,3,3,3,3,3,3,3,1,0,1,1,1,1],
    [1,1,1,1,0,1,3,1,1,3,3,1,1,3,1,0,1,1,1,1],
    [1,0,0,0,0,0,0,1,3,3,3,3,1,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,1],
    [1,2,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

const level2 = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,0,0,0,0,0,1,0,1,1,0,1,0,0,0,0,0,2,1],
    [1,0,1,1,0,1,0,1,0,0,0,0,1,0,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,1,1,1,4,4,1,1,1,1,0,1,1,0,1],
    [1,0,0,0,0,1,0,0,0,4,4,0,0,0,1,0,0,0,0,1],
    [1,1,1,1,0,1,3,3,3,0,0,3,3,3,1,0,1,1,1,1],
    [1,1,1,1,0,1,3,1,1,0,0,1,1,3,1,0,1,1,1,1],
    [1,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1,0,1,1,0,1,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,1,1,0,0,0,0,1,1,1,0,1,1,0,1],
    [1,2,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

export const maps = [level1, level2];
export let currentLevelIndex = 0;
export let map = maps[currentLevelIndex];

export function switchLevel(index) {
    if (index >= 0 && index < maps.length) {
        currentLevelIndex = index;
        map = maps[currentLevelIndex];
        return true;
    }
    return false;
}

export function getCurrentLevel() {
    return currentLevelIndex + 1;
}

export function isWall(x, y) {
    let gridX = Math.round(x);
    let gridY = Math.round(y);
    if (gridX < 0 || gridX >= map[0].length || gridY < 0 || gridY >= map.length) return true;
    return map[gridY][gridX] === 1;
}

export function isGhostWall(x, y) {
    let gridX = Math.round(x);
    let gridY = Math.round(y);
    if (gridX < 0 || gridX >= map[0].length || gridY < 0 || gridY >= map.length) return true;
    let tile = map[Math.floor(y)][Math.floor(x)];
    return tile === 1 || tile === 4;
}