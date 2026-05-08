const fs = require('fs');
let text = fs.readFileSync('script.js', 'utf-8');

const edit1 = `// DOM Elements for UI
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
let botDepth = 1; // Used for minimax depth search!

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
            case 'grandmaster': botDepth = 4; break; // Depth 4 is maximum manageable synchronously in JS without freezing hard
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
    return \`\${m}:\${s.toString().padStart(2, '0')}\`;
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
    gameOverMessage.innerText = \`\${winner} wins on time.\`;
}`;
const target1 = `// DOM Elements for UI
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

let gameMode = 'bot';

modeBotBtn.addEventListener('click', () => { gameMode = 'bot'; modeModal.classList.add('hidden'); restartGame(); });
modeHumanBtn.addEventListener('click', () => { gameMode = 'human'; modeModal.classList.add('hidden'); restartGame(); });`;

text = text.replace(target1, edit1);

const target2 = `    controls.maxPolarAngle = Math.PI / 2.2;
    controls.minDistance = 10;
    controls.maxDistance = 40;`;
const edit2 = `    controls.maxPolarAngle = Math.PI / 2.2;
    controls.minDistance = 10;
    controls.maxDistance = 60; // Increased to see people`;
text = text.replace(target2, edit2);

const target3 = `    // Wooden Table
    const tableGeo = new THREE.BoxGeometry(35, 1, 35);
    const tableMat = new THREE.MeshStandardMaterial({ color: 0x4a3018, roughness: 0.9, metalness: 0.1 });
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.y = -1.35;
    table.receiveShadow = true;
    scene.add(table);

    // Tiles`;
const edit3 = `    // Wooden Table
    const tableGeo = new THREE.BoxGeometry(35, 1, 35);
    const tableMat = new THREE.MeshStandardMaterial({ color: 0x4a3018, roughness: 0.9, metalness: 0.1 });
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.y = -1.35;
    table.receiveShadow = true;
    scene.add(table);

    // Table Legs
    const legGeo = new THREE.CylinderGeometry(0.8, 0.6, 15, 16);
    const legPositions = [
        [-16, -8.85, -16],
        [16, -8.85, -16],
        [-16, -8.85, 16],
        [16, -8.85, 16]
    ];
    legPositions.forEach(pos => {
        const leg = new THREE.Mesh(legGeo, tableMat);
        leg.position.set(...pos);
        leg.castShadow = true;
        leg.receiveShadow = true;
        scene.add(leg);
    });

    // Tiles`;
text = text.replace(target3, edit3);

const target4 = `    actColor = actColor === 'w' ? 'b' : 'w';
    updateDraw3D();
    updateTurnIndicator();
    checkGameEnd();
    
    if (!isGameOver && gameMode === 'bot' && actColor === 'b') {
        setTimeout(makeBotMove, 250);
    }
}`;
const edit4 = `    actColor = actColor === 'w' ? 'b' : 'w';
    updateDraw3D();
    updateTurnIndicator();
    checkGameEnd();
    
    if (!isGameOver && gameMode === 'bot' && actColor === 'b') {
        setTimeout(makeBotMove, 250);
    } else if (!isGameOver && gameMode === 'human') {
        updateTimerUI();
    }
}`;
text = text.replace(target4, edit4);

const target5 = `    if (!hasMoves) {
        isGameOver = true;
        gameOverModal.classList.remove('hidden');
        if (isInCheck(actColor, board)) {`;
const edit5 = `    if (!hasMoves) {
        isGameOver = true;
        if (timerInterval) clearInterval(timerInterval);
        gameOverModal.classList.remove('hidden');
        if (isInCheck(actColor, board)) {`;
text = text.replace(target5, edit5);

const target6 = `function restartGame() {
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
}`;
const edit6 = `let environmentMeshes = [];

function createEnvironmentForMode() {
    environmentMeshes.forEach(m => scene.remove(m));
    environmentMeshes = [];

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

        clockGroup.position.set(12, -0.85, 0); // On side of table
        clockGroup.rotation.y = Math.PI / 2;
        scene.add(clockGroup);
        environmentMeshes.push(clockGroup);

        // Humans
        function createHuman(x, z, rotY, colorMat) {
            const hGroup = new THREE.Group();
            const chairMat = new THREE.MeshStandardMaterial({ color: 0x5c4033 });
            const seat = new THREE.Mesh(new THREE.BoxGeometry(4, 0.5, 4), chairMat);
            seat.position.y = -3;
            hGroup.add(seat);
            const back = new THREE.Mesh(new THREE.BoxGeometry(4, 5, 0.5), chairMat);
            back.position.set(0, -0.5, -1.75);
            hGroup.add(back);
            
            const clGeo = new THREE.CylinderGeometry(0.2, 0.2, 4);
            [[-1.5,-5,-1.5], [1.5,-5,-1.5], [-1.5,-5,1.5], [1.5,-5,1.5]].forEach(lp => {
                const leg = new THREE.Mesh(clGeo, chairMat);
                leg.position.set(...lp);
                hGroup.add(leg);
            });

            const torso = new THREE.Mesh(new THREE.BoxGeometry(3, 4, 3), colorMat);
            torso.position.set(0, 0, 0);
            torso.castShadow = true;
            hGroup.add(torso);
            const head = new THREE.Mesh(new THREE.SphereGeometry(1.2, 16, 16), new THREE.MeshStandardMaterial({color: 0xffcc99}));
            head.position.set(0, 3, 0);
            head.castShadow = true;
            hGroup.add(head);
            const legLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.5, 4), colorMat);
            legLeft.position.set(-0.8, -4, 1);
            legLeft.rotation.x = Math.PI/2;
            legLeft.position.z = 2.5;
            hGroup.add(legLeft);
            const legRight = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.5, 4), colorMat);
            legRight.position.set(0.8, -4, 1);
            legRight.rotation.x = Math.PI/2;
            legRight.position.z = 2.5;
            hGroup.add(legRight);

            hGroup.position.set(x, 0, z);
            hGroup.rotation.y = rotY;
            scene.add(hGroup);
            environmentMeshes.push(hGroup);
        }

        const whiteHumanMat = new THREE.MeshStandardMaterial({ color: 0xdddddd });
        const blackHumanMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
        createHuman(0, 24, Math.PI, whiteHumanMat);
        createHuman(0, -24, 0, blackHumanMat);
    } else {
        chessTimerUI.classList.add('hidden');
        if (timerInterval) clearInterval(timerInterval);
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
}`;

text = text.replace(target6, edit6);

// Cut off the old Bot logic securely and append the new logic
const botTargetStart = text.indexOf('// AI Minimax Bot (Retained Logic)');
if (botTargetStart !== -1) {
    text = text.slice(0, botTargetStart);
}

const botRewrite = \`// AI Minimax Bot
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
\`;

text += botRewrite;

fs.writeFileSync('script.js', text);
console.log('Successfully edited script.js');
