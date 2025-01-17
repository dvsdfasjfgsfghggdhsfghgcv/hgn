const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');

const ROWS = 20; // 行数
const COLS = 10; // 列数
const BLOCK_SIZE = 30; // 每个方块的大小

// 定义方块的形状
const TETROMINOS = [
    [
        [1, 1, 1, 1]
    ], // I
    [
        [1, 1],
        [1, 1]
    ], // O
    [
        [0, 1, 0],
        [1, 1, 1]
    ], // T
    [
        [1, 1, 0],
        [0, 1, 1]
    ], // S
    [
        [0, 1, 1],
        [1, 1, 0]
    ], // Z
    [
        [1, 0, 0],
        [1, 1, 1]
    ], // L
    [
        [0, 0, 1],
        [1, 1, 1]
    ], // J
];

// 游戏状态
let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
let currentTetromino;
let currentPosition;

// 随机生成方块
function randomTetromino() {
    const index = Math.floor(Math.random() * TETROMINOS.length);
    return {
        shape: TETROMINOS[index],
        color: `hsl(${Math.random() * 360}, 100%, 50%)`
    };
}

// 绘制方块
function drawBlock(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeStyle = '#000';
    ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

// 绘制棋盘
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c]) {
                drawBlock(c, r, board[r][c]);
            }
        }
    }
}

// 检查碰撞
function collision(offsetX, offsetY) {
    for (let r = 0; r < currentTetromino.shape.length; r++) {
        for (let c = 0; c < currentTetromino.shape[r].length; c++) {
            if (currentTetromino.shape[r][c]) {
                const newX = currentPosition.x + c + offsetX;
                const newY = currentPosition.y + r + offsetY;
                if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && board[newY][newX])) {
                    return true;
                }
            }
        }
    }
    return false;
}

// 固定方块
function merge() {
    for (let r = 0; r < currentTetromino.shape.length; r++) {
        for (let c = 0; c < currentTetromino.shape[r].length; c++) {
            if (currentTetromino.shape[r][c]) {
                board[currentPosition.y + r][currentPosition.x + c] = currentTetromino.color;
            }
        }
    }
}

// 清除满行
function clearRows() {
    for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r].every(cell => cell)) {
            board.splice(r, 1);
            board.unshift(Array(COLS).fill(0));
        }
    }
}

// 更新游戏状态
function update() {
    if (!collision(0, 1)) {
        currentPosition.y++;
    } else {
        merge();
        clearRows();
        currentTetromino = randomTetromino();
        currentPosition = { x: Math.floor(COLS / 2) - 1, y: 0 };
        if (collision(0, 0)) {
            alert('游戏结束！');
            board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
        }
    }
}

// 绘制当前方块
function drawCurrentTetromino() {
    for (let r = 0; r < currentTetromino.shape.length; r++) {
        for (let c = 0; c < currentTetromino.shape[r].length; c++) {
            if (currentTetromino.shape[r][c]) {
                drawBlock(currentPosition.x + c, currentPosition.y + r, currentTetromino.color);
            }
        }
    }
}

// 处理键盘输入
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        if (!collision(-1, 0)) {
            currentPosition.x--;
        }
    } else if (event.key === 'ArrowRight') {
        if (!collision(1, 0)) {
            currentPosition.x++;
        }
    } else if (event.key === 'ArrowDown') {
        if (!collision(0, 1)) {
            currentPosition.y++;
        }
    }
});

// 游戏循环
function gameLoop() {
    drawBoard();
    drawCurrentTetromino();
    update();
    setTimeout(gameLoop, 500); // 每 500 毫秒更新一次
}

// 初始化游戏
currentTetromino = randomTetromino();
currentPosition = { x: Math.floor(COLS / 2) - 1, y: 0 };
gameLoop();