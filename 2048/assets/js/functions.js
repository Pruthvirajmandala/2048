console.clear();

function ourGame(gridElements, scoreSelector) {

    let gridBlocks = [],
        gridElems = Array.prototype.map.call(document.querySelectorAll(gridElements), function(evnt) {
            return evnt;
        }),
        score = 0,
        scoreElem = document.querySelector(scoreSelector);

    let gamePlay = false;
    const init = function() {
        if (gamePlay) {
            score = 0; 
            scoreElem.textContent = '0';
            for (let i = 0, l = gridElems.length; i < l; i++) {
                gridElems[i].firstChild.textContent = '';
            }
        } else {
            gamePlay = true;
            window.addEventListener('keydown', function(e) {
                let direction = undefined;
                switch (e.keyCode) {
                    case 37:
                        direction = 'left';
                        break;
                    case 38:
                        direction = 'up';
                        break;
                    case 39:
                        direction = 'right';
                        break;
                    case 40:
                        direction = 'down';
                        break;
                }
                // this week
                if (direction) {
                    moveDirection(direction);
                }
            }); 
        }
        gridBlocks = new Array(16).fill(0);
        paint();
        paint();
    }; 

    const paint = () => {
        const gridValue = [2, 4];
        let selectedGridValue = gridValue[Math.floor(Math.random() * gridValue.length)];
        let slot = false;
        let index = 0;
        if (gridBlocks.indexOf(0) > -1) {
            while (!slot) {
                let i = Math.floor(Math.random() * gridBlocks.length);
                if (!gridBlocks[i]) {
                    slot = true;
                    index = i;
                }
            }
            gridBlocks[index] = selectedGridValue;
            gridElems[index].firstChild.textContent = selectedGridValue;
        }
        disableBlocks(); // function call to disable elements in 2nd board
    };   
    
    // this week
    const moveDirection = (direction) => {
        const newBlocks = moveLogic(direction);
        if (!gridBlocks.every((v, i) => v === newBlocks[i])) {
            score++;
            scoreElem.textContent = `${Math.max(...gridBlocks)} (${score} moves)`;
            for (let i = 0; i < 16; i++) {
                gridBlocks[i] = newBlocks[i];
                gridElems[i].firstChild.textContent = newBlocks[i] ? newBlocks[i] : '';
            }
            paint();
        } else if (gridBlocks.indexOf(0) === -1) {
            if (gameOver()) {
                alert(`Nice! You got to ${Math.max(...gridBlocks)} in ${score} moves! :)`);
                init();
            }
        }        
    };

    const gameOver = () => {
        let a = [];
        let directions = ['left', 'right', 'up', 'down'];
        for (let i = 0; i < 4; i++) {
            const blocksTest = moveLogic(directions[i]);
            a.push(~~gridBlocks.every((v, index) => v === blocksTest[index]));
        }
        return a.indexOf(0) === -1;
    }; 

    const moveLogic = (direction) => {
        let newBlocks = [];
        let config = {};        
        switch (direction) {
            case 'left':
                config = {
                    pattern: [0, 1, 2, 3],
                    lt: 16,
                    inc: 4
                }
                break;
            case 'right':
                config = {
                    pattern: [3, 2, 1, 0],
                    lt: 16,
                    inc: 4
                }
                break;
            case 'up':
                config = {
                    pattern: [0, 4, 8, 12],
                    lt: 4,
                    inc: 1
                }
                break;
            default:
                config = {
                    pattern: [12, 8, 4, 0],
                    lt: 4,
                    inc: 1
                }
        }
        for (let g = 0; g < config.lt; g += config.inc) {
            let replacementRow = [];
            let filteredRow = [gridBlocks[config.pattern[0] + g], gridBlocks[config.pattern[1] + g], gridBlocks[config.pattern[2] + g], gridBlocks[config.pattern[3] + g]].filter(function(v) {
                return v > 0;
            });
            if (!filteredRow.length) {
                replacementRow = [0, 0, 0, 0];
            } else if (filteredRow.length === 1) {
                replacementRow = [filteredRow[0], 0, 0, 0];
            } else {
                for (let i = 0, l = filteredRow.length; i < l; i++) {
                    if (filteredRow[i] === filteredRow[i + 1]) {
                        replacementRow.push(filteredRow[i] + filteredRow[i + 1]);
                        i++;
                    } else {
                        replacementRow.push(filteredRow[i]);
                    }
                }
            }
            while (replacementRow.length < 4) {
                replacementRow.push(0);
            }
            for (let i = 0; i < 4; i++) {
                newBlocks[config.pattern[i] + g] = replacementRow[i];
            }
        }
        return newBlocks;
    }; // moveAndShift();

    // 2nd player logic 
    let secondElements = document.querySelectorAll('.secondPlayer .grid-element'); // to fetch all the elements from second board

    const disableBlocks = () => {
        var disabledList = [];
        var i = -1; 
        while ((i = gridBlocks.indexOf(0, i+1)) != -1){ 
            disabledList.push(i); 
        }
        // in above code we are finding all the empty places in 1st board and storing their places in a new array called disabled list. 
        for(var j = 0; j < secondElements.length; j++){
            secondElements[j].classList.add('disabled');
            for(var k = 0; k < disabledList.length; k++){
                secondElements[disabledList[k]].classList.remove('disabled');
            }   
        }
        // in above code in outer loop we are selecting all the elements in 2nd and giving it class 'disabled' - so that all the elements are disabled. in inner loop we are removing class disabled for all the elements which are empty in 1st board
    } // function for disabling elements in 2nd board

    init();
    
    return {
        reset: init
    }
    
} // game2048

// Initialize and start the game!
let game = new ourGame('.grid-element', '.score h1');
document.querySelector('.restart').addEventListener('click', game.reset);