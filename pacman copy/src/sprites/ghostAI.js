// ghostAI.js
import { isGhostWall } from '../ressources/map.js';
import { player, ghosts, frightenedTimer, setFrightenedTimer } from './sprites.js';
import { GhostType } from '../constants/gameEnums.js';

function selectGhostMove(ghost, possibleMoves, gx, gy) {
    if (frightenedTimer > 0) {
        return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    }

    let chosenMove = possibleMoves[0];
    let minDist = Infinity;

    switch (ghost.type) {
        // AI for BLINKY
        case GhostType.CHASE:
            possibleMoves.forEach(m => {
                let dist = Math.hypot((gx + m.dx) - player.x, (gy + m.dy) - player.y);
                if (dist < minDist) { minDist = dist; chosenMove = m; }
            });
            break;

        case GhostType.WANDER:
            chosenMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            break;

        case GhostType.AMBUSH: {
            let targetX = player.x + (player.dx * 2);
            let targetY = player.y + (player.dy * 2);
            possibleMoves.forEach(m => {
                let dist = Math.hypot((gx + m.dx) - targetX, (gy + m.dy) - targetY);
                if (dist < minDist) { minDist = dist; chosenMove = m; }
            });
            break;
        }

        default:
            chosenMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            break;
    }

    return chosenMove;
}

export function updateGhosts() {
    if (frightenedTimer > 0) {
        setFrightenedTimer(frightenedTimer - 1);
    }

    ghosts.forEach(ghost => {
        let gx = Math.round(ghost.x);
        let gy = Math.round(ghost.y);

        // 1. Tile-aligned movement decisions
        if (Math.abs(ghost.x - gx) < 0.05 && Math.abs(ghost.y - gy) < 0.05) {
            ghost.x = gx;
            ghost.y = gy;

            let legalMoves = [
                { dx: 0, dy: -1 },
                { dx: 0, dy: 1 },
                { dx: -1, dy: 0 },
                { dx: 1, dy: 0 }
            ].filter(m => !isGhostWall(Math.round(ghost.x) + m.dx, Math.round(ghost.y) + m.dy));

            // Apply anti-backtrack ONLY if there are alternative paths to choose from
            let possibleMoves = legalMoves.filter(m => {
                // If it's a dead end (only 1 legal move), we MUST allow going backward to escape!
                if (legalMoves.length <= 1) return true;

                // Otherwise, block the immediate 180-degree reversal to stop jittering
                if (ghost.dx !== 0 && m.dx === -ghost.dx && ghost.dy === 0) return false;
                if (ghost.dy !== 0 && m.dy === -ghost.dy && ghost.dx === 0) return false;

                return true;
            });

            // Fallback if the anti-filter blocks everything (e.g. dead ends)
            if (possibleMoves.length === 0) {
                possibleMoves = [
                    { dx: 0, dy: -1 },
                    { dx: 0, dy: 1 },
                    { dx: -1, dy: 0 },
                    { dx: 1, dy: 0 }
                ].filter(m => !isGhostWall(Math.round(ghost.x) + m.dx, Math.round(ghost.y) + m.dy));
            }

            if (possibleMoves.length > 0) {
                let chosenMove = selectGhostMove(ghost, possibleMoves, gx, gy);
                ghost.dx = chosenMove.dx;
                ghost.dy = chosenMove.dy;
            }
        }

        // 2. Safety net for zero velocity
        if (ghost.dx === 0 && ghost.dy === 0) {
            let fallbackMoves = [
                { dx: 0, dy: -1 },
                { dx: 0, dy: 1 },
                { dx: -1, dy: 0 },
                { dx: 1, dy: 0 }
            ].filter(m => !isGhostWall(Math.round(ghost.x) + m.dx, Math.round(ghost.y) + m.dy));

            if (fallbackMoves.length > 0) {
                let randomMove = fallbackMoves[Math.floor(Math.random() * fallbackMoves.length)];
                ghost.dx = randomMove.dx;
                ghost.dy = randomMove.dy;
            }
        }

        // 3. Velocity application
        let currentSpeed = frightenedTimer > 0 ? ghost.speed * 0.6 : ghost.speed;
        ghost.x += ghost.dx * currentSpeed;
        ghost.y += ghost.dy * currentSpeed;
    });
}