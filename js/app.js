/*
* Create a list that holds all of your cards
*/
/*
* Display the cards on the page
*   - shuffle the list of cards using the provided 'shuffle' method below
*   - loop through each card and create its HTML
*   - add each card's HTML to the page
*/
/*
* set up the event listener for a card. If a card is clicked:
*  - display the card's symbol (put this functionality in another function that you call from this one)
*  - add the card to a *list* of 'open' cards (put this functionality in another function that you call from this one)
*  - if the list already has another card, check to see if the two cards match
*    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
*    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
*    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
*    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
*/

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

const iconsArray = [     //array created manually, from static HTML UL, to be generated dynamically
    'fa fa-diamond', 'fa fa-diamond',
    'fa fa-paper-plane-o', 'fa fa-paper-plane-o',
    'fa fa-anchor', 'fa fa-anchor',
    'fa fa-bolt', 'fa fa-bolt',
    'fa fa-cube', 'fa fa-cube',
    'fa fa-leaf', 'fa fa-leaf',
    'fa fa-bicycle', 'fa fa-bicycle',
    'fa fa-bomb', 'fa fa-bomb'
];

const deck = document.querySelector('.deckClass');   //deck = empty UL

let openCardsArray = [];   //array for storing CURRENTLY open cards (up to 2)
let matchCardsArray = [];  //array for storing ALL the matched cards (up to 16)

let firstClick = true;

const movesContainer = document.querySelector('.moves');    //'movesContainer' = empty SPAN
let moves = 0;

let starsCount = 3;

var msg = document.getElementById('msgId').innerHTML;
var modalWindow = document.getElementById('modalWindowId');

const timerContainer = document.querySelector('.timer');
let timer;
let totalSeconds = 0;

const restartBtn = document.getElementById('restartBtnId');             //restart icon declared in html and css
const modalRestartBtn = document.getElementById('restartBtnModalId');


shuffle(iconsArray);

//create the deck of cards
function startGame() { 
    for (let i = 0; i < iconsArray.length; i++) {               //loop over 'iconsArray' array, incremented by 1 as long as number is lower then iconsArray.length
        const card = document.createElement('li');              //dynamically create list elements representing cards
        card.classList.add('cardClass');                        //adds a new elements to the UL with class 'cardClass'
        card.innerHTML = `<i class= '${iconsArray[i]}'></i>`;   //innerHTML narrowed with template iteral, assigns the 'i' element class value that represents card icon
        deck.appendChild(card);                                 //append cards to the deck
        cardClick(card) ;                                       //Click Event added to every card   
    }
}


//card click event
function cardClick(card) {
    card.addEventListener('click', function() {     //eventListener on card waits for it to be clicked
        const cardOne = openCardsArray[0];          //card clicked first is in array with index 0
        const cardTwo = this;                       //stores secondly clicked card for cardCompare
        if(firstClick) {                            //if it was the first click in the game
            startTimer();
            firstClick = false;
        }
        if (openCardsArray.length === 1) {                                     //if the first card in the turn was already open
            card.classList.add('openClass', 'showClass', 'cancelClass');       //invokes CSS classes for the clicked cards 
            openCardsArray.push(this);                                         //stores open card for comparing          
            compareCards(cardTwo, cardOne);                                    //compare both cards
        } else {
            cardTwo.classList.add('openClass', 'showClass', 'cancelClass');    
            openCardsArray.push(this);                                         
        }
    });
}

//cards comparision
function compareCards(cardTwo, cardOne) {
    if (cardTwo.innerHTML === cardOne.innerHTML) {                              //if match
        cardTwo.classList.add('matchClass')                 
        cardOne.classList.add('matchClass')               
        matchCardsArray.push(cardTwo, cardOne);                                 //stores matched cards   
        openCardsArray = [];                                                    //clear the array  
        gameOver();                                                             //check if all cards are matched
    } else {    
        setTimeout(function() {                                                 //if no match
            cardTwo.classList.remove('openClass', 'showClass', 'cancelClass');
            cardOne.classList.remove('openClass', 'showClass', 'cancelClass');
        }, 500);                                                                //undo adding classes after 0.5s       
        openCardsArray = [];                                                    //clear the array
    }
    addMove();
}

//moves
function addMove() {
    moves++;                                                                    //increase moves by 1
    movesContainer.innerHTML = moves;                                           //'span' element in html file
    rating();                                                                   //set the rating after each move
}

//stars rating
function rating() {             //moves to stars relation
    if (moves <= 10) {
        starsCount = 3;        
    } else if (moves <= 15) {
        document.getElementById('star1').outerHTML = '';                        //clearing '.outerHTML' removes the star icon
        starsCount = 2;                                                         //'starsCount' is decreased by 1 after every 5 moves   
    } else if (moves <= 20) {
        document.getElementById('star2').outerHTML = '';
        starsCount = 1;             
    } else {
        document.getElementById('star3').outerHTML = '';        
        starsCount = 0;
    }
}

//timer
function startTimer()    {
    timer = setInterval(function() {
        totalSeconds++;                                         //add +1 to the totalSeconds
        timerContainer.innerHTML = totalSeconds + ' seconds';   //increase displayed time by 1
    }, 1000);                                                   //update interval
}
function stopTimer() {
    clearInterval(timer);
}

function modalInput() {     //send the end game message into html element
    document.getElementById('msgId').innerHTML = ' Congrats!\n You\'ve finished in '+ totalSeconds +' seconds.\n Your stars rating is '+ starsCount +'/3';
}

function modalOutput() {    //show the modal with prepared msg
    window.location.href = 'index.html#modalWindowId';
}

//game reset
function reset() {                                          //reload the page to start over
    window.location.href = 'index.html';   
}

//restart buttons
restartBtn.addEventListener('click', function() {           //main restart button
    reset();    
});

modalRestartBtn.addEventListener('click', function() {      //restart button in modal end game
    reset();    
});

//game over
function gameOver() {       //is the game over?
    if (matchCardsArray.length === iconsArray.length) { //is over if the 16 cards in both arrays match
        stopTimer();
        modalInput();       
        modalOutput();      //end of program
    }
}

//first start
startGame();