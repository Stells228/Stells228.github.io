const cells = document.querySelectorAll('[data-cell]'); /*читаю все эл-ты данного класса*/

let patPat = true; //слежу за текущим фото 
let gameOver = false; //условие конца игры

let rounds = 0;
const maxRounds = 5;

// Обработчик клика по ячейке

//перебираю каждый эл-нт в массиве
cells.forEach(cell => {
    cell.addEventListener('click', () => { //при тыканьи будет происходить магия
        // Проверяю, что ячейка пуста
        if (!cell.style.backgroundImage && !gameOver) {
            const urlPicture = patPat ? `/media/1.png` : `/media/2.png`; //условие о том, какая картинка первее 

            cell.style.backgroundImage = `url(${urlPicture})`; //вставляю значение переменной
            cell.style.backgroundSize = `cover`;
            cell.style.backgroundPosition = `center`;

            patPat = !patPat; //смена фото для следующего клика 
            wonCheck(); //обробатывем возможный выигрыш
        }
    });
});

//я решила использовать в данном случае фоновою установку картинки, чтобы
//она не перекликала с дальнейшими действиями в игре(та же анимация выигрыша линией)

//победа будет при:
const Winner = [
    [0, 1, 2], //горизонтальные
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], //вертикальные
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], //диагональные
    [2, 4, 6]
];

const messageElement = document.getElementById('message'); // Получаем элемент для вывода сообщения

//проверка на наличие ничьей в целом 
function checkDraw() {
    let isDraw = true;
    cells.forEach(cell => {
        if (!cell.style.backgroundImage) {
            isDraw = false;
        }
    });
    return isDraw;
}

//проверка условий ничьей
function checkEndGame() {
    if (checkDraw()) {
        messageElement.textContent = 'Ничья!';
        gameOver = true;
    }
}
//проверка победителя
function wonCheck() {
    for (let set of Winner) {
        const [x, y, z] = set; //получаю индексы ячеек для проверки
        if (cells[x].style.backgroundImage && cells[x].style.backgroundImage === cells[y].style.backgroundImage && cells[y].style.backgroundImage === cells[z].style.backgroundImage && cells[z].style.backgroundImage) {
            const winners = cells[x].style.backgroundImage.includes('1') ? 'Мурк`аты' : 'Костом`али';
            displayWinner(winners); //передача для объявления победителя
            gameOver = true;
            rounds++;
            if (rounds >= maxRounds) {
                gameOver = true;
                messageElement.textContent = 'Игра завершена'; 
                restBtn.disabled = true //disbled - блокирование объекта
            }
            return;
        }
    }
    //проверка на ничью
    checkEndGame(); 
}

//создаём игроков
let player1Score = 0;
let player2Score = 0;

//условие счётчика
function newScore(player) {
    if (player == 'Мурк`аты') {
        player1Score++;
    }
    else if (player == 'Костом`али') {
        player2Score++;
    }
    displayScore();
}

//счётчик
function displayScore() {
    const player1ScoreEl = document.getElementById('player1-Score');
    const player2ScoreEl = document.getElementById('player2-Score');

    player1ScoreEl.textContent = `мурк\`аты : ${player1Score}`;
    player2ScoreEl.textContent = `Костом\`али : ${player2Score}`;

}

function displayWinner(player) {
    messageElement.textContent = `${player} победили!`;
    newScore(player);
}


//[создание кнопки нового раунда]
const restBtn = document.getElementById('restBtn');

//объявление событие клика
restBtn.addEventListener('click', () => {
    restGame()
});

function restGame() {
    cells.forEach(cell => { //для каждого cell будут делаться:
        cell.style.backgroundImage = ''; //очистка поля
    });
    gameOver = false; //сбрасываю состояние игры
    patPat = true; //возвращаю нач значение
    messageElement.textContent = ''; //удаляю сообщение о выигрыше/ничьей
}

//[создание кнопки сброса игры]
const newGameBtn = document.getElementById('resetGameBtn');

newGameBtn.addEventListener('click', () => {
    resetGame();
});

function resetGame() {
    patPat = true;
    gameOver = false;
    rounds = 0;
    player1Score = 0;
    player2Score = 0;

    // Очистка ячеек игрового поля
    cells.forEach(cell => {
        cell.style.backgroundImage = '';
    });

    // Сброс сообщения о выигрыше/ничьей
    messageElement.textContent = '';

    // Сброс счета игроков
    displayScore();

    const restBtn = document.getElementById('restBtn');
    restBtn.disabled = false; //освобождение кнопки "следующий раунд" от блока
}
