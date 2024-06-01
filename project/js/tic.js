document.addEventListener("DOMContentLoaded", function () {

  const cells = document.querySelectorAll("[data-cell]"); //читаю все эл-ты данного класса

  let patPat = true; //слежу за текущим фото
  let gameOver = false; //условие конца игры

  let rounds = 0;
  const maxRounds = 5;

  // Обработчик клика по ячейке
  //перебираю каждый эл-нт в массиве
  cells.forEach((cell) => {
    cell.addEventListener("click", () => {//при тыканьи будет происходить магия
      // Проверяю, что ячейка пуста
      if (!cell.style.backgroundImage && !gameOver) {
        const urlPicture = patPat ? `media/1.png` : `media/2.png`; //условие о том, какая картинка первее

        cell.style.backgroundImage = `url(${urlPicture})`; //вставляю значение переменной
        cell.style.backgroundSize = `cover`;
        cell.style.backgroundPosition = `center`;

        patPat = !patPat; //смена фото для следующего клика
        wonCheck(); //обробатывем возможный выигрыш
        if (!gameOver && !patPat) {
          if (gameMode === "bot") { //если выбран режим игры с ботом
            botMove; // Делаем ход бота после хода игрока
        }
      }
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
    [2, 4, 6],
  ];

  const messageElement = document.getElementById("message"); // Получаем элемент для вывода сообщения

  //проверка на наличие ничьей в целом
  function checkDraw() {
    let isDraw = true;
    cells.forEach((cell) => {
      if (!cell.style.backgroundImage) {
        isDraw = false;
      }
    });
    return isDraw;
  }

  //создаём игроков
  let player1Score = 0;
  let player2Score = 0;

  //проверка условий ничьей
  function checkEndGame() {
    if (checkDraw()) {
      messageElement.textContent = "Ничья!";
      gameOver = true;
    }
  }

  //проверка победителя
  function wonCheck() {
    for (let set of Winner) {
      const [x, y, z] = set; //получаю индексы ячеек для проверки
      if (
        cells[x].style.backgroundImage &&
        cells[x].style.backgroundImage === cells[y].style.backgroundImage &&
        cells[y].style.backgroundImage === cells[z].style.backgroundImage &&
        cells[z].style.backgroundImage
      ) {
        const winners = cells[x].style.backgroundImage.includes("1") ? "Мурк`аты" : "Костом`али";
        displayWinner(winners); //передача для объявления победителя
        gameOver = true;
        rounds++;
        if (player1Score == maxRounds || player2Score == maxRounds) {
          gameOver = true;
          messageElement.textContent = "Игра завершена";
          restBtn.disabled = true; //disbled - блокирование объекта
        }
        return;
      }
    }
    //проверка на ничью
    checkEndGame();
    if (!gameOver && !patPat && gameMode === "bot") { 
      botMove(); // Делаем ход бота, если не завершилась игра и сейчас ход бота
    }
  }

// Логика для хода другого игрока
function playerMove(cell) {
  if (!cell.style.backgroundImage && !gameOver) {
    const urlPicture = patPat ? `media/1.png` : `media/2.png`;

    cell.style.backgroundImage = `url(${urlPicture})`;
    cell.style.backgroundSize = `cover`;
    cell.style.backgroundPosition = `center`;

    patPat = !patPat;
    wonCheck();
  }
}

  // Добавление функционала выбора режима игры (с ботом или с другом)
  const gameModeSelect = document.getElementById("gameModeSelect");

  gameModeSelect.addEventListener("change", () => {
     const selectedMode = gameModeSelect.value;
     console.log(`Режим игры: ${selectedMode}`);
  });

  let gameMode = "bot"; // По умолчанию игра с ботом

  gameModeSelect.addEventListener("change", () => {
    gameMode = gameModeSelect.value;
    resetGame();
  });

// Обновление логики хода бота в зависимости от режима игры
function botMove() {
  if (gameMode === "bot") {
    // Логика хода бота для режима игры с ботом + [Создание бота]
    if (checkBotWin()) { // Если бот может выиграть на следующем ходу, делаю соответствующий ход
      setTimeout(makeBotWinningMove, 500); //время задержки хода [бота]
    } 
    else if (checkPlayerWin()) { // Если игрок может выиграть на следующем ходу, блокирую его победу  
      setTimeout(blockPlayerWinningMove, 500);
    } 
    else { //Нет возможности выиграть или блокировать победу игрока? Беру случайную ячейку
      setTimeout(makeRandomMove, 500);
    }
  } 
  else { // Логика для хода другого игрока
    cells.forEach((cell) => {
      cell.addEventListener("click", () => {
        playerMove(cell);
      });
    });
  }
}

  //расписывание внутрянки функций и условий [бота]

  //функция на проверку победы игрока
  function checkPlayerWin() {
    for (let set of Winner) {
      const [x, y, z] = set;
      if (
        !cells[x].style.backgroundImage &&
        cells[y].style.backgroundImage === 'url("media/1.png")' &&
        cells[y].style.backgroundImage === cells[z].style.backgroundImage
      ) {
        return true;
      }
      if (
        !cells[y].style.backgroundImage &&
        cells[x].style.backgroundImage === 'url("media/1.png")' &&
        cells[x].style.backgroundImage === cells[z].style.backgroundImage
      ) {
        return true;
      }
      if (
        !cells[z].style.backgroundImage &&
        cells[x].style.backgroundImage === 'url("media/1.png")' &&
        cells[x].style.backgroundImage === cells[y].style.backgroundImage
      ) {
        return true;
      }
    }
    return false; // Игрок не имеет возможности победить на следующем ходу
  }

  //функция на проверку победы бота
  function checkBotWin() {
    for (let set of Winner) {
      const [x, y, z] = set;
      if (
        !cells[x].style.backgroundImage &&
        cells[y].style.backgroundImage === 'url("media/2.png")' &&
        cells[y].style.backgroundImage === cells[z].style.backgroundImage
      ) {
        return true;
      }
      if (
        !cells[y].style.backgroundImage &&
        cells[x].style.backgroundImage === 'url("media/2.png")' &&
        cells[x].style.backgroundImage === cells[z].style.backgroundImage
      ) {
        return true;
      }
      if (
        !cells[z].style.backgroundImage &&
        cells[x].style.backgroundImage === 'url("media/2.png")' &&
        cells[x].style.backgroundImage === cells[y].style.backgroundImage
      ) {
        return true;
      }
    }
    return false; // Бот не имеет возможности победить на следующем ходу
  }

  //убийство игрока (при возможности [бота] выигрыша сейчас)
  function makeBotWinningMove() {
    // Реализация логики хода бота, который позволит ему выиграть на следующем ходу
    for (let set of Winner) {
      const [x, y, z] = set;
      if (
        !cells[x].style.backgroundImage &&
        cells[y].style.backgroundImage === cells[z].style.backgroundImage &&
        cells[y].style.backgroundImage === 'url("media/2.png")'
      ) {
        cells[x].click();
        return;
      }
      if (
        !cells[y].style.backgroundImage &&
        cells[x].style.backgroundImage === cells[z].style.backgroundImage &&
        cells[x].style.backgroundImage === 'url("media/2.png")'
      ) {
        cells[y].click();
        return;
      }
      if (
        !cells[z].style.backgroundImage &&
        cells[x].style.backgroundImage === cells[y].style.backgroundImage &&
        cells[x].style.backgroundImage === 'url("media/2.png")'
      ) {
        cells[z].click();
        return;
      }
    }
  }

  //блок игрока (при возможности [игрока] выигрыша сейчас)
  function blockPlayerWinningMove() {
    // Реализация логики для блокировки на следующем ходу
    for (let set of Winner) {
      const [x, y, z] = set;

      // Блокировка победы по горизонтали
      if (
        cells[x].style.backgroundImage &&
        cells[x].style.backgroundImage === cells[y].style.backgroundImage &&
        !cells[z].style.backgroundImage
      ) {
        cells[z].click(); // Блокирую победу игрока
        return;
      } 
      else if (
        cells[x].style.backgroundImage &&
        cells[x].style.backgroundImage === cells[z].style.backgroundImage &&
        !cells[y].style.backgroundImage
      ) {
        cells[y].click(); // Блокирую победу игрока
        return;
      } 
      else if (
        cells[y].style.backgroundImage &&
        cells[y].style.backgroundImage === cells[z].style.backgroundImage &&
        !cells[x].style.backgroundImage
      ) {
        cells[x].click(); // Блокирую победу игрока
        return;
      }

      // Блокировка победы игрока по вертикали
      else if (
        !cells[x].style.backgroundImage &&
        cells[y].style.backgroundImage === cells[z].style.backgroundImage &&
        cells[y].style.backgroundImage.includes("1")
      ) {
        cells[x].click(); // Блокирую победу игрока
        return;
      } 
      else if (
        cells[x].style.backgroundImage === cells[z].style.backgroundImage &&
        cells[x].style.backgroundImage.includes("1") &&
        !cells[y].style.backgroundImage
      ) {
        cells[y].click(); // Блокирую победу игрока
        return;
      } 
      else if (
        cells[x].style.backgroundImage === cells[y].style.backgroundImage &&
        cells[x].style.backgroundImage.includes("1") &&
        !cells[z].style.backgroundImage
      ) {
        cells[z].click(); // Блокирую победу игрока
        return;
      }

      // Блокировка победы игрока по диагонали
      else if (
        !cells[x].style.backgroundImage &&
        cells[y].style.backgroundImage === cells[z].style.backgroundImage &&
        cells[y].style.backgroundImage.includes("1")) {
        cells[x].click(); // Блокирую победу игрока
        return;
      } 
      else if (
        cells[x].style.backgroundImage === cells[z].style.backgroundImage &&
        cells[x].style.backgroundImage.includes("1") &&
        !cells[y].style.backgroundImage
      ) {
        cells[y].click(); // Блокирую победу игрока
        return;
      } 
      else if (
        cells[x].style.backgroundImage === cells[y].style.backgroundImage &&
        cells[x].style.backgroundImage.includes("1") &&
        !cells[z].style.backgroundImage
      ) {
        cells[z].click(); // Блокирую победу игрока
        return;
      }
    }
  }

  //случайный ход бота
  function makeRandomMove() {
    let randomCell; //хранение рандом пустой клетки
    let emptyCellCnt = 0; //кол-во пустых клеток

    // Нахожу случайную пустую ячейку
    for (let i = 0; i < cells.length; i++) {
      if (!cells[i].style.backgroundImage) {
        emptyCellCnt++;
        if (Math.floor(Math.random() * emptyCellCnt) === 0) {
          randomCell = i; //индекс рандомной пустой клетки
        }
      }
    }
    // Выполняю ход
    cells[randomCell].click();
  }

  //условие счётчика
  function newScore(player) {
    if (player == "Мурк`аты") {
      player1Score++;
    } 
    else if (player == "Костом`али") {
      player2Score++;
    }
    displayScore();
    saveScoreToLocalStorage();
  }

  // Функция для сохранения счета в localStorage
  function saveScoreToLocalStorage() {
    localStorage.setItem("player1Score", player1Score);
    localStorage.setItem("player2Score", player2Score);
  }

  //счётчик
  function displayScore() {
    const player1ScoreEl = document.getElementById("player1-Score");
    const player2ScoreEl = document.getElementById("player2-Score");

    player1ScoreEl.textContent = `Мурк\`аты : ${player1Score}`;
    player2ScoreEl.textContent = `Костом\`али : ${player2Score}`;
  }

  //после загрузки страницы, проверяю наличие данных в localStorage
  window.onload = () => {
    if (localStorage.getItem("player1Score") && localStorage.getItem("player2Score")) {
      player1Score = parseInt(localStorage.getItem("player1Score")); //преобразую строку в число
      player2Score = parseInt(localStorage.getItem("player2Score"));
      displayScore();
    }

    //Заметка: Локальное хранилище хранит только строки, поэтому для работы с данными
    //нам надо вернуть числа
  };

  function displayWinner(player) {
    messageElement.textContent = `${player} победили!`;
    newScore(player);
  }

  //[создание кнопки нового раунда]
  const restBtn = document.getElementById("restBtn");

  //объявление событие клика
  restBtn.addEventListener("click", () => {
    restGame();
  });

  function restGame() {
    cells.forEach((cell) => {
      //для каждого cell будут делаться:
      cell.style.backgroundImage = ""; //очистка поля
    });
    gameOver = false; //сбрасываю состояние игры
    patPat = true; //возвращаю нач значение
  }

  //[создание кнопки сброса игры]
  const newGameBtn = document.getElementById("resetGameBtn");

  newGameBtn.addEventListener("click", () => {
    resetGame();
  });

  function resetGame() {
    patPat = true;
    gameOver = false;
    rounds = 0;
    player1Score = 0;
    player2Score = 0;

    // Очистка ячеек игрового поля
    cells.forEach((cell) => {
      cell.style.backgroundImage = "";
    });

    // Сброс сообщения о выигрыше/ничьей
    messageElement.textContent = "";

    // Сброс счета игроков
    displayScore();

    //очищение localStorage
    localStorage.removeItem("player1Score");
    localStorage.removeItem("player2Score");

    const restBtn = document.getElementById("restBtn");
    restBtn.disabled = false; //освобождение кнопки "следующий раунд" от блока
  }

  //перемещение фигур по средству счёта игры
  const player1Fig = document.getElementById("player1");
  const player2Fig = document.getElementById("player2");

  function movePlayers() {
    // Обновляем позицию фигур в зависимости от счета игроков
    let player1Top, player2Top;

    if (window.innerWidth < 980) {
      player1Top = 1280 - player1Score * 80; // место и шаг вверх
      player2Top = 1280 - player2Score * 80; // место и шаг вверх
    } 
    else if (window.innerWidth >= 980 && window.innerWidth < 1200) {
      player1Top = 585 - player1Score * 80;
      player2Top = 585 - player2Score * 80;
    } 
    else if (window.innerWidth >= 1200) {
      player1Top = 544 - player1Score * 80;
      player2Top = 544 - player2Score * 80;
    }

    player1Fig.style.top = player1Top + "px";
    player2Fig.style.top = player2Top + "px";
    saveFiguresPosLocalStorage(player1Top, player2Top);
  }

  //сохраняю позицию фигуры в localStorage
  function saveFiguresPosLocalStorage(player1Top, player2Top) {
    localStorage.setItem("player1Top", player1Top);
    localStorage.setItem("player2Top", player2Top);
  }

  // Вызываем функцию movePlayers() при каждом изменении счета
  setInterval(movePlayers, 1000); // Вызываем функцию каждую секундуS
});

let musicEnabled = false; //слежу за состоянием музыки(вкл/выкл)
let backgroundMusic = document.getElementById("backgroundMusic");
let toggleMusicBtn = document.getElementById("toggleMusicBtn");

//функция для включения/выключения музыки
function toggleMusic() {
  if (musicEnabled) { //if on
    backgroundMusic.pause();
    toggleMusicBtn.textContent = "Включить звук";
  } 
  else { //if off
    backgroundMusic.play();
    toggleMusicBtn.textContent = "Выключить звук";
  }
  musicEnabled = !musicEnabled; //инверсия состояния звука
}

//функция для смены музыки
function changeMusic() {
  let selectedMusic = document.getElementById("musicSelect").value;
  backgroundMusic.src = selectedMusic;
  backgroundMusic.play();
  musicEnabled = true; //указатель, что музыка включена
  toggleMusicBtn.textContent = "Выключить звук"; //смена показателя кнопки
}
