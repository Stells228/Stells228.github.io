const cells = document.querySelectorAll('[data-cell]'); /*читаю все эл-ты данного класса*/

let patPat = true; //слежу за текущим фото 

// Обработчик клика по ячейке

//перебираю каждый эл-нт в массиве
cells.forEach(cell => {
    cell.addEventListener('click', () => { //при тыканьи будет происходить магия
        // Проверяю, что ячейка пуста
        if (!cell.style.backgroundImage) {
            const urlPicture = patPat ? `/media/1.png` : `/media/2.png`; //условие о том, какая картинка первее 

            cell.style.backgroundImage = `url(${urlPicture})`; //вставляю значение переменной
            cell.style.backgroundSize = `cover`;
            cell.style.backgroundPosition = `center`;

            patPat = !patPat; //смена фото для следующего клика
        }
    });
});

//я решила использовать в данном случае фоновою установку картинки, чтобы
//она не перекликала с дальнейшими действиями в игре(та же анимация выигрыша линией)
