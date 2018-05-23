/*
    global variables initialization
 */

const sleepTime = 500;
let canBeClicked = true;
let cardsArray = new Array();
let skinPath = "skins/numbers";
let lastOpenedCard = null;

/*
    Card structure (class)
 */

function Card(number, value) {
    this.number = number;
    this.value = value;
    this.opened = false;
    this.matched = false;
}

/*
    functions
 */

function ShuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function SetSizeById(id, width, height) {
    let element = document.getElementById(id);
    if (element !== null) {
        element.style.width = width;
        element.style.height = height;
    }
}

function SetFontSizeById(id, size) {
    let element = document.getElementById(id);
    if (element !== null) {
        element.style.fontSize = size;
    }
}

function SetSizesByClassName(className, width, height) {
    let elements = Array.from(document.getElementsByClassName(className));
    elements.forEach((element) => {
        element.style.height = height;
        element.style.width = width;
    });
}

function SetWidthByClassName(className, width) {
    let elements = Array.from(document.getElementsByClassName(className));
    elements.forEach((element) => {
        element.style.width = width;
    });
}

function DeleteAllByClassName(className) {
    let elements = Array.from(document.getElementsByClassName(className));
    elements.forEach((element) => {
        if (element.parentElement.tagName !== "template") {
            element.parentNode.removeChild(element);
        }
    });
}

function ChangeAllCardsImages(imagePath) {
    let elements = Array.from(document.getElementsByClassName("card-image"));
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].parentElement.tagName !== "template") {
            elements[i].src = imagePath;
        }
    }
}

function SetCardImage(cardNumber, imagePath) {
    let cards = Array.from(document.getElementsByClassName("card-image"));
    cards[cardNumber].src = imagePath;
}

function OpenCard(element, card, image) {
    card.opened = true;
    SetCardImage(card.number, image);
}

function CloseCard(element, card, image) {
    element.style.backgroundColor = "darkcyan";
    card.opened = false;
    SetCardImage(card.number, image);
}

function SetCardMatched(element, card) {
    element.style.backgroundColor = "mediumseagreen";
    card.matched = true;
}

function Restart() {
    ShuffleArray(cardsArray);
    let elements = Array.from(document.getElementsByClassName("card"));
    for (let i = 0; i < cardsArray.length; i++) {
        cardsArray[i].number = i;
        cardsArray[i].matched = false;
        CloseCard(elements[i], cardsArray[i], `${skinPath}/back`);
    }
    lastOpenedCard = null;
}

function Won() {
    for (let i = 0; i < cardsArray.length; i++) {
        if (!cardsArray[i].matched) {
            return false;
        }
    }
    return true;
}

function SetElementVisibilityById(id, isVisible) {
    const element = document.getElementById(id);
    if (isVisible) {
        element.classList.remove("invisible");
    } else {
        element.classList.add("invisible");
    }
}

/*
    handlers
 */

function OnBodyResize() {
    const squared = Math.min(document.body.clientWidth, document.body.clientHeight);
    let width = `${squared * 0.85}px`;
    SetSizeById("deck", width, width);
    let height = `${squared * 0.05}px`;
    SetSizeById("header", width, height);
    height = `${squared * 0.05 / 2}px`;
    SetFontSizeById("body", height);
    SetWidthByClassName("menu", `${squared * 0.75}px`);
}

function OnMenuClick() {
    document.getElementById("overlay").classList.remove("invisible");
    document.getElementById("menu").classList.remove("invisible");
}

function OnMenuCloseClick() {
    document.getElementById("menu").classList.add("invisible");
    document.getElementById("overlay").classList.add("invisible");
}

function OnMenuRestartClick() {
    Restart();
    OnMenuCloseClick();
}

function OnMenuDifficultyClick() {
    document.getElementById("menu").classList.add("invisible");
    document.getElementById("difficulties-list").classList.remove("invisible");
}

function OnDifficultyCancelClick() {
    document.getElementById("menu").classList.remove("invisible");
    document.getElementById("difficulties-list").classList.add("invisible");
}

function OnDifficultyClick(newDifficulty) {
    OnDifficultyChanged(newDifficulty * 2);
    OnDifficultyCancelClick();
}

function OnCardBackCancelClick() {
    document.getElementById("menu").classList.remove("invisible");
    document.getElementById("card-backs-list").classList.add("invisible");
}

function OnCardBackClick(newPath) {
    skinPath = `${newPath}`;
    let images = Array.from(document.getElementsByClassName("card-image")),
        regexp = new RegExp("/([^/]*)$"),
        cardName;
    images.forEach((element) => {
        if (element.parentElement.parentElement.tagName !== "template") {
            cardName = regexp.exec(element.getAttribute("src"))[1];
            element.setAttribute("src", `${newPath}/${cardName}`);
        }
    });
    OnCardBackCancelClick();
}

function OnMenuCardBackClick() {
    document.getElementById("menu").classList.add("invisible");
    document.getElementById("card-backs-list").classList.remove("invisible");
}

function OnRulesCloseClick() {
    document.getElementById("menu").classList.remove("invisible");
    document.getElementById("rules").classList.add("invisible");
}

function OnMenuRulesClick() {
    document.getElementById("menu").classList.add("invisible");
    document.getElementById("rules").classList.remove("invisible");
}

function OnDifficultyChanged(newCardsCount) {
    cardsArray = new Array(Math.pow(newCardsCount, 2));
    for (let i = 0; i < cardsArray.length / 2; i++) {
        cardsArray[2 * i] = new Card(2 * i, i);
        cardsArray[2 * i + 1] = new Card(2 * i + 1, i);
    }
    ShuffleArray(cardsArray);
    for (let i = 0; i < cardsArray.length; i++) {
        cardsArray[i].number = i;
    }
    DeleteAllByClassName("card");
    let card = document.querySelector('#card-template'),
        deck = document.querySelector("#deck");
    for (let i = 0; i < Math.pow(newCardsCount, 2); i++) {
        deck.appendChild(document.importNode(card.content, true));
    }
    let dimension = `${100 / (newCardsCount + 1)}%`;
    SetSizesByClassName("card", dimension, dimension);
    ChangeAllCardsImages(`${skinPath}/back`);
    lastOpenedCard = null;
}

function OnGameEndCloseClick() {
    document.getElementById("overlay").classList.add("invisible");
    document.getElementById("end-of-game").classList.add("invisible");
    Restart();
}

function OnCardClick(e) {
    if (canBeClicked) {
        let elements = Array.from(document.getElementsByClassName("card"));
        for (let i = 0; i < elements.length; i++) {
            if ((e.currentTarget === elements[i]) && (!cardsArray[i].matched)) {
                OpenCard(elements[i], cardsArray[i], `${skinPath}/${cardsArray[i].value}`);
                if (lastOpenedCard === null) {
                    lastOpenedCard = cardsArray[i];
                } else if (cardsArray[i].number !== lastOpenedCard.number) {
                    canBeClicked = false;
                    if (cardsArray[i].value === lastOpenedCard.value) {
                        SetCardMatched(elements[lastOpenedCard.number], cardsArray[lastOpenedCard.number]);
                        SetCardMatched(elements[i], cardsArray[i]);
                        if (Won()) {
                            document.getElementById("overlay").classList.remove("invisible");
                            document.getElementById("end-of-game").classList.remove("invisible");
                        }
                        canBeClicked = true;
                        lastOpenedCard = null;
                    } else {
                        window.setTimeout(() => {
                            CloseCard(elements[lastOpenedCard.number], cardsArray[lastOpenedCard.number], `${skinPath}/back`);
                            CloseCard(elements[i], cardsArray[i], `${skinPath}/back`);
                            canBeClicked = true;
                            lastOpenedCard = null;
                        }, sleepTime);
                    }
                }
            }
        }

    }
}

OnBodyResize();
OnDifficultyChanged(4);