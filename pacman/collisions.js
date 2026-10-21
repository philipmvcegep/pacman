// collisions.js
import { player, ghosts, getFrightenedTimer, setFrightenedTimer } from './sprites.js';

export function checkCollisions(gameData, callbacks) {
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

    // 3. Check victory condition
    if (gameData.items.length === 0) {
        gameData.gameState = 'VICTORY';
        showOverlay('VICTORY!', `You cleared the maze! Score: ${gameData.score}`, 'PLAY AGAIN');
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