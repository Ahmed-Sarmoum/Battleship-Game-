let model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 2,
    shipsSunk: 0,

    ships: [
        { locations: [0, 0, 0.], hits: ["", "", ""] },
        { locations: [0, 0, 0], hits: ["", "", ""] },
        { locations: [0, 0, 0], hits: ["", "", ""] }
    ],

    fire: function(guess) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i];
            let index = ship.locations.indexOf(guess);


            if (ship.hits[index] === "hit") {
                view.displayMessage("Oops, you already hit that location!");
                return true;
            } else if (index >= 0) {
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("Touch !");
                this.shipsSunk++;
                // if (this.isSunk(ship)) {
                //     view.displayMessage("Vous avez coulé mon bat!eau!!");
                //     // this.shipsSunk++;
                // }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("You missed.!");
        return false;
    },

    isSunk: function(ship) {
        for (let i = 0; i < this.shipLength; i++)  {
            if (ship.hits[i] !== "hit") {
                return false;
            }
        }
        return true;
    },

    generateShipLocations: function() {
        let locations;
        for (let i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
        console.log("Ships array: ");
        console.log(this.ships);
    },

    generateShip: function() {
        let direction = Math.floor(Math.random() * 2);
        let row, col;

        if (direction === 1) { // horizontal
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
        } else { // vertical
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
            col = Math.floor(Math.random() * this.boardSize);
        }

        let newShipLocations = [];
        for (let i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + "" + (col + i));
            } else {
                newShipLocations.push((row + i) + "" + col);
            }
        }
        return newShipLocations;
    },

    collision: function(locations) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i];
            for (let j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }

};


let view = {
    displayMessage: function(msg) {
        let notify = document.getElementById("notify");
        notify.innerHTML = msg;
    },

    displayHit: function(location) {
        let cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },

    displayMiss: function(location) {
        let cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }

};

let controller = {
    guesses: 0,

    processGuess: function(guess) {
        let location = parseGuess(guess);
        if (location) {
            this.guesses++;
            let hit = model.fire(location);
            let suppos = document.getElementById("counterSuppos")
            suppos.innerHTML =this.guesses 
            let bat = document.getElementById("counterbate")
            if ( parseInt((model.numShips * model.shipLength)  - model.shipsSunk) <= 0) {
                bat.innerHTML = 0
                view.displayMessage("GAME OVER!!, \n You have sunk all my boats, " + this.guesses + " guesses \n refresh to play again!!");
                document.getElementById("guessInput").style.visibility = 'hidden'
                document.getElementById("fireButton").style.visibility = 'hidden'
            } else {
                bat.innerHTML =  parseInt((model.numShips * model.shipLength) -model.shipsSunk)
            } 
        }
    }
}


// helper function to parse a guess from the user

function parseGuess(guess) {
    let alphabet = ["A", "B", "C", "D", "E", "F", "G"];

    if (guess === null || guess.length !== 2) {
        alert("Oops, please enter a letter and a number on the board.");
    } else {
        let firstChar = guess.charAt(0);
        let row = alphabet.indexOf(firstChar);
        let column = guess.charAt(1);

        if (isNaN(row) || isNaN(column)) {
            alert("Oops, it's not on the board.");
        } else if (row < 0 || row >= model.boardSize ||
            column < 0 || column >= model.boardSize) {
            alert("Oops, it's off the board!");
        } else {
            return row + column;
        }
    }
    return null;
}


// event handlers

function handleFireButton() {
    let guessInput = document.getElementById("guessInput");
    let guess = guessInput.value.toUpperCase();

    controller.processGuess(guess);

    guessInput.value = "";
}

function handleKeyPress(e) {
    let fireButton = document.getElementById("fireButton");

   
    e = e || window.event;

    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}


window.onload = init;

function init() {
    
    let fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;

    
    let guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;

    
    model.generateShipLocations();
}






