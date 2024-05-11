const cells = document.querySelectorAll('[data-cell]'); /*читаю все эл-ты данного класса*/

// Обработчик клика по ячейке

//перебираю каждый эл-нт в массиве
cells.forEach(cell => {
    cell.addEventListener('click', () => { //при тыканьи будет происхлдить магия
        // Проверяю, что ячейка пуста
        if (!cell.style.backgroundImage) {
            // Добавляю картинку в ячейку
            cell.style.backgroundImage = 'url(/media/1.png)'; 
            cell.style.backgroundSize = 'cover'; //вся S ячейки
            cell.style.backgroundPosition = 'center';
        }
    });
});

//я решила использовать в данном случае фоновою установку картины, чтобы
//она не перекликалась с дальнейшими действиями в игре(та же анимация выигрыша линией)
