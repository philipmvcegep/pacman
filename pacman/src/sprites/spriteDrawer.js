// spriteDrawer.js
import { player, ghosts, frightenedTimer } from './sprites.js';

let mouthAnimationTimer = 0;

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