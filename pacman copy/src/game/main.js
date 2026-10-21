// main.js
import { map } from '../ressources/map.js';
import { player, ghosts, resetSprites, updatePlayer } from '../sprites/sprites.js';
import { updateGhosts } from '../sprites/ghostAI.js';
import { processGameTriggers } from './triggerProcessor.js';
import { drawGame } from './renderer.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreDisplay = document.getElementById('score-display');
const livesDisplay = document.getElementById('lives-display');
const itemsDisplay = document.getElementById('items-display');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayDesc = document.getElementById('overlay-desc');
const actionBtn = document.getElementById('action-btn');

const gameData = {
    score: 0,
    lives: 3,
    gameState: 'START',
    items: [],
    powerPellets: [],
    TOTAL_ITEMS: 0,
    map: map
};

let animationFrameId = null;
let tileSize = 20;

const TARGET_FPS = 60;
const timeStep = 1000 / TARGET_FPS;
let lastTime = 0;
let accumulator = 0;

function resizeCanvas() {
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    tileSize = canvas.width / map[0].length;
    canvas.height = tileSize * map.length;
    container.style.height = `${canvas.height}px`;
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', () => setTimeout(resizeCanvas, 200));

function setDirection(dx, dy) {
    player.nextDx = dx;
    player.nextDy = dy;
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') setDirection(0, -1);
    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') setDirection(0, 1);
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') setDirection(-1, 0);
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') setDirection(1, 0);
});

document.getElementById('btn-up').addEventListener('click', () => setDirection(0, -1));
document.getElementById('btn-down').addEventListener('click', () => setDirection(0, 1));
document.getElementById('btn-left').addEventListener('click', () => setDirection(-1, 0));
document.getElementById('btn-right').addEventListener('click', () => setDirection(1, 0));

function updateUI(data = gameData) {
    scoreDisplay.textContent = data.score;
    livesDisplay.textContent = data.lives;
    const collectedCount = data.TOTAL_ITEMS - data.items.length;
    itemsDisplay.textContent = `${collectedCount}/${data.TOTAL_ITEMS}`;
}

function resetPlayerPosition() {
    player.x = 9;
    player.y = 5;
    player.dx = 0;
    player.dy = 0;
    player.nextDx = 0;
    player.nextDy = 0;
}

function initGame() {
    gameData.score = 0;
    gameData.lives = 3;
    resetSprites();
    resetPlayerPosition();

    gameData.items = [];
    gameData.powerPellets = [];
    for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < map[r].length; c++) {
            if (map[r][c] === 0) {
                gameData.items.push({ x: c, y: r });
            } else if (map[r][c] === 2) {
                gameData.powerPellets.push({ x: c, y: r });
            }
        }
    }
    gameData.TOTAL_ITEMS = gameData.items.length;
    updateUI(gameData);
}

function update() {
    if (gameData.gameState !== 'PLAYING') return;

    updatePlayer();
    updateGhosts();
    processGameTriggers(gameData, {
        updateUI,
        showOverlay,
        resetPlayerPosition
    });
}

function draw() {
    drawGame(ctx, tileSize, gameData);
}

function gameLoop(timestamp) {
    if (gameData.gameState !== 'PLAYING') return;
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    accumulator += deltaTime;

    while (accumulator >= timeStep) {
        update();
        accumulator -= timeStep;
    }

    draw();

    animationFrameId = requestAnimationFrame(gameLoop);
}

function showOverlay(title, desc, btnText) {
    overlayTitle.textContent = title;
    overlayDesc.textContent = desc;
    actionBtn.textContent = btnText;
    overlay.classList.remove('hidden');
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'auto';
}

function hideOverlay() {
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
}

actionBtn.addEventListener('click', () => {
    hideOverlay();
    initGame();
    gameData.gameState = 'PLAYING';
    cancelAnimationFrame(animationFrameId);

    lastTime = performance.now();
    accumulator = 0;

    animationFrameId = requestAnimationFrame(gameLoop);
});

window.onload = () => {
    resizeCanvas();
    draw();
};