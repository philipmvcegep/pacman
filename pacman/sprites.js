// sprites.js
import { isWall, map } from './map.js';

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
    { x: 18, y: 1, homeX: 18, homeY: 1, color: '#ef4444', type: 'chase', speed: 0.08, name: 'Blinky', dx: 0, dy: 0 },
    { x: 1, y: 11, homeX: 1, homeY: 11, color: '#ec4899', type: 'wander', speed: 0.07, name: 'Pinky', dx: 0, dy: 0 },
    { x: 18, y: 11, homeX: 18, homeY: 11, color: '#06b6d4', type: 'ambush', speed: 0.075, name: 'Inky', dx: 0, dy: 0 }
];

export let frightenedTimer = 0;
let mouthAnimationTimer = 0;

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

export function updateGhosts() {
    if (frightenedTimer > 0) {
        frightenedTimer--;
    }

    ghosts.forEach(ghost => {
        let gx = Math.round(ghost.x);
        let gy = Math.round(ghost.y);

        if (Math.abs(ghost.x - gx) < 0.05 && Math.abs(ghost.y - gy) < 0.05) {
            ghost.x = gx;
            ghost.y = gy;

            let possibleMoves = [
                { dx: 0, dy: -1 },
                { dx: 0, dy: 1 },
                { dx: -1, dy: 0 },
                { dx: 1, dy: 0 }
            ].filter(m => !isWall(gx + m.dx, gy + m.dy));

            if (possibleMoves.length > 0) {
                let chosenMove = possibleMoves[0];

                if (frightenedTimer > 0) {
                    chosenMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                } else if (ghost.type === 'chase') {
                    let minDist = Infinity;
                    possibleMoves.forEach(m => {
                        let dist = Math.hypot((gx + m.dx) - player.x, (gy + m.dy) - player.y);
                        if (dist < minDist) { minDist = dist; chosenMove = m; }
                    });
                } else if (ghost.type === 'wander') {
                    chosenMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                } else if (ghost.type === 'ambush') {
                    let targetX = player.x + (player.dx * 2);
                    let targetY = player.y + (player.dy * 2);
                    let minDist = Infinity;
                    possibleMoves.forEach(m => {
                        let dist = Math.hypot((gx + m.dx) - targetX, (gy + m.dy) - targetY);
                        if (dist < minDist) { minDist = dist; chosenMove = m; }
                    });
                }

                ghost.dx = chosenMove.dx;
                ghost.dy = chosenMove.dy;
            }
        }

        let currentSpeed = frightenedTimer > 0 ? ghost.speed * 0.6 : ghost.speed;
        ghost.x += ghost.dx * currentSpeed;
        ghost.y += ghost.dy * currentSpeed;
    });
}

export function drawSprites(ctx, tileSize) {
    mouthAnimationTimer++;

    // Draw Player
    let pX = (player.x + 0.5) * tileSize;
    let pY = (player.y + 0.5) * tileSize;
    let pRadius = tileSize * 0.42;

    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    let angleOffset = 0;
    if (player.dx === 1) angleOffset = 0;
    if (player.dx === -1) angleOffset = Math.PI;
    if (player.dy === 1) angleOffset = Math.PI / 2;
    if (player.dy === -1) angleOffset = Math.PI * 1.5;

    let mouthOpen = (Math.floor(mouthAnimationTimer / 6) % 2 === 0 && (player.dx !== 0 || player.dy !== 0)) ? 0.35 : 0.05;

    ctx.arc(pX, pY, pRadius, angleOffset + mouthOpen, angleOffset + Math.PI * 2 - mouthOpen);
    ctx.lineTo(pX, pY);
    ctx.fill();

    // Draw Ghosts
    ghosts.forEach(ghost => {
        let gX = (ghost.x + 0.5) * tileSize;
        let gY = (ghost.y + 0.5) * tileSize;
        let gRadius = tileSize * 0.42;

        let renderColor = ghost.color;
        if (frightenedTimer > 0) {
            if (frightenedTimer < 100 && Math.floor(frightenedTimer / 10) % 2 === 0) {
                renderColor = '#ffffff';
            } else {
                renderColor = '#3b82f6';
            }
        }

        ctx.fillStyle = renderColor;
        ctx.beginPath();
        ctx.arc(gX, gY - 2, gRadius, Math.PI, 0, false);
        ctx.lineTo(gX + gRadius, gY + gRadius);
        ctx.lineTo(gX + gRadius * 0.5, gY + gRadius * 0.7);
        ctx.lineTo(gX, gY + gRadius);
        ctx.lineTo(gX - gRadius * 0.5, gY + gRadius * 0.7);
        ctx.lineTo(gX - gRadius, gY + gRadius);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(gX - 3, gY - 3, gRadius * 0.3, 0, Math.PI * 2);
        ctx.arc(gX + 3, gY - 3, gRadius * 0.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = frightenedTimer > 0 ? '#ef4444' : '#1e3a8a';
        let eyeOffsetX = (ghost.dx || 0) * 1.5;
        let eyeOffsetY = (ghost.dy || 0) * 1.5;
        ctx.beginPath();
        ctx.arc(gX - 3 + eyeOffsetX, gY - 3 + eyeOffsetY, gRadius * 0.12, 0, Math.PI * 2);
        ctx.arc(gX + 3 + eyeOffsetX, gY - 3 + eyeOffsetY, gRadius * 0.12, 0, Math.PI * 2);
        ctx.fill();
    });
}