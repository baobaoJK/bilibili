// 获取所有卡片
const cards = document.querySelectorAll(".card");

// 卡片数量
let cardCount = 16;

// 是否有已翻转的卡片
let hasFlippedCard = false;

// 状态
let lockBoard = false;

// 第一张卡片，第二张卡片
let firstCard, secondCard;

// 状态锁定时间
const lockTime = 1000;

// 翻转卡片次数
let flipCardCount;

// 翻转卡片标签
const countLable = document.querySelector("#count");

// 游戏时间
let time;

// 游戏时间计时器
let timeInterval;

// 游戏时间标签
const timeLabel = document.querySelector("#time");

// 开始游戏按钮
const startButton = document.querySelector("#start");

// 重置游戏按钮
const resetButton = document.querySelector("#reset");

// 未翻转卡片数
let unflipCardCount;

// 反转卡片函数
function flipCard() {
    // 判断翻转锁定
    if (lockBoard) return;

    // 判断卡片是否为第一张
    if (this === firstCard) return;

    // 添加次数
    flipCardCount++;

    // 更改标签
    countLable.innerText = flipCardCount;

    // 添加反转样式
    this.classList.add("flip");

    // 判断是否有翻转转过的卡片
    if (!hasFlippedCard) {
        // 设置已有翻转过的卡片
        hasFlippedCard = true;
        // 设置这张卡片为第一张
        firstCard = this;
        return;
    }

    // 设置这张卡片为第二张
    secondCard = this;
    checkForMatch();
}

// 检查两个卡片名称是否相同
function checkForMatch() {
    // 判断名称 data-name
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;

    // 如果名称一致 去除卡片监听，不一致 翻转两张卡片
    isMatch ? disableCards() : unflipCards();
}

// 移除卡片监听事件
function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    // 改变翻转数量
    unflipCardCount -= 2;

    // 重置状态
    resetBoard();
}

// 翻转两张卡片
function unflipCards() {
    // 锁定状态
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove("flip");
        secondCard.classList.remove("flip");

        resetBoard();
    }, lockTime);
}

// 重置状态
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];

    // 判断卡片是否已经翻转完毕
    if (unflipCardCount === 0) {
        setTimeout(() => {
            alert("游戏结束！");
            resetButton.removeAttribute("disabled");
            clearInterval(timeInterval);
        }, 500);
    }
}

// 随机生成卡片位置
function shuffle() {

    // 生成位置
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * cardCount);
        // order 顺序
        card.style.order = randomPos;
    });

    // 添加监听事件
    cards.forEach(card => card.addEventListener("click", flipCard));
}

// 游戏事件
function game() {
    cards.forEach(card => card.classList.remove("flip"));
    unflipCardCount = cardCount;
    timeLabel.innerText = "00:00";
    time = 0;
    gameTime();
    flipCardCount = 0;
    countLable.innerText = flipCardCount;
    setTimeout(() => {
        shuffle();
    }, 500);
}

// 游戏时间
function gameTime() {
    timeInterval = setInterval(() => {
        time++;

        let m = parseInt(time / 60 % 60);
        m =  m < 10 ? '0' + m : m;
        let s = parseInt(time % 60);
        s = s < 10 ? '0' + s : s;
        timeLabel.innerText = m + ":" + s;
    }, 1000);
}

// 重置游戏事件
function resetGame() {
    if (!lockBoard) {
        game();
        this.setAttribute("disabled", "disabled");
    }
}

// 重置游戏按钮添加事件
resetButton.addEventListener("click", resetGame);

// 开始游戏事件
function startGame() {
    game();
    this.setAttribute("disabled", "disabled");
}

// 开始游戏
startButton.addEventListener("click", startGame);