// DOM Elements for UI
const turnBadge = document.getElementById("turn-badge");
const gameOverModal = document.getElementById("game-over-modal");
const gameOverTitle = document.getElementById("game-over-title");
const gameOverMessage = document.getElementById("game-over-message");
const restartBtn = document.getElementById("restart-btn");
const promoModal = document.getElementById("promotion-modal");
const promoOptions = document.getElementById("promotion-options");

const modeModal = document.getElementById("mode-modal");
const modeBotBtn = document.getElementById("mode-bot");
const modeHumanBtn = document.getElementById("mode-human");
const diffModal = document.getElementById("difficulty-modal");
const backToModeBtn = document.getElementById("back-to-mode");
const diffBtns = document.querySelectorAll(".diff-btn");
const chessTimerUI = document.getElementById("chess-timer");
const whiteTimeEl = document.getElementById("white-time");
const blackTimeEl = document.getElementById("black-time");
const timerWhitePanel = document.getElementById("timer-white");
const timerBlackPanel = document.getElementById("timer-black");

let gameMode = 'bot';
let botDifficulty = 'novice';
let botDepth = 1;

modeBotBtn.addEventListener('click', () => { 
    modeModal.classList.add('hidden'); 
    diffModal.classList.remove('hidden'); 
});

backToModeBtn.addEventListener('click', () => {
    diffModal.classList.add('hidden');
    modeModal.classList.remove('hidden');
});

diffBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const level = e.currentTarget.dataset.level;
        botDifficulty = level;
        switch(level) {
            case 'novice': botDepth = 1; break;
            case 'intermediate': botDepth = 2; break;
            case 'advanced': botDepth = 3; break;
            case 'professional': botDepth = 4; break;
            case 'grandmaster': botDepth = 4; break;
        }
        gameMode = 'bot';
        diffModal.classList.add('hidden');
        restartGame();
    });
});

modeHumanBtn.addEventListener('click', () => { 
    gameMode = 'human'; 
    modeModal.classList.add('hidden'); 
    restartGame(); 
});

// Timer Variables
let whiteTimeLeft = 600;
let blackTimeLeft = 600;
let timerInterval = null;

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

function updateTimerUI() {
    whiteTimeEl.innerText = formatTime(whiteTimeLeft);
    blackTimeEl.innerText = formatTime(blackTimeLeft);
    
    if (whiteTimeLeft <= 60) timerWhitePanel.classList.add('low-time');
    else timerWhitePanel.classList.remove('low-time');
    
    if (blackTimeLeft <= 60) timerBlackPanel.classList.add('low-time');
    else timerBlackPanel.classList.remove('low-time');

    timerWhitePanel.classList.toggle('active-timer', actColor === 'w');
    timerBlackPanel.classList.toggle('active-timer', actColor === 'b');
    timerBlackPanel.classList.toggle('black-active', actColor === 'b');
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (isGameOver) {
            clearInterval(timerInterval);
            return;
        }
        if (actColor === 'w') {
            whiteTimeLeft--;
            if (whiteTimeLeft <= 0) {
                whiteTimeLeft = 0;
                handleTimeOut('w');
            }
        } else {
            blackTimeLeft--;
            if (blackTimeLeft <= 0) {
                blackTimeLeft = 0;
                handleTimeOut('b');
            }
        }
        updateTimerUI();
    }, 1000);
}

function handleTimeOut(color) {
    isGameOver = true;
    clearInterval(timerInterval);
    gameOverModal.classList.remove('hidden');
    const winner = color === 'w' ? "Black" : "White";
    gameOverTitle.innerText = "Time's Up!";
    gameOverMessage.innerText = `${winner} wins on time.`;
}

// SVGs for UI components (captured pieces, modals)
const SVGs = {
    'wp': '<svg viewBox="0 0 45 45"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#fff" stroke="#000" stroke-width="1.5"/></svg>',
    'wn': '<svg viewBox="0 0 45 45"><path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18" fill="none" stroke="#000" stroke-width="1.5"/><path d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26.5 C 6,24 10,23 11,24 C 11,24 11,22.01 10,21 C 8,20.5 7.5,21.5 6.5,20.5 C 6.5,19.5 9.5,17.5 11,18 C 12,18.5 14,19 14,19 C 14,19 15,16 15,14C 15,12 16,10 16,10 C 16,10 18,9 20,9 C 22,9 23,10 24,10 C 25,10 25,11 25,11" fill="#fff" stroke="#000" stroke-width="1.5"/></svg>',
    'wb': '<svg viewBox="0 0 45 45"><g fill="#fff" stroke="#000" stroke-width="1.5"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2zM15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-2-1.5-4-1.5-6-1.5-2 0-4 0-6 1.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2zM25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/><path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" fill="none"/></g></svg>',
    'wr': '<svg viewBox="0 0 45 45"><g fill="#fff" stroke="#000" stroke-width="1.5"><path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5"/><path d="M34 14l-3 3H14l-3-3"/><path d="M31 17v12.5H14V17"/><path d="M31 29.5l1.5 2.5h-20l1.5-2.5"/><path d="M11 14h23"/></g></svg>',
    'wq': '<svg viewBox="0 0 45 45"><g fill="#fff" stroke="#000" stroke-width="1.5"><path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM33 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0z"/><path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-13.5V25l-7-11 2 12zM9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-21.5-1.5-27 0z"/><path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" fill="none"/></g></svg>',
    'wk': '<svg viewBox="0 0 45 45"><g fill="none" stroke="#000" stroke-width="1.5"><path d="M22.5 11.63V6M20 8h5"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#fff"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10.5 5 10.5v7z" fill="#fff"/><path d="M11.5 30c5.5-3 15.5-3 21 0M12.5 33.5c5.5-3 15.5-3 21 0"/></g></svg>',
    
    'bp': '<svg viewBox="0 0 45 45"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#000" stroke="#000" stroke-width="1.5"/></svg>',
    'bn': '<svg viewBox="0 0 45 45"><g fill="#000" stroke="#000" stroke-width="1.5"><path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18" fill="none"/><path d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26.5 C 6,24 10,23 11,24 C 11,24 11,22.01 10,21 C 8,20.5 7.5,21.5 6.5,20.5 C 6.5,19.5 9.5,17.5 11,18 C 12,18.5 14,19 14,19 C 14,19 15,16 15,14 C 15,12 16,10 16,10 C 16,10 18,9 20,9 C 22,9 23,10 24,10 C 25,10 25,11 25,11"/><path d="M 9.5 25.5 A 0.5 0.5 0 1 1 8.5,25.5 A 0.5 0.5 0 1 1 9.5 25.5 z" fill="#fff" stroke="#fff" /><path d="M 15 15.5 A 0.5 1.5 0 1 1 14,15.5 A 0.5 1.5 0 1 1 15 15.5 z" transform="matrix(0.866,0.5,-0.5,0.866,9.693,-5.173)" fill="#fff" stroke="#fff"/></g></svg>',
    'bb': '<svg viewBox="0 0 45 45"><g fill="#000" stroke="#000" stroke-width="1.5"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2zM15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-2-1.5-4-1.5-6-1.5-2 0-4 0-6 1.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2zM25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/><path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" stroke="#fff" /></g></svg>',
    'br': '<svg viewBox="0 0 45 45"><g fill="#000" stroke="#000" stroke-width="1.5"><path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5"/><path d="M34 14l-3 3H14l-3-3"/><path d="M31 17v12.5H14V17"/><path d="M31 29.5l1.5 2.5h-20l1.5-2.5"/><path d="M11 14h23"/><path d="M11 14h23M14 17h17M12.5 32h20M11 36h23" stroke="#fff" stroke-width="1" /></g></svg>',
    'bq': '<svg viewBox="0 0 45 45"><g fill="#000" stroke="#000" stroke-width="1.5"><path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM33 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0z"/><path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-13.5V25l-7-11 2 12zM9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-21.5-1.5-27 0z"/><path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" fill="none" stroke="#fff"/></g></svg>',
    'bk': '<svg viewBox="0 0 45 45"><g fill="none" stroke="#000" stroke-width="1.5"><path d="M22.5 11.63V6M20 8h5"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#000"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10.5 5 10.5v7z" fill="#000"/><path d="M11.5 30c5.5-3 15.5-3 21 0M12.5 33.5c5.5-3 15.5-3 21 0" stroke="#fff"/><path d="M22.5 22.5v9M17 24.5h11" stroke="#fff"/></g></svg>'
};

// State
let board = [];
let actColor = 'w';
let selectedSquare = null;
let validMoveFlags = [];
let enPassantTarget = null;
let castlingRights = { w: {k: true, q: true}, b: {k: true, q: true} };
let kingPos = { w: {r:7, f:4}, b: {r:0, f:4} };
let isGameOver = false;
let capturedPieces = { w: [], b: [] };
let pendingPromotion = null;

// Three.js State
const canvasContainer = document.getElementById("canvas-container");
let scene, camera, renderer, controls;
let squareMeshes = [];
let pieceMeshes = [];
let moveIndicators = [];

const TILE_SIZE = 2;
const MAP_OFFSET = (8 * TILE_SIZE) / 2 - (TILE_SIZE / 2);

// Setup Three.js World
function init3D() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x121217);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 15, 18);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    canvasContainer.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.maxPolarAngle = Math.PI / 2.2;
    controls.minDistance = 10;
    controls.maxDistance = 60;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff5e6, 0.8);
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 20;
    dirLight.shadow.camera.bottom = -20;
    dirLight.shadow.camera.left = -20;
    dirLight.shadow.camera.right = 20;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    build3DBoard();
    
    // Resize Handle
    window.addEventListener('resize', onWindowResize);
    // Click Handle
    renderer.domElement.addEventListener('pointerdown', onSceneClick);
    
    animate();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function build3DBoard() {
    const lightMat = new THREE.MeshStandardMaterial({ color: 0xebecd0, roughness: 0.8 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x739552, roughness: 0.8 });
    
    // Border
    const borderGeo = new THREE.BoxGeometry(TILE_SIZE * 8 + 0.8, 0.8, TILE_SIZE * 8 + 0.8);
    const borderMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const border = new THREE.Mesh(borderGeo, borderMat);
    border.position.y = -0.45;
    border.receiveShadow = true;
    scene.add(border);

    // Wooden Table
    const tableGeo = new THREE.BoxGeometry(35, 1, 35);
    const tableMat = new THREE.MeshStandardMaterial({ color: 0x4a3018, roughness: 0.9, metalness: 0.1 });
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.y = -1.35;
    table.receiveShadow = true;
    scene.add(table);

    // Table Legs
    const legGeo = new THREE.CylinderGeometry(0.8, 0.6, 15, 16);
    const legPositions = [
        [-16, -9.35, -16],
        [16, -9.35, -16],
        [-16, -9.35, 16],
        [16, -9.35, 16]
    ];
    legPositions.forEach(pos => {
        const leg = new THREE.Mesh(legGeo, tableMat);
        leg.position.set(...pos);
        leg.castShadow = true;
        leg.receiveShadow = true;
        scene.add(leg);
    });

    // Tiles
    const tileGeo = new THREE.BoxGeometry(TILE_SIZE, 0.2, TILE_SIZE);
    
    for (let r = 0; r < 8; r++) {
        for (let f = 0; f < 8; f++) {
            const isLight = (r + f) % 2 === 0;
            const tile = new THREE.Mesh(tileGeo, isLight ? lightMat : darkMat);
            
            // Map array (r, f) to 3D space
            // File -> X, Rank -> Z
            tile.position.x = f * TILE_SIZE - MAP_OFFSET;
            tile.position.y = 0;
            tile.position.z = r * TILE_SIZE - MAP_OFFSET;
            
            tile.receiveShadow = true;
            tile.userData = { r, f, isTile: true, originalMat: isLight ? lightMat : darkMat };
            
            scene.add(tile);
            squareMeshes.push(tile);
        }
    }
}

// Procedural Geometry Generators
function createPawnGeo() {
    const group = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.86, 0.28, 20));
    base.position.y = 0.14;
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.44, 0.08, 12, 20));
    collar.position.y = 0.38;
    collar.rotation.x = Math.PI / 2;
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.48, 1.1, 20));
    body.position.y = 0.95;
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.26, 16));
    neck.position.y = 1.63;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.38, 18, 18));
    head.position.y = 2.0;
    group.add(base, collar, body, neck, head);
    return group;
}

function createRookGeo() {
    const group = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.74, 0.9, 0.3, 20));
    base.position.y = 0.15;
    const lower = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.68, 0.9, 18));
    lower.position.y = 0.78;
    const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.56, 1.0, 18));
    upper.position.y = 1.7;
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.76, 0.72, 0.24, 20));
    crown.position.y = 2.33;
    group.add(base, lower, upper, crown);
    for (let i = 0; i < 6; i++) {
        const battlement = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.22, 0.32));
        const a = (Math.PI * 2 * i) / 6;
        battlement.position.set(Math.cos(a) * 0.58, 2.55, Math.sin(a) * 0.58);
        battlement.lookAt(0, 2.55, 0);
        group.add(battlement);
    }
    return group;
}

function createKnightGeo() {
    const group = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.88, 0.3, 20));
    base.position.y = 0.15;
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.58, 1.0, 16));
    trunk.position.y = 0.8;
    const chest = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.15, 1.05));
    chest.position.set(0.08, 1.55, 0.02);
    chest.rotation.z = -0.2;
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.82, 0.95));
    head.position.set(0.22, 2.15, 0.08);
    head.rotation.z = -0.16;
    const snout = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.36, 0.66));
    snout.position.set(0.36, 1.95, 0.35);
    snout.rotation.x = -0.2;
    const earA = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.28, 0.08));
    earA.position.set(0.06, 2.62, 0.26);
    const earB = earA.clone();
    earB.position.z = -0.06;
    group.add(base, trunk, chest, head, snout, earA, earB);
    return group;
}

function createBishopGeo() {
    const group = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.86, 0.3, 20));
    base.position.y = 0.15;
    const lower = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.56, 1.05, 18));
    lower.position.y = 0.9;
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.34, 1.02, 18));
    stem.position.y = 1.86;
    const mitre = new THREE.Mesh(new THREE.SphereGeometry(0.46, 18, 18));
    mitre.position.y = 2.6;
    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.42, 14));
    cap.position.y = 3.08;
    group.add(base, lower, stem, mitre, cap);
    return group;
}

function createQueenGeo() {
    const group = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.94, 0.32, 20));
    base.position.y = 0.16;
    const lower = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.7, 1.35, 20));
    lower.position.y = 1.0;
    const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.5, 1.18, 18));
    upper.position.y = 2.06;
    const crownRing = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.08, 12, 24));
    crownRing.position.y = 2.78;
    crownRing.rotation.x = Math.PI / 2;
    group.add(base, lower, upper, crownRing);
    for (let i = 0; i < 8; i++) {
        const jewel = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 10));
        const a = (Math.PI * 2 * i) / 8;
        jewel.position.set(Math.cos(a) * 0.44, 2.98 + (i % 2 ? 0.03 : 0), Math.sin(a) * 0.44);
        group.add(jewel);
    }
    const top = new THREE.Mesh(new THREE.SphereGeometry(0.24, 14, 14));
    top.position.y = 3.28;
    group.add(top);
    return group;
}

function createKingGeo() {
    const group = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.84, 0.96, 0.32, 20));
    base.position.y = 0.16;
    const lower = new THREE.Mesh(new THREE.CylinderGeometry(0.54, 0.74, 1.45, 20));
    lower.position.y = 1.06;
    const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.54, 1.45, 18));
    upper.position.y = 2.18;
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.64, 0.44, 0.3, 18));
    crown.position.y = 3.1;
    const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.62, 0.16));
    crossV.position.y = 3.66;
    const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.14, 0.16));
    crossH.position.y = 3.64;
    group.add(base, lower, upper, crown, crossV, crossH);
    return group;
}

function getPieceMesh(type) {
    switch (type) {
        case 'p': return createPawnGeo();
        case 'r': return createRookGeo();
        case 'n': return createKnightGeo();
        case 'b': return createBishopGeo();
        case 'q': return createQueenGeo();
        case 'k': return createKingGeo();
        default: return createPawnGeo();
    }
}

const whiteMat = new THREE.MeshPhysicalMaterial({
    color: 0xf6f0e6,
    roughness: 0.18,
    metalness: 0.42,
    clearcoat: 0.45,
    clearcoatRoughness: 0.22
});
const blackMat = new THREE.MeshPhysicalMaterial({
    color: 0x161a22,
    roughness: 0.3,
    metalness: 0.62,
    clearcoat: 0.3,
    clearcoatRoughness: 0.28
});

function tagPieceMeshData(mesh, r, f, code) {
    mesh.userData = { r, f, code, isPieceRoot: true };
    mesh.traverse(child => {
        if (child.isMesh) {
            child.userData = { r, f, code };
        }
    });
}

// Mapping game array to 3D world
function updateDraw3D() {
    // 1. Clear dead meshes
    const currentPieces = [];
    for (let r = 0; r < 8; r++) {
        for (let f = 0; f < 8; f++) {
            if (board[r][f]) currentPieces.push({ r, f, code: board[r][f] });
        }
    }

    // Remove meshes that are destroyed
    for (let i = pieceMeshes.length - 1; i >= 0; i--) {
        const pm = pieceMeshes[i];
        const match = currentPieces.find(p => p.r === pm.userData.r && p.f === pm.userData.f && p.code === pm.userData.code);
        if (!match) {
            scene.remove(pm);
            pieceMeshes.splice(i, 1);
        }
    }

    // 2. Add new pieces (e.g., promotions) or update existing
    currentPieces.forEach(p => {
        let existing = pieceMeshes.find(pm => pm.userData.r === p.r && pm.userData.f === p.f);
        if (!existing) {
            // Check if it's a moved piece (if the engine updated its r, f but mesh has old r, f)
            // Wait, since we map by r, f, if a piece moves, its old (r, f) doesn't match and it'd get deleted.
            // We need to sync by an ID, or simply clear and recreate all (not smooth), or animate inside finalizeMove.
            // For simplicity and to allow smooth animations:
            
            // Actually, we'll spawn it here if it doesn't exist.
            const mesh = getPieceMesh(p.code[1]);
            mesh.traverse(child => {
                if (child.isMesh) {
                    child.material = p.code[0] === 'w' ? whiteMat : blackMat;
                    child.castShadow = true;
                }
            });
            tagPieceMeshData(mesh, p.r, p.f, p.code);
            
            mesh.position.set(p.f * TILE_SIZE - MAP_OFFSET, 0.1, p.r * TILE_SIZE - MAP_OFFSET);
            if (p.code[0] === 'b') mesh.rotation.y = Math.PI; // flip black pieces

            scene.add(mesh);
            pieceMeshes.push(mesh);
        } else {
            tagPieceMeshData(existing, p.r, p.f, p.code);
        }
    });

    // 3. Modifiers (Highlights)
    // Clear highlights
    squareMeshes.forEach(sq => {
        sq.material = sq.userData.originalMat;
    });
    moveIndicators.forEach(ind => scene.remove(ind));
    moveIndicators = [];

    const highlightMat = new THREE.MeshBasicMaterial({ color: 0xffff33, opacity: 0.5, transparent: true });

    if (selectedSquare) {
        const sq = squareMeshes.find(s => s.userData.r === selectedSquare.r && s.userData.f === selectedSquare.f);
        if (sq) sq.material = highlightMat;

        validMoveFlags.forEach(m => {
            const indGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 16);
            const indMat = new THREE.MeshBasicMaterial({ color: 0x000000, opacity: 0.3, transparent: true });
            if (board[m.r][m.f] || m.enPassant) indMat.color.setHex(0xff3333); // Capture
            
            const ind = new THREE.Mesh(indGeo, indMat);
            ind.position.set(m.f * TILE_SIZE - MAP_OFFSET, 0.3, m.r * TILE_SIZE - MAP_OFFSET);
            scene.add(ind);
            moveIndicators.push(ind);
        });
    }
}

// Raycaster Logic
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onSceneClick(event) {
    if (isGameOver || pendingPromotion) return;
    if (gameMode === 'bot' && actColor === 'b') return; // block if bot's turn

    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Intersect pieces first (so clicks on elevated meshes register)
    const pieceHits = raycaster.intersectObjects(pieceMeshes, true);
    if (pieceHits.length > 0) {
        const hit = pieceHits[0];
        let obj = hit.object;
        while (obj && !(obj.userData && Number.isInteger(obj.userData.r) && Number.isInteger(obj.userData.f))) {
            obj = obj.parent;
        }
        if (obj && obj.userData) {
            processSquareSelection(obj.userData.r, obj.userData.f);
            return;
        }
        const file = Math.round((hit.point.x + MAP_OFFSET) / TILE_SIZE);
        const rank = Math.round((hit.point.z + MAP_OFFSET) / TILE_SIZE);
        if (rank >= 0 && rank < 8 && file >= 0 && file < 8) {
            processSquareSelection(rank, file);
            return;
        }
    }

    // Fallback: board square click
    const squareHits = raycaster.intersectObjects(squareMeshes, false);
    if (squareHits.length > 0) {
        const target = squareHits[0].object.userData;
        processSquareSelection(target.r, target.f);
    }
}

// Game Engine Setup
function initBoardState() {
    board = [
        ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
        ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
        ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr']
    ];
}

// Logic - Move validation
function getPseudoLegalMoves(piece, r, f, stateBoard = board) {
    let moves = [];
    const color = piece[0];
    const type = piece[1];
    const dirs = {
        'b': [[-1,-1], [-1,1], [1,-1], [1,1]],
        'r': [[-1,0], [1,0], [0,-1], [0,1]],
        'q': [[-1,-1], [-1,1], [1,-1], [1,1], [-1,0], [1,0], [0,-1], [0,1]],
    };

    if (type === 'p') {
        const dir = color === 'w' ? -1 : 1;
        const startRank = color === 'w' ? 6 : 1;
        
        if (r + dir >= 0 && r + dir < 8 && stateBoard[r + dir][f] === null) {
            moves.push({r: r + dir, f: f});
            if (r === startRank && stateBoard[r + 2 * dir][f] === null) {
                moves.push({r: r + 2 * dir, f: f});
            }
        }
        for (let c of [-1, 1]) {
            if (r + dir >= 0 && r + dir < 8 && f + c >= 0 && f + c < 8) {
                const target = stateBoard[r + dir][f + c];
                if (target && target[0] !== color) {
                    moves.push({r: r + dir, f: f + c});
                } else if (enPassantTarget && enPassantTarget.r === r + dir && enPassantTarget.f === f + c) {
                    moves.push({r: r + dir, f: f + c, enPassant: true});
                }
            }
        }
    } else if (type === 'n' || type === 'k') {
        const jumps = type === 'n' 
            ? [[-2,-1], [-2,1], [-1,-2], [-1,2], [1,-2], [1,2], [2,-1], [2,1]]
            : [[-1,-1], [-1,0], [-1,1], [0,-1], [0,1], [1,-1], [1,0], [1,1]];
        
        for (let j of jumps) {
            const nr = r + j[0], nf = f + j[1];
            if (nr >= 0 && nr < 8 && nf >= 0 && nf < 8) {
                const target = stateBoard[nr][nf];
                if (!target || target[0] !== color) moves.push({r: nr, f: nf});
            }
        }
        if (type === 'k') {
            if (castlingRights[color].k && stateBoard[r][f+1] === null && stateBoard[r][f+2] === null) {
                moves.push({r: r, f: f+2, castle: 'k'});
            }
            if (castlingRights[color].q && stateBoard[r][f-1] === null && stateBoard[r][f-2] === null && stateBoard[r][f-3] === null) {
                moves.push({r: r, f: f-2, castle: 'q'});
            }
        }
    } else {
        for (let d of dirs[type]) {
            let nr = r + d[0], nf = f + d[1];
            while (nr >= 0 && nr < 8 && nf >= 0 && nf < 8) {
                const target = stateBoard[nr][nf];
                if (!target) {
                    moves.push({r: nr, f: nf});
                } else {
                    if (target[0] !== color) moves.push({r: nr, f: nf});
                    break;
                }
                nr += d[0]; nf += d[1];
            }
        }
    }
    return moves;
}

function isInCheck(color, stateBoard) {
    let kr = -1, kf = -1;
    for (let r = 0; r < 8; r++) {
        for (let f = 0; f < 8; f++) {
            if (stateBoard[r][f] === color + 'k') { kr = r; kf = f; }
        }
    }
    if(kr === -1) return true;
    const oppColor = color === 'w' ? 'b' : 'w';
    for (let r = 0; r < 8; r++) {
        for (let f = 0; f < 8; f++) {
            if (stateBoard[r][f] && stateBoard[r][f][0] === oppColor) {
                const moves = getPseudoLegalMoves(stateBoard[r][f], r, f, stateBoard);
                for (let m of moves) { if (m.r === kr && m.f === kf) return true; }
            }
        }
    }
    return false;
}

function isSquareAttacked(r, f, color, stateBoard) {
    const oppColor = color === 'w' ? 'b' : 'w';
    for (let ir = 0; ir < 8; ir++) {
        for (let jf = 0; jf < 8; jf++) {
            if (stateBoard[ir][jf] && stateBoard[ir][jf][0] === oppColor) {
                const moves = getPseudoLegalMoves(stateBoard[ir][jf], ir, jf, stateBoard);
                for (let m of moves) { if (m.r === r && m.f === f) return true; }
            }
        }
    }
    return false;
}

function getLegalMoves(piece, r, f, stateBoard = board) {
    const moves = getPseudoLegalMoves(piece, r, f, stateBoard);
    const legalMoves = [];
    const color = piece[0];

    for (let m of moves) {
        let tempBoard = stateBoard.map(row => [...row]);
        tempBoard[m.r][m.f] = piece;
        tempBoard[r][f] = null;
        if (m.enPassant) tempBoard[r][m.f] = null;
        
        let valid = true;
        if (m.castle) {
            if (isInCheck(color, stateBoard)) valid = false;
            else if (m.castle === 'k' && isSquareAttacked(r, f+1, color, stateBoard)) valid = false;
            else if (m.castle === 'q' && isSquareAttacked(r, f-1, color, stateBoard)) valid = false;
        }

        if (valid && !isInCheck(color, tempBoard)) legalMoves.push(m);
    }
    return legalMoves;
}

function processSquareSelection(r, f) {
    const piece = board[r][f];

    if (selectedSquare) {
        const sr = selectedSquare.r;
        const sf = selectedSquare.f;
        
        const move = validMoveFlags.find(m => m.r === r && m.f === f);
        if (move) {
            executeMove(board[sr][sf], sr, sf, move);
            return;
        }
        
        if (piece && piece[0] === actColor) {
            selectPiece(piece, r, f);
        } else {
            clearSelection();
        }
        return;
    }

    if (piece && piece[0] === actColor) {
        selectPiece(piece, r, f);
    }
}

function selectPiece(piece, r, f) {
    selectedSquare = {r, f};
    validMoveFlags = getLegalMoves(piece, r, f);
    updateDraw3D();
}

function clearSelection() {
    selectedSquare = null;
    validMoveFlags = [];
    updateDraw3D();
}

// Sound Synthesizer setup
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

function playMoveSound() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    // Create oscillator and gain for a sharp, hollow "thwack"
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    // Frequency drop represents a solid impact
    osc.frequency.setValueAtTime(400, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.05);

    // Sharp attack and incredibly fast decay for the "knock"
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.15);
}

function animatePiece(mesh, targetR, targetF, onComplete) {
    const targetX = targetF * TILE_SIZE - MAP_OFFSET;
    const targetZ = targetR * TILE_SIZE - MAP_OFFSET;
    const startX = mesh.position.x;
    const startZ = mesh.position.z;
    
    let progress = 0;
    const speed = 0.05;

    function step() {
        progress += speed;
        if (progress >= 1) {
            mesh.position.set(targetX, 0.1, targetZ);
            try { playMoveSound(); } catch(e){} // Play sound on impact!
            if(onComplete) onComplete();
        } else {
            // Add a small hop arc
            mesh.position.x = THREE.MathUtils.lerp(startX, targetX, progress);
            mesh.position.z = THREE.MathUtils.lerp(startZ, targetZ, progress);
            mesh.position.y = 0.1 + Math.sin(progress * Math.PI) * 1.5;
            requestAnimationFrame(step);
        }
    }
    step();
}

function executeMove(piece, fromR, fromF, move) {
    const isPromo = piece[1] === 'p' && (move.r === 0 || move.r === 7);
    
    if (isPromo && actColor === 'w') {
        pendingPromotion = { piece, fromR, fromF, move };
        showPromotionModal(piece[0]);
        return;
    }

    // Identify the piece mesh representing the selected internal piece to animate
    const pm = pieceMeshes.find(m => m.userData.r === fromR && m.userData.f === fromF);
    
    // Clear selection immediately to block further clicks
    clearSelection();
    
    if (pm) {
        animatePiece(pm, move.r, move.f, () => {
            // Only update backend AFTER animation finishes
            finalizeMove(piece, fromR, fromF, move, (isPromo && actColor === 'b') ? 'bq' : null);
        });
    } else {
        finalizeMove(piece, fromR, fromF, move, (isPromo && actColor === 'b') ? 'bq' : null);
    }
}

function finalizeMove(piece, fromR, fromF, move, promotedPiece = null) {
    const targetPiece = board[move.r][move.f];
    let captured = targetPiece;

    board[move.r][move.f] = promotedPiece ? promotedPiece : piece;
    board[fromR][fromF] = null;

    if (move.enPassant) {
        captured = board[fromR][move.f];
        board[fromR][move.f] = null;
    }
    
    if (captured) {
        capturedPieces[actColor].push(captured);
    }

    if (move.castle) {
        if (move.castle === 'k') {
            board[move.r][move.f - 1] = board[move.r][7];
            board[move.r][7] = null;
        } else {
            board[move.r][move.f + 1] = board[move.r][0];
            board[move.r][0] = null;
        }
    }

    if (piece[1] === 'p' && Math.abs(fromR - move.r) === 2) {
        enPassantTarget = { r: (fromR + move.r) / 2, f: fromF };
    } else {
        enPassantTarget = null;
    }

    if (piece[1] === 'k') {
        castlingRights[actColor] = {k: false, q: false};
        kingPos[actColor] = {r: move.r, f: move.f};
    } else if (piece[1] === 'r') {
        if (fromF === 0) castlingRights[actColor].q = false;
        if (fromF === 7) castlingRights[actColor].k = false;
    }
    
    if (targetPiece) {
        const oppColor = actColor === 'w' ? 'b' : 'w';
        if (targetPiece === oppColor + 'r') {
            if (move.r === (oppColor === 'w' ? 7 : 0)) {
                if (move.f === 0) castlingRights[oppColor].q = false;
                if (move.f === 7) castlingRights[oppColor].k = false;
            }
        }
    }

    // Sync 3D meshes internal userData identifiers so updateDraw3D cleans correctly!
    // Since we destroy unused models globally in updateDraw3D, we must re-run it
    for (let pm of pieceMeshes) {
        if (pm.userData.r === fromR && pm.userData.f === fromF) {
            tagPieceMeshData(pm, move.r, move.f, promotedPiece ? promotedPiece : piece);
            if (promotedPiece) {
                // It will be deleted and respawned as a Queen model visually on next update
                pm.userData.r = -1; 
            }
        }
        if (move.castle) {
            if (move.castle === 'k' && pm.userData.r === move.r && pm.userData.f === 7) {
                const newFile = move.f - 1;
                tagPieceMeshData(pm, move.r, newFile, board[move.r][newFile]);
                pm.position.set(newFile * TILE_SIZE - MAP_OFFSET, 0.1, move.r * TILE_SIZE - MAP_OFFSET);
            }
            if (move.castle === 'q' && pm.userData.r === move.r && pm.userData.f === 0) {
                const newFile = move.f + 1;
                tagPieceMeshData(pm, move.r, newFile, board[move.r][newFile]);
                pm.position.set(newFile * TILE_SIZE - MAP_OFFSET, 0.1, move.r * TILE_SIZE - MAP_OFFSET);
            }
        }
    }

    actColor = actColor === 'w' ? 'b' : 'w';
    updateDraw3D();
    updateTurnIndicator();
    checkGameEnd();
    
    if (!isGameOver && gameMode === 'bot' && actColor === 'b') {
        setTimeout(makeBotMove, 250);
    } else if (!isGameOver && gameMode === 'human') {
        updateTimerUI();
    }
}

function showPromotionModal(color) {
    promoOptions.innerHTML = '';
    const options = ['q', 'r', 'b', 'n'];
    options.forEach(type => {
        const p = color + type;
        const div = document.createElement('div');
        div.className = 'promo-piece';
        div.innerHTML = SVGs[p];
        div.onclick = () => {
            promoModal.classList.add('hidden');
            const data = pendingPromotion;
            pendingPromotion = null;
            
            const pm = pieceMeshes.find(m => m.userData.r === data.fromR && m.userData.f === data.fromF);
            if(pm) {
                 animatePiece(pm, data.move.r, data.move.f, () => {
                     finalizeMove(data.piece, data.fromR, data.fromF, data.move, p);
                 });
            } else {
                finalizeMove(data.piece, data.fromR, data.fromF, data.move, p);
            }
        };
        promoOptions.appendChild(div);
    });
    promoModal.classList.remove('hidden');
}

function checkGameEnd() {
    let hasMoves = false;
    for (let r = 0; r < 8; r++) {
        for (let f = 0; f < 8; f++) {
            const piece = board[r][f];
            if (piece && piece[0] === actColor) {
                if (getLegalMoves(piece, r, f).length > 0) {
                    hasMoves = true;
                    break;
                }
            }
        }
        if (hasMoves) break;
    }

    if (!hasMoves) {
        isGameOver = true;
        if (timerInterval) clearInterval(timerInterval);
        gameOverModal.classList.remove('hidden');
        if (isInCheck(actColor, board)) {
            const winner = actColor === 'w' ? "Black" : "White";
            gameOverTitle.innerText = "Checkmate!";
            gameOverMessage.innerText = `${winner} wins the game.`;
        } else {
            gameOverTitle.innerText = "Stalemate";
            gameOverMessage.innerText = "The game is a draw.";
        }
    }
}

function updateTurnIndicator() {
    turnBadge.className = `badge ${actColor === 'w' ? 'white-turn' : 'black-turn'}`;
    turnBadge.innerText = `${actColor === 'w' ? 'White' : 'Black'}'s Turn`;
    
    // Rotate camera to face the player whose turn it is
    const targetAngle = actColor === 'w' ? 0 : Math.PI;
    // Simple basic snap for now:
    // controls.minAzimuthAngle = targetAngle - 0.5;
    // controls.maxAzimuthAngle = targetAngle + 0.5;
}

let environmentMeshes = [];

function createEnvironmentForMode() {
    environmentMeshes.forEach(m => scene.remove(m));
    environmentMeshes = [];

    function addChair(x, z, rotY) {
        const chair = new THREE.Group();
        const chairMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.85 });

        const seat = new THREE.Mesh(new THREE.BoxGeometry(4, 0.5, 4), chairMat);
        seat.position.y = -3;
        chair.add(seat);

        const back = new THREE.Mesh(new THREE.BoxGeometry(4, 5, 0.5), chairMat);
        back.position.set(0, -0.5, -1.75);
        chair.add(back);

        const clGeo = new THREE.CylinderGeometry(0.2, 0.2, 4);
        [[-1.5,-5,-1.5], [1.5,-5,-1.5], [-1.5,-5,1.5], [1.5,-5,1.5]].forEach(lp => {
            const leg = new THREE.Mesh(clGeo, chairMat);
            leg.position.set(...lp);
            chair.add(leg);
        });

        chair.position.set(x, 0, z);
        chair.rotation.y = rotY;
        scene.add(chair);
        environmentMeshes.push(chair);
        return chair;
    }

    function seatHuman(chairGroup, torsoColor, skinColor = 0xffcc99, hairColor = 0x2a1f18) {
        const human = new THREE.Group();
        const clothMat = new THREE.MeshStandardMaterial({ color: torsoColor, roughness: 0.56 });
        const clothDarkMat = new THREE.MeshStandardMaterial({ color: 0x1e2633, roughness: 0.6 });
        const skinMat = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.72 });
        const hairMat = new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.82 });
        const shoeMat = new THREE.MeshStandardMaterial({ color: 0x171717, roughness: 0.58, metalness: 0.1 });
        const eyeMat = new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.35 });

        const pelvis = new THREE.Mesh(new THREE.BoxGeometry(2.35, 1.25, 2.05), clothMat);
        pelvis.position.set(0, -1.25, 0.35);
        pelvis.castShadow = true;
        human.add(pelvis);

        const chest = new THREE.Mesh(new THREE.CylinderGeometry(1.02, 1.14, 2.35, 18), clothMat);
        chest.position.set(0, 1.02, 0);
        chest.castShadow = true;
        human.add(chest);

        const shoulderBar = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.25, 0.5, 18), clothMat);
        shoulderBar.position.set(0, 2.05, 0.02);
        shoulderBar.rotation.z = Math.PI / 2;
        shoulderBar.castShadow = true;
        human.add(shoulderBar);

        const tie = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.0, 0.08), clothDarkMat);
        tie.position.set(0, 1.03, 1.02);
        tie.rotation.x = 0.08;
        tie.castShadow = true;
        human.add(tie);

        const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.28, 0.36, 12), skinMat);
        neck.position.set(0, 2.45, 0.03);
        neck.castShadow = true;
        human.add(neck);

        const head = new THREE.Mesh(new THREE.SphereGeometry(0.9, 22, 22), skinMat);
        head.position.set(0, 3.34, 0.08);
        head.castShadow = true;
        human.add(head);

        const earGeo = new THREE.SphereGeometry(0.14, 10, 10);
        const earL = new THREE.Mesh(earGeo, skinMat);
        earL.position.set(-0.9, 3.36, 0.04);
        const earR = earL.clone();
        earR.position.x = 0.9;
        human.add(earL, earR);

        const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.95, 18, 18, 0, Math.PI * 2, 0, Math.PI * 0.62), hairMat);
        hairCap.position.set(0, 3.55, -0.03);
        hairCap.castShadow = true;
        human.add(hairCap);

        const browGeo = new THREE.BoxGeometry(0.24, 0.05, 0.05);
        const browL = new THREE.Mesh(browGeo, hairMat);
        browL.position.set(-0.23, 3.52, 0.84);
        const browR = browL.clone();
        browR.position.x = 0.23;
        human.add(browL, browR);

        const eyeGeo = new THREE.SphereGeometry(0.05, 8, 8);
        const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
        eyeL.position.set(-0.2, 3.4, 0.9);
        const eyeR = eyeL.clone();
        eyeR.position.x = 0.2;
        human.add(eyeL, eyeR);

        const nose = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.26, 8), skinMat);
        nose.position.set(0, 3.3, 0.97);
        nose.rotation.x = Math.PI / 2;
        human.add(nose);

        const upperArmGeo = new THREE.CylinderGeometry(0.23, 0.25, 1.5, 12);
        const lowerArmGeo = new THREE.CylinderGeometry(0.19, 0.2, 1.35, 12);

        const lUpper = new THREE.Mesh(upperArmGeo, clothMat);
        lUpper.position.set(-1.28, 1.35, 0.14);
        lUpper.rotation.z = 0.46;
        lUpper.castShadow = true;
        human.add(lUpper);

        const rUpper = lUpper.clone();
        rUpper.position.x = 1.28;
        rUpper.rotation.z = -0.46;
        human.add(rUpper);

        const lLower = new THREE.Mesh(lowerArmGeo, skinMat);
        lLower.position.set(-1.7, 0.57, 0.95);
        lLower.rotation.x = Math.PI / 2.05;
        lLower.rotation.z = 0.25;
        lLower.castShadow = true;
        human.add(lLower);

        const rLower = lLower.clone();
        rLower.position.x = 1.7;
        rLower.rotation.z = -0.25;
        human.add(rLower);

        const handGeo = new THREE.SphereGeometry(0.2, 12, 12);
        const lHand = new THREE.Mesh(handGeo, skinMat);
        lHand.position.set(-1.72, 0.1, 1.5);
        lHand.castShadow = true;
        const rHand = lHand.clone();
        rHand.position.x = 1.72;
        human.add(lHand, rHand);

        const thighGeo = new THREE.CylinderGeometry(0.32, 0.35, 1.9, 12);
        const calfGeo = new THREE.CylinderGeometry(0.25, 0.28, 1.95, 12);

        const lThigh = new THREE.Mesh(thighGeo, clothDarkMat);
        lThigh.position.set(-0.55, -2.25, 1.45);
        lThigh.rotation.x = Math.PI / 2.25;
        lThigh.castShadow = true;
        human.add(lThigh);

        const rThigh = lThigh.clone();
        rThigh.position.x = 0.55;
        human.add(rThigh);

        const lCalf = new THREE.Mesh(calfGeo, clothDarkMat);
        lCalf.position.set(-0.55, -3.15, 2.8);
        lCalf.rotation.x = Math.PI / 2;
        lCalf.castShadow = true;
        human.add(lCalf);

        const rCalf = lCalf.clone();
        rCalf.position.x = 0.55;
        human.add(rCalf);

        const lShoe = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.36, 1.5), shoeMat);
        lShoe.position.set(-0.55, -3.55, 3.88);
        lShoe.castShadow = true;
        human.add(lShoe);

        const rShoe = lShoe.clone();
        rShoe.position.x = 0.55;
        human.add(rShoe);

        chairGroup.add(human);
    }

    function seatRobot(chairGroup) {
        const robot = new THREE.Group();
        const metalMat = new THREE.MeshStandardMaterial({ color: 0x9eb6c9, metalness: 0.7, roughness: 0.35 });
        const darkMat = new THREE.MeshStandardMaterial({ color: 0x1f2b3a, metalness: 0.6, roughness: 0.45 });
        const eyeMat = new THREE.MeshStandardMaterial({ color: 0x67f0ff, emissive: 0x2a95a3, emissiveIntensity: 0.7 });

        const torso = new THREE.Mesh(new THREE.BoxGeometry(2.9, 3.6, 2.3), metalMat);
        torso.position.set(0, 0.4, 0);
        torso.castShadow = true;
        robot.add(torso);

        const head = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.5, 1.5), darkMat);
        head.position.set(0, 2.75, 0);
        head.castShadow = true;
        robot.add(head);

        const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 10), eyeMat);
        eyeL.position.set(-0.35, 2.85, 0.78);
        robot.add(eyeL);

        const eyeR = eyeL.clone();
        eyeR.position.x = 0.35;
        robot.add(eyeR);

        const legGeo = new THREE.CylinderGeometry(0.46, 0.4, 3.5, 12);
        const legL = new THREE.Mesh(legGeo, metalMat);
        legL.position.set(-0.7, -3.3, 2.35);
        legL.rotation.x = Math.PI / 2;
        robot.add(legL);

        const legR = legL.clone();
        legR.position.x = 0.7;
        robot.add(legR);

        chairGroup.add(robot);
    }

    const southChair = addChair(0, 24, Math.PI);
    const northChair = addChair(0, -24, 0);

    if (gameMode === 'human') {
        chessTimerUI.classList.remove('hidden');
        startTimer();

        // 3D Timer Mesh
        const clockGroup = new THREE.Group();
        const baseGeo = new THREE.BoxGeometry(4, 2, 2);
        const baseMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
        const base = new THREE.Mesh(baseGeo, baseMat);
        base.position.y = 1;
        clockGroup.add(base);

        const btnGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 16);
        const lBtn = new THREE.Mesh(btnGeo, new THREE.MeshStandardMaterial({ color: 0xcccccc }));
        lBtn.position.set(-1, 2.2, 0);
        clockGroup.add(lBtn);
        const rBtn = new THREE.Mesh(btnGeo, new THREE.MeshStandardMaterial({ color: 0xcccccc }));
        rBtn.position.set(1, 2.2, 0);
        clockGroup.add(rBtn);

        clockGroup.position.set(12, -0.85, 0);
        clockGroup.rotation.y = Math.PI / 2;
        scene.add(clockGroup);
        environmentMeshes.push(clockGroup);

        // Human vs Human: two different seated humans
        seatHuman(southChair, 0xdcdcdc, 0xffd0b0, 0x30261f);
        seatHuman(northChair, 0x2b3c63, 0xe6b38f, 0x111111);
    } else {
        chessTimerUI.classList.add('hidden');
        if (timerInterval) clearInterval(timerInterval);

        // Human vs Bot: one seated human and one seated robot
        seatHuman(southChair, 0xdcdcdc, 0xffd0b0, 0x30261f);
        seatRobot(northChair);
    }
}

function restartGame() {
    // Clear 3D meshes
    pieceMeshes.forEach(pm => scene.remove(pm));
    pieceMeshes = [];
    
    initBoardState();
    actColor = 'w';
    selectedSquare = null;
    validMoveFlags = [];
    enPassantTarget = null;
    castlingRights = { w: {k: true, q: true}, b: {k: true, q: true} };
    kingPos = { w: {r:7, f:4}, b: {r:0, f:4} };
    isGameOver = false;
    capturedPieces = { w: [], b: [] };
    pendingPromotion = null;
    
    gameOverModal.classList.add('hidden');
    updateDraw3D();
    updateTurnIndicator();

    whiteTimeLeft = 600;
    blackTimeLeft = 600;
    updateTimerUI();
    createEnvironmentForMode();
}

restartBtn.addEventListener('click', restartGame);


// AI Minimax Bot
const pieceValues = { 'p': 10, 'n': 30, 'b': 30, 'r': 50, 'q': 90, 'k': 900 };

function evaluateBoard(testBoard) {
    let score = 0;
    for (let r = 0; r < 8; r++) {
        for (let f = 0; f < 8; f++) {
            const piece = testBoard[r][f];
            if (piece) {
                const value = pieceValues[piece[1]];
                if (piece[0] === 'b') score += value; else score -= value;
            }
        }
    }
    return score;
}

function minimax(depth, isMaximizing, testBoard, alpha, beta) {
    if (depth === 0) return evaluateBoard(testBoard);

    let allMoves = [];
    let color = isMaximizing ? 'b' : 'w';
    
    for (let r = 0; r < 8; r++) {
        for (let f = 0; f < 8; f++) {
            const piece = testBoard[r][f];
            if (piece && piece[0] === color) {
                const moves = getLegalMoves(piece, r, f, testBoard);
                moves.forEach(m => allMoves.push({ piece, fromR: r, fromF: f, move: m }));
            }
        }
    }

    if (allMoves.length === 0) {
        if (isInCheck(color, testBoard)) return isMaximizing ? -9999 : 9999;
        return 0; // stalemate
    }

    if (isMaximizing) {
        let maxEval = -Infinity;
        for (let mObj of allMoves) {
            let nextBoard = executeVirtualMove(testBoard, mObj);
            let ev = minimax(depth - 1, false, nextBoard, alpha, beta);
            maxEval = Math.max(maxEval, ev);
            alpha = Math.max(alpha, ev);
            if (beta <= alpha) break;
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (let mObj of allMoves) {
            let nextBoard = executeVirtualMove(testBoard, mObj);
            let ev = minimax(depth - 1, true, nextBoard, alpha, beta);
            minEval = Math.min(minEval, ev);
            beta = Math.min(beta, ev);
            if (beta <= alpha) break;
        }
        return minEval;
    }
}

function executeVirtualMove(boardState, mObj) {
    let nextBoard = boardState.map(row => [...row]);
    nextBoard[mObj.move.r][mObj.move.f] = mObj.piece;
    nextBoard[mObj.fromR][mObj.fromF] = null;
    if (mObj.move.enPassant) nextBoard[mObj.fromR][mObj.move.f] = null;
    if (mObj.piece[1] === 'p' && (mObj.move.r === 7 || mObj.move.r === 0)) {
        nextBoard[mObj.move.r][mObj.move.f] = mObj.piece[0] + 'q';
    }
    if (mObj.move.castle === 'k') {
        nextBoard[mObj.move.r][mObj.move.f - 1] = nextBoard[mObj.move.r][7];
        nextBoard[mObj.move.r][7] = null;
    }
    if (mObj.move.castle === 'q') {
        nextBoard[mObj.move.r][mObj.move.f + 1] = nextBoard[mObj.move.r][0];
        nextBoard[mObj.move.r][0] = null;
    }
    return nextBoard;
}

function makeBotMove() {
    if (isGameOver) return;

    let allMoves = [];
    for (let r = 0; r < 8; r++) {
        for (let f = 0; f < 8; f++) {
            const piece = board[r][f];
            if (piece && piece[0] === 'b') {
                const moves = getLegalMoves(piece, r, f, board);
                moves.forEach(m => allMoves.push({ piece, fromR: r, fromF: f, move: m }));
            }
        }
    }

    if (allMoves.length === 0) return;

    let bestScore = -Infinity;
    let bestMoves = [];

    let evaluateDepth = botDepth;
    let isRandomSubot = botDifficulty === 'novice' && Math.random() < 0.6; // High randomness for novice
    
    if (isRandomSubot) {
        const chosen = allMoves[Math.floor(Math.random() * allMoves.length)];
        executeMove(chosen.piece, chosen.fromR, chosen.fromF, chosen.move);
        return;
    }
    
    if(botDifficulty === 'intermediate' && Math.random() < 0.3) {
       evaluateDepth = 1;
    }

    let piecesCount = 0;
    board.forEach(row => row.forEach(col => { if(col) piecesCount++; }));
    if (botDepth >= 4 && piecesCount > 24) evaluateDepth = Math.max(1, botDepth - 1); // Keep memory from hanging

    for (let mObj of allMoves) {
        let nextBoard = executeVirtualMove(board, mObj);
        let score = minimax(evaluateDepth - 1, false, nextBoard, -Infinity, Infinity);
        
        let noise = 0;
        if (botDifficulty === 'novice') noise = (Math.random() * 40 - 20);
        else if (botDifficulty === 'intermediate') noise = (Math.random() * 20 - 10);
        else if (botDifficulty === 'advanced') noise = (Math.random() * 6 - 3);
        else if (botDifficulty === 'professional') noise = (Math.random() * 2 - 1);
        else if (botDifficulty === 'grandmaster') noise = (Math.random() * 0.1 - 0.05);

        score += noise;

        if (score > bestScore) {
            bestScore = score;
            bestMoves = [mObj];
        } else if (score === bestScore) {
            bestMoves.push(mObj);
        }
    }

    const chosen = bestMoves[Math.floor(Math.random() * bestMoves.length)];
    executeMove(chosen.piece, chosen.fromR, chosen.fromF, chosen.move);
}

// Global Animation Loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Initialization
initBoardState();
init3D();
updateDraw3D();
