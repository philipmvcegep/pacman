// renderer.js
import { map } from '../ressources/map.js';
import { drawSprites } from '../sprites/spriteDrawer.js';

export function drawGame(ctx, tileSize, gameData) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // 1. Draw Maze Walls
    for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < map[r].length; c++) {
            if (map[r][c] === 1) {
                ctx.fillStyle = '#1e3a8a';
                ctx.fillRect(c * tileSize, r * tileSize, tileSize, tileSize);
                ctx.strokeStyle = '#3b82f6';
                ctx.lineWidth = 1;
                ctx.strokeRect(c * tileSize, r * tileSize, tileSize, tileSize);
            } else if (map[r][c] === 4) {
                // Special Ghost-Blocked Escape Tiles (Visible only to Pac-Man!)
                ctx.fillStyle = '#065f46'; // Deep emerald/teal shade
                ctx.fillRect(c * tileSize, r * tileSize, tileSize, tileSize);
                ctx.strokeStyle = '#34d399'; // Bright mint border
                ctx.lineWidth = 1;
                ctx.strokeRect(c * tileSize, r * tileSize, tileSize, tileSize);
            }
        }
    }

    // 2. Draw Regular Items (Pellets)
    gameData.items.forEach(item => {
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc((item.x + 0.5) * tileSize, (item.y + 0.5) * tileSize, tileSize * 0.18, 0, Math.PI * 2);
        ctx.fill();
    });

    // 3. Draw Power Pellets (Flashing)
    gameData.powerPellets.forEach(pp => {
        if (Math.floor(Date.now() / 200) % 2 === 0) {
            ctx.fillStyle = '#f43f5e';
            ctx.beginPath();
            ctx.arc((pp.x + 0.5) * tileSize, (pp.y + 0.5) * tileSize, tileSize * 0.35, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    // 4. Draw Player and Ghosts
    drawSprites(ctx, tileSize);
}