// collisions.js
import { player, ghosts, getFrightenedTimer, setFrightenedTimer, resetSprites } from '../sprites/sprites.js';
import { maps, currentLevelIndex, switchLevel, getCurrentLevel } from '../ressources/map.js';

export function processGameTriggers(gameData, callbacks) {
    let { items, powerPellets, score, lives, gameState, map } = gameData;
    let { updateUI, showOverlay, resetPlayerPosition } = callbacks;

    // 1. Check normal item pellets
    gameData.items = items.filter(item => {
        if (Math.hypot(player.x - item.x, player.y - item.y) < 0.4) {
            gameData.score += 10;
            updateUI(gameData);
            return false;
        }
        return true;
    });

    // 2. Check power pellets
    gameData.powerPellets = powerPellets.filter(pp => {
        if (Math.hypot(player.x - pp.x, player.y - pp.y) < 0.4) {
            gameData.score += 50;
            setFrightenedTimer(350);
            updateUI(gameData);
            return false;
        }
        return true;
    });

// 3. Check level completion / victory condition
    if (gameData.items.length === 0) {
        let nextIndex = currentLevelIndex + 1;
        
        if (nextIndex < maps.length) {
            // Advance to the next level!
            switchLevel(nextIndex);
            
            // Re-initialize items and power pellets for the new map
            gameData.items = [];
            gameData.powerPellets = [];
            
            for (let r = 0; r < maps[nextIndex].length; r++) {
                for (let c = 0; c < maps[nextIndex][r].length; c++) {
                    let tile = maps[nextIndex][r][c];
                    if (tile === 0 || tile === 4) {
                        gameData.items.push({ x: c, y: r });
                    } else if (tile === 2) {
                        gameData.powerPellets.push({ x: c, y: r });
                    }
                }
            }
            
            // Reset player and ghosts positions for the new maze
            resetSprites();
            updateUI(gameData);
            
            // Brief notification overlay or direct continuation
            showOverlay(`LEVEL ${getCurrentLevel()}!`, `Get ready for the next maze!`, 'CONTINUE');
            gameData.gameState = 'PAUSED'; // Pause until they click continue
        } else {
            // Ultimate Game Victory
            gameData.gameState = 'VICTORY';
            showOverlay('VICTORY!', `You cleared all levels! Final Score: ${gameData.score}`, 'PLAY AGAIN');
        }
        return;
    }

    // 4. Check ghost collisions
    ghosts.forEach(ghost => {
        if (Math.hypot(player.x - ghost.x, player.y - ghost.y) < 0.5) {
            if (getFrightenedTimer() > 0) {
                gameData.score += 200;
                ghost.x = ghost.homeX;
                ghost.y = ghost.homeY;
                ghost.dx = 0;
                ghost.dy = 0;
                updateUI(gameData);
            } else {
                gameData.lives--;
                updateUI(gameData);
                if (gameData.lives <= 0) {
                    gameData.gameState = 'GAMEOVER';
                    showOverlay('GAME OVER', `The ghosts caught you! Final Score: ${gameData.score}`, 'TRY AGAIN');
                } else {
                    resetPlayerPosition();
                }
            }
        }
    });
}