

interface Dish {
    dish: string;
    ingredients: string[];
}

const dishes: Dish[] = [
    { dish: "Toast 🍞", ingredients: ["🍞", "🧈"] },
    { dish: "Salad 🥗", ingredients: ["🥬", "🥕", "🥒"] },
    { dish: "Hot Dog 🌭", ingredients: ["🌭", "🍞", "🧅"] },
    { dish: "Pizza 🍕", ingredients: ["🍞", "🍅", "🧀"] },
    { dish: "Pasta 🍝", ingredients: ["🍝", "🍅", "🧀", "🌿"] },
    { dish: "Burger 🍔", ingredients: ["🥩", "🍞", "🧀", "🍅", "🥬"] },
    { dish: "Taco 🌮", ingredients: ["🌮", "🥩", "🧀", "🥬", "🍅"] },
    { dish: "Sushi 🍣", ingredients: ["🍚", "🐟", "🥢", "🥑", "🍋"] },
    { dish: "Ramen 🍜", ingredients: ["🍜", "🥩", "🥚", "🌿", "🧄", "🧅"] },
    { dish: "Feast 🍽️", ingredients: ["🍗", "🍖", "🍞", "🍷", "🥗", "🧁", "🍇"] },
];

let currentOrder: Dish;
let score = 0;
let timeLeft = 60;
let timerInterval: NodeJS.Timer;

const scoreElement = document.getElementById("score")!;
const timerElement = document.getElementById("timer")!;
const orderNameElement = document.getElementById("order-name")!;
const orderIngredientsElement = document.getElementById("order-ingredients")!;
const ingredientTrayElement = document.querySelector(".ingredient-tray")!;
const preparationAreaElement = document.querySelector(".preparation-area")!;
const completeOrderButton = document.getElementById("complete-order-btn")!;
const restartGameButton = document.getElementById("restart-game-btn")!;
const saveGameButton = document.getElementById("save-game-btn")!;
const loadGameButton = document.getElementById("load-game-btn")!;


function saveGame() {
    const preparationAreaContent = Array.from(preparationAreaElement.children).map(
        (el) => el.textContent
    );
    const gameState = {
        score,
        timeLeft,
        currentOrder,
        preparationAreaContent,
    };

    localStorage.setItem("kitchenGameState", JSON.stringify(gameState));
    alert("Game Saved!");
}

function loadGame() {
    const savedState = localStorage.getItem("kitchenGameState");
    if (savedState) {
        const gameState = JSON.parse(savedState);
        score = gameState.score;
        timeLeft = gameState.timeLeft;
        currentOrder = gameState.currentOrder;
        const preparationAreaContent = gameState.preparationAreaContent;


        scoreElement.innerText = `Score: ${score}`;
        timerElement.innerText = `Time Left: ${timeLeft}`;
        orderNameElement.innerText = currentOrder.dish;
        orderIngredientsElement.innerHTML = currentOrder.ingredients
            .map((ingredient) => `<span>${ingredient}</span>`)
            .join("");
        preparationAreaElement.innerHTML = preparationAreaContent
            .map((ingredient: string) => `<span>${ingredient}</span>`)
            .join("");

        clearInterval(timerInterval);
        startTimer();
        alert("Game Loaded!");
    } else {
        alert("No saved game found!");
    }
}
let currentIngredients: string[] = [];

function restartGame() {
    score = 0;
    timeLeft = 60;
    clearInterval(timerInterval);
    scoreElement.innerText = `Score: ${score}`;
    timerElement.innerText = `Time Left: ${timeLeft}`;
    preparationAreaElement.innerHTML = "";
    generateRandomOrder();
    generateIngredientTray();
    startTimer();
    alert("Game Restarted!");
}


function startGame() {
    generateRandomOrder();
    generateIngredientTray();
    startTimer();
}


function generateRandomOrder() {
    const randomIndex = Math.floor(Math.random() * dishes.length);
    currentOrder = dishes[randomIndex];
    orderNameElement.innerHTML = `Order: ${currentOrder.dish}`;
    orderIngredientsElement.innerHTML = currentOrder.ingredients.map(emoji => `<span>${emoji}</span>`).join(" ");
}

function generateIngredientTray() {
    const allIngredients = new Set<string>();
    dishes.forEach(dish => dish.ingredients.forEach(ingredient => allIngredients.add(ingredient)));
    const trayIngredients = Array.from(allIngredients);

    while (trayIngredients.length < 12) {
        trayIngredients.push(getRandomEmoji());
    }

    trayIngredients.sort(() => Math.random() - 0.5);

    ingredientTrayElement.innerHTML = trayIngredients.map(emoji => `<span class="ingredient">${emoji}</span>`).join(" ");
}

function getRandomEmoji() {
    const emojis = ["🍞", "🧈", "🥕", "🥬", "🍅", "🍖", "🧀", "🥩", "🌮", "🌯", "🍝", "🍚", "🍜"];
    return emojis[Math.floor(Math.random() * emojis.length)];
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.innerText = `Time Left: ${timeLeft}`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("Game Over!");
        }
    }, 1000);
}

function checkOrderCompletion() {

    const isOrderCorrect = currentIngredients.sort().join() === currentOrder.ingredients.sort().join();

    if (isOrderCorrect) {
        score += 1;
        timeLeft += 10;
        scoreElement.innerText = `Score: ${score}`;
        alert("Order completed successfully!");
    } else {
        score -= 1;
        scoreElement.innerText = `Score: ${score}`;
        alert("Incorrect order. Try again!");
    }


    currentIngredients = [];
    preparationAreaElement.innerHTML = "";
    generateRandomOrder();
}

function addIngredientToPreparationArea(ingredient: string) {

    preparationAreaElement.innerHTML += ingredient;
    currentIngredients.push(ingredient);
}


ingredientTrayElement.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("ingredient")) {
        addIngredientToPreparationArea(target.innerHTML);
    }
});

completeOrderButton.addEventListener("click", () => {
    checkOrderCompletion();
});
restartGameButton.addEventListener("click", () => {
    restartGame();
});
saveGameButton.addEventListener("click", () => {
    saveGame();
});
loadGameButton.addEventListener("click", () => {
    loadGame();
});

startGame();
