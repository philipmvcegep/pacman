// sprites.js
import { isWall, map } from '../ressources/map.js';
import { GhostRegistry, GhostState } from '../constants/gameEnums.js';

export const player = {
    x: 9,
    y: 5,
    dx: 0,
    dy: 0,
    nextDx: 0,
    nextDy: 0,
    speed: 0.1
};

export const ghosts = [
    { ...GhostRegistry.BLINKY, x: GhostRegistry.BLINKY.homeX, y: GhostRegistry.BLINKY.homeY, dx: 0, dy: 0, state: GhostState.NORMAL },
    { ...GhostRegistry.PINKY, x: GhostRegistry.PINKY.homeX, y: GhostRegistry.PINKY.homeY, dx: 0, dy: 0, state: GhostState.NORMAL },
    { ...GhostRegistry.INKY, x: GhostRegistry.INKY.homeX, y: GhostRegistry.INKY.homeY, dx: 0, dy: 0, state: GhostState.NORMAL }
];

export let frightenedTimer = 0;

export function setFrightenedTimer(val) { frightenedTimer = val; }
export function getFrightenedTimer() { return frightenedTimer; }

export function resetSprites() {
    player.x = 9;
    player.y = 5;
    player.dx = 0;
    player.dy = 0;
    player.nextDx = 0;
    player.nextDy = 0;

    ghosts.forEach(g => {
        g.x = g.homeX;
        g.y = g.homeY;
        g.dx = 0;
        g.dy = 0;
        g.state = GhostState.NORMAL;
    });
    frightenedTimer = 0;
}

export function updatePlayer() {
    let px = Math.round(player.x);
    let py = Math.round(player.y);

    if (Math.abs(player.x - px) < 0.05 && Math.abs(player.y - py) < 0.05) {
        player.x = px;
        player.y = py;

        if (!isWall(px + player.nextDx, py + player.nextDy)) {
            player.dx = player.nextDx;
            player.dy = player.nextDy;
        }
        if (isWall(px + player.dx, py + player.dy)) {
            player.dx = 0;
            player.dy = 0;
        }
    }

    player.x += player.dx * player.speed;
    player.y += player.dy * player.speed;

    if (player.x < 0) player.x = map[0].length - 1;
    if (player.x >= map[0].length) player.x = 0;
}