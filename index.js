//imports
import * as classes from './classes.js';
import * as sorting from './sorting.js';

//menu button event listeners
document.getElementById('playButton').addEventListener('click', startGame);

document.getElementById('quitButton').addEventListener('click', function() {
    window.close();
});

document.getElementById('menuSettingsButton').addEventListener('click', settingsfunction);

document.getElementById('instructionsButton').addEventListener('click', instructionsDisplay);

document.getElementById('scoresButton').addEventListener('click', scoresDisplay);

//audio 
let music = new Audio();
music.src = './audio/bg.mp3';
// Enable looping
music.loop = true;

function playAudio() {
    const musicButton = document.getElementById('musicButton');
    
    if (music.paused) {
        const playbackPosition = localStorage.getItem('playbackPosition');
        if (playbackPosition) {
            music.currentTime = parseFloat(playbackPosition);
        }
        music.play();
        musicButton.classList.add('active');
        localStorage.setItem('musicState', 'playing'); // Save state as playing
    } else {
        localStorage.setItem('playbackPosition', music.currentTime);
        music.pause();
        musicButton.classList.remove('active');
        localStorage.setItem('musicState', 'paused'); // Save state as paused
    }
}

// Save playback position and state before unloading the page
window.onbeforeunload = function() {
    localStorage.setItem('playbackPosition', music.currentTime);
};

// Check if music was playing before the page was reloaded and resume playback
window.onload = function() {
    const musicButton = document.getElementById('musicButton');
    const musicState = localStorage.getItem('musicState');
    try{
        if (musicState === 'playing') {
        const playbackPosition = localStorage.getItem('playbackPosition');
        if (playbackPosition) {
            music.currentTime = parseFloat(playbackPosition);
        }
        music.play();
        musicButton.classList.add('active')
    } else {
        musicButton.classList.remove('active');
    }}
    catch {}
};

function scoresDisplay() {
    // Clear existing content on the page
    document.body.innerHTML = '';

    const canvasContainer = document.createElement('div');
    canvasContainer.id = 'canvas-container';
    document.body.appendChild(canvasContainer);

    // Create container for the buttons
    const container = document.createElement('div');
    container.classList.add('container'); // Apply container class
    document.body.appendChild(container);

    // Create back button
    const backButton = createBackButton();
    document.body.appendChild(backButton);
    document.getElementById('backButton').addEventListener('click', function() {
        window.location.reload(); // reaload page if back button is pressed
    });

    // Create leaderboard text
    const leaderboardText = document.createElement('div');
    leaderboardText.textContent = 'Leaderboard:';
    leaderboardText.classList.add('leaderboard-text'); // apply leaderboard text class
    container.appendChild(leaderboardText);

    // Create all the toggle buttons
    const nameButton = createToggleButton('Name', container);
    const scoreButton = createToggleButton('Score', container);
    const ascendingButton = createToggleButton('Ascending', container);
    const descendingButton = createToggleButton('Descending', container);

    // Create "Sort by" and "Order by" text elements
    const sortByText = document.createElement('div');
    sortByText.textContent = '┍--Sort by--┑';
    sortByText.classList.add('vertical-text', 'sortByText'); // apply text classes
    document.body.appendChild(sortByText);

    const orderByText = document.createElement('div');
    orderByText.textContent = '┍--Order by--┑';
    orderByText.classList.add('vertical-text', 'orderByText'); // apply text classes
    document.body.appendChild(orderByText);

    // Function to create a toggle button
    function createToggleButton(text, container) {
        const button = document.createElement('button');
        button.textContent = text;
        button.classList.add('btn'); // Apply btn class
        button.classList.add('toggle-button'); // Apply toggle-button class
        button.style.top = `${110 + container.children.length * 100}px`; // Adjust top position based on existing buttons
        container.appendChild(button);
        return button;
    }

    // Add click event listeners to the buttons
    const buttons = [nameButton, scoreButton, ascendingButton, descendingButton];
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            handleButtonClick(button);
        });
    });

    // Variable to keep track of the active buttons
    let activeButtons = [scoreButton, descendingButton];

    function handleButtonClick(button) {
        const isSortingButton = [nameButton, scoreButton, ascendingButton, descendingButton].includes(button);

        if (isSortingButton) {
            // Check if the clicked button is a sorting button
            if (button === nameButton || button === scoreButton) {
                // Deactivate the other sorting button in the same group
                const otherSortingButton = button === nameButton ? scoreButton : nameButton;
                otherSortingButton.classList.remove('active');
            } else if (button === ascendingButton || button === descendingButton) {
                // Deactivate the other sorting button in the same group
                const otherSortingButton = button === ascendingButton ? descendingButton : ascendingButton;
                otherSortingButton.classList.remove('active');
            }
        }

        // Toggle the clicked button
        button.classList.toggle('active');

        // Update the active buttons array based on the clicked button
        if (isSortingButton) {
            if (button.classList.contains('active')) {
                // Add the button to the active buttons array if it's active
                activeButtons.push(button);
            } else {
                // Remove the button from the active buttons array if it's not active
                activeButtons = activeButtons.filter(activeButton => activeButton !== button);
            }
        }

        // boolean values to check if each button is active or not
        const scoreIsActive = scoreButton.classList.contains('active');
        const ascendingIsActive = ascendingButton.classList.contains('active');
        const nameIsActive = nameButton.classList.contains('active');
        const descendingIsActive = descendingButton.classList.contains('active');

        let sortedData;
        if (scoreIsActive && ascendingIsActive) {
            // Call the sorting function when both buttons are active
            sortedData = sorting.sortByScoresAscending();
        }
        else if (scoreIsActive && descendingIsActive) {
            // Call the sorting function when both buttons are active
            sortedData = sorting.sortByScoresDescending();
        }
        else if (nameIsActive && ascendingIsActive) {
            // Call the sorting function when both buttons are active
            sortedData = sorting.sortByNamesAscending();
        }
        else if (nameIsActive && descendingIsActive) {
            // Call the sorting function when both buttons are active
            sortedData = sorting.sortByNamesDescending();
        }
        displayLeaderboard(container, sortedData);
    }
}

function displayLeaderboard(container, sortedData) {

    // Create container for leaderboard
    const leaderboardContainer = document.createElement('div');
    leaderboardContainer.classList.add('leaderboard-container');

    // Format the sorted data
    const formattedData = sortedData.map(entry => {
        const name = entry.name.padEnd(13); // Ensure name is at least 8 characters long
        const score = entry.score;
        return `${name}${score}`;
    }).join('\n');

    const header = 'Name:        Score:\n'; // column titles
    const dataWithHeaders = header + formattedData;

    // Create textarea element for leaderboard
    const textarea = document.createElement('textarea');
    textarea.textContent = dataWithHeaders;
    textarea.classList.add('leaderboard-textarea'); 
    textarea.readOnly = true; // Make the textarea read-only

    // Append textarea to the leaderboard container
    leaderboardContainer.appendChild(textarea);

    // Append the leaderboard container to the main container
    container.appendChild(leaderboardContainer);

}

function createBackButton(){
    const backButton = document.createElement('button');
    backButton.textContent = '⇦';
    backButton.classList.add('btn', 'back-button'); // Apply classes
    backButton.id = "backButton";
    return backButton;
}

function createMusicButton() {
    const musicButton = document.createElement('button');
    musicButton.textContent = 'Music';
    musicButton.classList.add('btn', 'music-button'); // apply styling classes
    musicButton.id = "musicButton";
    return musicButton;
}

function instructionsDisplay() {
    document.getElementById('loading-screen').style.display = 'none' // hide loading screen
    const container = this.parentElement;
    container.remove(); // remove container

    const instructionsText = document.createElement('div');
    instructionsText.textContent = 'instructions: ';
    instructionsText.classList.add('instructions-text'); // apply styling class
    document.body.appendChild(instructionsText);

    const playerMovementText = document.createElement('div');
    playerMovementText.textContent = 
    "controls:\n\n"+
    "Player Movement: w a s d\n" +
    "Use Tool: p\n" +
    "Use Seed: o\n" +
    "Change Tool: q\n" +
    "Change Seed: e\n" +
    "Sleep: n (must be in house)";
    playerMovementText.classList.add('player-movement-text'); // apply styling class
    document.body.appendChild(playerMovementText);

    const howToPlayText = document.createElement('div');
    howToPlayText.textContent = 
    "How To Play:\n\n" +
    "the aim of this game is to accumalate as high of a score as you can by growing crops and cutting trees. Grow crops and regrow chopped trees by going to sleep in your house. Click on the merchant to trade your resources for points!";
    howToPlayText.classList.add('how-to-play-text'); // apply styling class
    document.body.appendChild(howToPlayText);

    const backButton = createBackButton();
    document.body.appendChild(backButton); // add a back button
    document.getElementById('backButton').addEventListener('click', function() {
        window.location.reload(); // reload the page if the back button is clicked
    });
}

function settingsfunction() {
    document.getElementById('loading-screen').style.display = 'none' // hide loading screen
    const container = this.parentElement;
    container.remove();

    // text which says settings
    const settingsText = document.createElement('div');
    settingsText.textContent = 'settings: ';
    settingsText.classList.add('settings-text');
    document.body.appendChild(settingsText);

    // background image of music notes
    const musicImage = new Image()
    musicImage.src = './graphics/musicImage.png'
    musicImage.classList.add('musicImage');
    document.body.appendChild(musicImage);

    const musicButton = createMusicButton(); // create a music button
    document.body.appendChild(musicButton);
    const musicState = localStorage.getItem('musicState'); // check whether music is playing or not
    // change the button state accordingly
    if (musicState === 'playing') {
        musicButton.classList.add('active');
    } else {
        musicButton.classList.remove('active');
    }
    document.getElementById('musicButton').addEventListener('click', playAudio);

    const backButton = createBackButton(); // create a back button
    document.body.appendChild(backButton);
    document.getElementById('backButton').addEventListener('click', function() {
        window.location.reload(); // reload page if button ispressed
    });
}

function startGame() {

    // Remove event listeners from each element
    const playButton = document.getElementById('playButton');
    playButton.removeEventListener('click', startGame);
    
    const quitButton = document.getElementById('quitButton');
    quitButton.removeEventListener('click', () => window.close());
    
    const menuSettingsButton = document.getElementById('menuSettingsButton');
    menuSettingsButton.removeEventListener('click', settingsfunction);
    
    const instructionsButton = document.getElementById('instructionsButton');
    instructionsButton.removeEventListener('click', instructionsDisplay);
    
    const scoresButton = document.getElementById('scoresButton');
    scoresButton.removeEventListener('click', scoresDisplay);
    
    // A U D I O  imports
    const axeAudio = new Audio();
    axeAudio.src = './audio/axe.mp3';

    const hoeAudio = new Audio();
    hoeAudio.src = './audio/hoe.wav';

    const waterAudio = new Audio();
    waterAudio.src = './audio/water.mp3';

    const rainAudio = new Audio();
    rainAudio.src = './audio/rain.mp3';

    const plantAudio = new Audio();
    plantAudio.src = './audio/plant.wav';


    // I M A G E imports
    const mapImage = new Image();
    mapImage.src = './graphics/my_world/main_map.png';

    const playerImage = new Image();
    playerImage.src = './graphics/character/down_idle/0.png';

    const merchantImage = new Image();
    merchantImage.src = './graphics/objects/merchant.png'

    const chickenImage = new Image();
    chickenImage.src = './graphics/chicken/idle/0.png'

    const foregroundImage = new Image();
    foregroundImage.src = './graphics/world/foreground.png';

    const toolImage = new Image();
    toolImage.src = './graphics/overlay/hoe.png';

    const seedImage = new Image();
    seedImage.src = './graphics/overlay/corn.png';

    const cowImage = new Image()
    cowImage.src = './graphics/cow/right/0.28.png';

    const bImage = new Image();
    bImage.src = "./graphics/soil/b.png";
    const blImage = new Image();
    blImage.src = "./graphics/soil/bl.png"
    const bmImage = new Image();
    bmImage.src = "./graphics/soil/bm.png"
    const brImage = new Image();
    brImage.src = "./graphics/soil/br.png"
    const lImage = new Image();
    lImage.src = "./graphics/soil/l.png"
    const lmImage = new Image();
    lmImage.src = "./graphics/soil/lm.png"
    const lrImage = new Image();
    lrImage.src = "./graphics/soil/lr.png"
    const lrbImage = new Image();
    lrbImage.src = "./graphics/soil/lrb.png"
    const lrtImage = new Image();
    lrtImage.src = "./graphics/soil/lrt.png"
    const oImage = new Image();
    oImage.src = "./graphics/soil/o.png"
    const rImage = new Image();
    rImage.src = "./graphics/soil/r.png"
    const rmImage = new Image();
    rmImage.src = "./graphics/soil/rm.png"
    const soilImage = new Image();
    soilImage.src = "./graphics/soil/soil.png"
    const tImage = new Image();
    tImage.src = "./graphics/soil/t.png"
    const tbImage = new Image();
    tbImage.src = "./graphics/soil/tb.png"
    const tblImage = new Image();
    tblImage.src = "./graphics/soil/tbl.png"
    const tbrImage = new Image();
    tbrImage.src = "./graphics/soil/tbr.png"
    const tlImage = new Image();
    tlImage.src = "./graphics/soil/tl.png"
    const tmImage = new Image();
    tmImage.src = "./graphics/soil/tm.png"
    const trImage = new Image();
    trImage.src = "./graphics/soil/tr.png"
    const xImage = new Image();
    xImage.src = "./graphics/soil/x.png"
    const wateredSoil = new Image();
    wateredSoil.src = "./graphics/soil_water/0.png"

    const cornImage0 = new Image();
    cornImage0.src = './graphics/fruit/corn/0.png'
    const cornImage1 = new Image();
    cornImage1.src = './graphics/fruit/corn/1.png'
    const cornImage2 = new Image();
    cornImage2.src = './graphics/fruit/corn/2.png'
    const cornImage3 = new Image();
    cornImage3.src = './graphics/fruit/corn/3.png'
    const cornImages = [cornImage0, cornImage1, cornImage2, cornImage3]

    const tomatoImage0 = new Image();
    tomatoImage0.src = './graphics/fruit/tomato/0.png'
    const tomatoImage1 = new Image();
    tomatoImage1.src = './graphics/fruit/tomato/1.png'
    const tomatoImage2 = new Image();
    tomatoImage2.src = './graphics/fruit/tomato/2.png'
    const tomatoImage3 = new Image();
    tomatoImage3.src = './graphics/fruit/tomato/3.png'
    const tomatoImages = [tomatoImage0, tomatoImage1, tomatoImage2, tomatoImage3]

    const largeTreeImage = new Image()
    largeTreeImage.src = './graphics/objects/tree_medium.png'
    const smallTreeImage = new Image()
    smallTreeImage.src = './graphics/objects/tree_small.png'
    const largeStumpImage = new Image()
    largeStumpImage.src = './graphics/objects/stump_medium.png'
    const smallStumpImage = new Image()
    smallStumpImage.src = './graphics/objects/stump_small.png'
    const whiteSmallTreeImage = new Image()
    whiteSmallTreeImage.src = './graphics/objects/whiteSmallTree.png'
    const whiteLargeTreeImage = new Image()
    whiteLargeTreeImage.src = './graphics/objects/whiteMediumTree.png'
    const appleImage = new Image()
    appleImage.src = './graphics/fruit/apple.png'
    const whiteAppleImage = new Image()
    whiteAppleImage.src = './graphics/fruit/whiteApple.png'
    const whiteTomatoImage = new Image()
    whiteTomatoImage.src = './graphics/fruit/whiteTomato.png'
    const whiteCornImage = new Image()
    whiteCornImage.src = './graphics/fruit/whiteCorn.png'

    // end game button function
    function createEndGameButton() {
        const endGameButton = document.createElement('button');
        endGameButton.textContent = 'end game';
        endGameButton.classList.add('btn');
        endGameButton.id = "endGameButton";
        return endGameButton;
    }

    // display score 
    function displayScore(score) {
        const scoreBox = document.createElement('div');
        scoreBox.classList.add('score-box');
        scoreBox.textContent = 'Score: ' + score;
        document.body.appendChild(scoreBox);
    }

    // general G L O B A L constants and variables for the game
    let score = 0;
    
    const container = this.parentElement;
    container.remove();

    const TILE_SIZE = 64
    const MOVEMENT_speed = 5;

    const canvas = document.querySelector('canvas');
    const c = canvas.getContext('2d');

    canvas.width = 1280;
    canvas.height = 720;
    let initialSoilStatus = "X"

    var vRain;
    
    // END GAME function (input name and store this in json file)
    function endGame() {
        endGameButton.removeEventListener('click', endGame);
        canvas.removeEventListener('click', canvasClickListener);
        window.removeEventListener('keydown', keydownListener);
        window.removeEventListener('keyup', keyupListener);

        // Access the global score variable here
        const playerScore = score; // Use the (global) score variable
    
        const container = document.createElement('div');
        container.classList.add('input-container'); // apply styling class
        
        const nameLabel = document.createElement('label');
        nameLabel.textContent = 'Name: ';
        nameLabel.classList.add('name-label'); // apply styling class
        
        const nameInput = document.createElement('input');
        nameInput.setAttribute('type', 'text');
        nameInput.setAttribute('maxlength', '7'); // limit the characters in the name input
        nameInput.classList.add('name-input'); // apply styling class
        
        // Append elements to the container
        container.appendChild(nameLabel);
        container.appendChild(nameInput);
        document.body.appendChild(container);
    
        nameInput.focus();
    
        nameInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter' && nameInput.value.trim() !== '') {
                const name = nameInput.value.trim();
                const score = playerScore; // Assuming playerScore is already defined
                const existingEntries = JSON.parse(localStorage.getItem('playerEntries')) || [];
    
                // Add the new entry to the existing entries
                existingEntries.push({ name, score });
    
                // Store the updated entries back in Local Storage
                localStorage.setItem('playerEntries', JSON.stringify(existingEntries));
                window.location.reload();
            }
        });
    }

    // end game BUTTON implimentation
    const endGameButton = createEndGameButton();
    document.body.appendChild(endGameButton);

    displayScore(score) // display score function implimentation

    document.getElementById('endGameButton').addEventListener('click', endGame) //end game event listener

    // R A I N functions
    // function for a random chance of rain. returns true or false
    function chanceOfRain() {
        let raining = false;
        let number = Math.floor(Math.random() * 100) + 1;
        if (number >= 70) {
            raining = true;
        } else {
            raining = false
        }
        return raining;
    }

    // function which updates all the raindrop positions so they fall
    function updateRain() {
        if(vRain){
            for (var i = 0; i < vRain.length; i++) {
                vRain[i].show(canvas, c);
                vRain[i].fall(canvas, c);
            }
        }
    }

    // function which creates 60 raindrops of random size and speed
    function createRain() {
        vRain = [];
        for (var i = 0; i < 60; i++) {
            vRain[i] = new classes.Rain(
                Math.floor(Math.random() * canvas.width) + 5,
                Math.floor(Math.random() * 100) - 100,
                Math.floor(Math.random() * 30) + 1,
                Math.floor(Math.random() * 12) + 4
            );
        }
        // update the rain every 0.01 seconds
        setInterval(function() {
            updateRain();
        }, 10);
    }

    let raining = chanceOfRain(); // true or false
    // if its raining, create rain animation and water all soil tiles
    if(raining){
        createRain();
        rainAudio.play()
        initialSoilStatus = "W"}
    else{initialSoilStatus = "X"}

    // initialise collision map using collisions file
    const collisionsMap = [];
    for (let i = 0; i < collisions.length; i += 90) {
        collisionsMap.push(collisions.slice(i, i + 90));
    }

    // the initial offset of all background images 
    const offset = {
        x: -1800,
        y: -1300
    };

    // intitialise the boundaries list to be empty
    const boundaries = [];

    // create an instance of the boundary class for each collision tile
    collisionsMap.forEach((row, i) => {
        row.forEach((symbol, j) => {
            if (symbol === 267) {
                boundaries.push(
                    new classes.Boundary({
                        pos: {
                            x: j * TILE_SIZE + offset.x,
                            y: i * TILE_SIZE + offset.y
                        },
                        width: TILE_SIZE,
                        height: TILE_SIZE
                    })
                );
            } else if (symbol === 268) {
                boundaries.push(
                    new classes.Boundary({
                        pos: {
                            x: j * TILE_SIZE + offset.x + 32,
                            y: i * TILE_SIZE + offset.y
                        },
                        width: 32,
                        height: TILE_SIZE
                    })
                );
            } else if (symbol === 269) {
                boundaries.push(
                    new classes.Boundary({
                        pos: {
                            x: j * TILE_SIZE + offset.x,
                            y: i * TILE_SIZE + offset.y
                        },
                        width: 32,
                        height: TILE_SIZE
                    })
                );
            } else if (symbol === 270) {
                boundaries.push(
                    new classes.Boundary({
                        pos: {
                            x: j * TILE_SIZE + offset.x,
                            y: i * TILE_SIZE + offset.y + 32
                        },
                        width: TILE_SIZE,
                        height: 32
                    })
                );
            }
        });
    });

    c.fillRect(0, 0, canvas.width, canvas.height);

    let soilTiles = [];

    // create the merchant using the merchant class
    const merchant = new classes.Merchant({
        pos: {
            x: -200,
            y: -280
        },
        image: merchantImage
    })

    function merchantInteraction() {
        // Create a container element
        const container = document.createElement('div');
        container.classList.add('inventory-container');

        // Text displaying the player's inventory
        const inventoryText = document.createElement('p');
        inventoryText.textContent = 'Player Inventory:';
        inventoryText.classList.add('inventory-text');

        // Append inventory text to the container
        container.appendChild(inventoryText);

    
        // Loop through player's inventory and add items to the container
        for (const [item, quantity] of Object.entries(player.inventory)) {
            const itemContainer = document.createElement('div');
            itemContainer.classList.add('item-container'); // Add item container class
        
            // Create a paragraph element for item and quantity
            const itemText = document.createElement('p');
            itemText.textContent = `${item}: ${quantity}`;
            itemText.classList.add('item-text'); // Add item text class
        
            // Create a paragraph element for price
            const priceText = document.createElement('p');
            priceText.textContent = `price: ${SALE_PRICES[item]}`;
            priceText.classList.add('price-text'); // Add price text class
        
            // Append item and price to the item container
            itemContainer.appendChild(itemText);
            itemContainer.appendChild(priceText);
        
            // Append the item container to the main container
            container.appendChild(itemContainer);
        }
    
        // Create a "Sell All" button
        const sellAllButton = document.createElement('button');
        sellAllButton.textContent = 'Sell All';
        sellAllButton.classList.add('sell-all-button'); // Add sell-all-button class
        sellAllButton.addEventListener('click', sellAllItems); // Add event listener to handle selling all items
        container.appendChild(sellAllButton);

        // Create a "Close Inventory" button
        const closeInventoryButton = document.createElement('button');
        closeInventoryButton.textContent = 'Close Inventory';
        closeInventoryButton.classList.add('close-inventory-button'); // Add close-inventory-button class
        closeInventoryButton.addEventListener('click', closeInventory); // Add event listener to handle closing inventory
        container.appendChild(closeInventoryButton);
    
        // Append the container to the document body
        document.body.appendChild(container);
    }
    
    const SALE_PRICES = {
        'wood': 4,
        'apple': 2,
        'corn': 10,
        'tomato': 20
    };    
    // Function to handle selling all items
    function sellAllItems() {
        let totalSaleAmount = 0;
        // Loop through player's inventory and sell each item
        for (const [item, quantity] of Object.entries(player.inventory)) {
            // Calculate sale amount for each item
            const saleAmount = SALE_PRICES[item] * quantity;
            totalSaleAmount += saleAmount;
            // Remove sold items from inventory
            player.inventory[item] = 0
        }
        // Update player's score with total sale amount
        score += totalSaleAmount;
        // Update score display
        displayScore(score);
        updateDisplayedInventory();
    }
    
    // Function to handle closing inventory
    function closeInventory() {
        // Remove the inventory container from the document body
        document.body.removeChild(document.querySelector('.inventory-container'));
    }
    
    // function to update the merchant display if the player inventory changes
    function updateDisplayedInventory() {
        // Remove the existing inventory container
        const existingInventoryContainer = document.querySelector('.inventory-container');
        if (existingInventoryContainer) {
            document.body.removeChild(existingInventoryContainer);
        }
        // Recreate the inventory display
        merchantInteraction();
    }

    // Define the click event listener function
    function canvasClickListener(event) {
        // Get the mouse position relative to the canvas
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        // Check if the mouse click occurred within the bounding box of the merchant
        if (mouseX >= merchant.pos.x && mouseX <= merchant.pos.x + merchantImage.width &&
            mouseY >= merchant.pos.y && mouseY <= merchant.pos.y + merchantImage.height) {
            merchantInteraction();
        }
    }
    canvas.addEventListener('click', canvasClickListener);

    // create the player using the player class
    const player = new classes.Player({
        pos: {
            x: canvas.width / 2 - 86,
            y: canvas.height / 2 - 62
        },
        image: playerImage,
        status: 'down_idle'
    });

    // create chicken which follows the player using chicken class
    const chicken = new classes.Chicken({
        pos: {
            x: canvas.width / 2 - 186,
            y: canvas.height / 2 
        },
        image: chickenImage,
        status: 'idle',
        player: player, // Pass the player instance to the chicken
        boundaries: boundaries
    });

    // Clone the player's rect object
    playerImage.onload = function() {
        // This code will execute once the player image has loaded
        const playerHitbox = {
            x: player.pos.x + 63,
            y: player.pos.y + 55,
            width: playerImage.width - 126,
            height: playerImage.height - 80
        };
        player.hitbox = playerHitbox;
    };

    // create the background using the map class
    const background = new classes.Map({
        pos: {
            x: offset.x,
            y: offset.y
        },
        image: mapImage
    });

    
    const cows = [];

    // Create three cow instances with random x-coordinates
    for (let i = 0; i < 3; i++) {
        const randomX = Math.floor(Math.random() * (2220 - 1320 + 1)) + 1200; // Random x-coordinate between 1200 and 2300
        const randomFrameIndex = Math.floor(Math.random() * 5)
        const cow = new classes.Cow({ pos: { x: randomX + background.pos.x, y: 1350 + i * 100 }, image: cowImage, background: background, frameIndex: randomFrameIndex, direction: Math.random() < 0.5 ? 1 : -1 });
        cows.push(cow);
    }

    // create the foreground using the map class
    const foreground = new classes.Map({
        pos: {
            x: offset.x,
            y: offset.y
        },
        image: foregroundImage
    });

    // create the tool image (overlay) using the sprite class
    const tool = new classes.Sprite({
        pos: {
            x: 10,
            y: canvas.height - 70,
        },
        image: toolImage
    })

    // create the seed image (overlay) using the sprite class
    const seed = new classes.Sprite({
        pos: {
            x: 70,
            y: canvas.height - 70,
        },
        image: seedImage
    })

    // initialise the trees and flash objects to be empty lists
    let trees = []
    let flashObjects = []
        
    // Loop through each tile
    for (let i = 0; i < 30; i++) {
        for (let j = 0; j < 7; j++) {
            // Calculate the coordinates of the current tile
            const tileX = player.pos.x + background.pos.x + TILE_SIZE*40 + i * TILE_SIZE;
            const tileY = player.pos.y + background.pos.y + TILE_SIZE*36 + j * TILE_SIZE;
            
            // Generate a random number between 0 and 1 to determine if a tree should be placed and what size
            const chanceOfTree = Math.random();
            const chanceOfSize = Math.random();
            // Determine if a tree should be placed on this tile (10% chance)
            if (chanceOfTree <= 0.1) {
                var tree
                // Determine what size tree should be placed
                if (chanceOfSize <0.4) {
                    tree = new classes.Tree({pos:{x:tileX, y:tileY}, size:"large", image:largeTreeImage});
                    const boundary = new classes.Boundary({
                        pos: { x: tileX + 15, y: tileY +44},
                        width: TILE_SIZE,
                        height: TILE_SIZE
                    });
                    boundaries.push(boundary);
                }
                else{
                    tree = new classes.Tree({pos:{x:tileX, y:tileY}, size:"small", image:smallTreeImage})
                    const boundary = new classes.Boundary({
                        pos: { x: tileX, y: tileY + 50},
                        width: 56,
                        height: 50
                    });
                    boundaries.push(boundary);};
                // Append the tree to the trees list and create apples for it
                trees.push(tree);
                tree.createApples()
            }
        }
    }
    
    function disapearingTrees(Xtiles, Ytiles, widthInTiles, heightInTiles) {
        // Store references to trees and boundaries to remove
        const treesToRemove = [];
        const boundariesToRemove = [];
    
        // Loop through each tile
        for (let i = 0; i < widthInTiles; i++) {
            for (let j = 0; j < heightInTiles; j++) {
                // Calculate the coordinates of the current tile
                const tileX = player.pos.x + background.pos.x + TILE_SIZE * Xtiles + i * TILE_SIZE;
                const tileY = player.pos.y + background.pos.y + TILE_SIZE * Ytiles + j * TILE_SIZE;
    
                // Check if the current tile collides with the player or the chicken
                const collidesWithPlayer = rectangularCollision({ rectangle1: { x: tileX, y: tileY, width: TILE_SIZE, height: TILE_SIZE }, rectangle2: { pos: { x: 554, y: 298 }, width: 128, height: 128 } });
                const collidesWithChicken = rectangularCollision({ rectangle1: { x: tileX, y: tileY, width: TILE_SIZE, height: 128 }, rectangle2: chicken });
    
                // Generate a random number between 0 and 1 to determine if a tree should be placed and what size
                const chanceOfTree = Math.random();
                const chanceOfSize = Math.random();
    
                // Decide if a tree should be placed on this tile (10% chance)
                if (chanceOfTree <= 0.05 && !collidesWithPlayer && !collidesWithChicken) {
                    let tree;
                    let boundary;
                    // Decide what size tree should be placed at random
                    if (chanceOfSize < 0.4) {
                        tree = new classes.Tree({ pos: { x: tileX, y: tileY }, size: "large", image: largeTreeImage });
                        boundary = new classes.Boundary({
                            pos: { x: tileX + 15, y: tileY + 44 },
                            width: TILE_SIZE,
                            height: TILE_SIZE
                        });
                    } else {
                        tree = new classes.Tree({ pos: { x: tileX, y: tileY }, size: "small", image: smallTreeImage });
                        boundary = new classes.Boundary({
                            pos: { x: tileX, y: tileY + 50 },
                            width: 56,
                            height: 50
                        });
                    }
                    // Add trees and boundaries to their respective arrays
                    trees.push(tree);
                    boundaries.push(boundary);
                    tree.createApples();
                    allApples = [];
                    getAllApples();
                    moveables = [...boundaries, background, ...trees, ...allApples, ...soilTiles, chicken, ...cows, merchant, foreground, ...flashObjects];
    
                    // Store references to trees and boundaries for removal
                    treesToRemove.push(tree);
                    boundariesToRemove.push(boundary);
                }
            }
        }
    
        // remove trees and create more trees after 20s
        setTimeout(() => {
            treesToRemove.forEach(tree => {
                const index = trees.indexOf(tree);
                if (index !== -1) {
                    trees.splice(index, 1);
                }
            });
            boundariesToRemove.forEach(boundary => {
                const index = boundaries.indexOf(boundary);
                if (index !== -1) {
                    boundaries.splice(index, 1);

                }
            });
            // Call the function again recursively
            disapearingTrees(Xtiles, Ytiles, widthInTiles, heightInTiles);
        }, 20000);
    }
    
    // function to make image turn white and then dissapear
    function flash(objectType, objectToRemove) {
        let objectToFlash
        // check what the object is so the right image will be flashed
        if(objectType == "apple"){
            objectToFlash = new classes.Sprite({
                pos: { x: objectToRemove.pos.x, y: objectToRemove.pos.y },
                image: whiteAppleImage
        })}
        else if(objectType == "tomato"){
            objectToFlash = new classes.Sprite({
                pos: { x: objectToRemove.pos.x, y: objectToRemove.pos.y },
                image: whiteTomatoImage
        })}
        else if(objectType == "corn"){
            objectToFlash = new classes.Sprite({
                pos: { x: objectToRemove.pos.x, y: objectToRemove.pos.y },
                image: whiteCornImage
        })}
        else if(objectType == "smallTree"){
            objectToFlash = new classes.Sprite({
                pos: { x: objectToRemove.pos.x, y: objectToRemove.pos.y },
                image: whiteSmallTreeImage
        })}
        else if(objectType == "largeTree"){
            objectToFlash = new classes.Sprite({
                pos: { x: objectToRemove.pos.x, y: objectToRemove.pos.y },
                image: whiteLargeTreeImage
        })}
    
        // push the object into the list of objects to flash
        flashObjects.push(objectToFlash);
        moveables = [...boundaries, background, ...trees, ...allApples, ...soilTiles, chicken, ...cows, merchant, foreground, ...flashObjects];
        // remove the object after 0.3 seconds
        setTimeout(() => {
            const index = flashObjects.indexOf(objectToFlash);
            if (index !== -1) {
                flashObjects.splice(index, 1);
                moveables = [...boundaries, background, ...trees, ...allApples, ...soilTiles, chicken, ...cows, merchant, foreground, ...flashObjects];
            }
        }, 300);
    }

    //create a list of all apples
    let allApples = []
    function getAllApples(){
        trees.forEach(function(tree){
            tree.apples.forEach(function(apple){
                allApples.push(apple)
            })})
    }
    getAllApples()

    function hitTree() {
        // Check if the player has the axe selected
        if (player.tool_index === 1) {
            // Loop through each tree to check if the player is near it
            for (const tree of trees) {
                // Calculate the distance between the player and the tree
                const distanceX = Math.abs((player.pos.x+player.image.width/2)- (tree.pos.x + tree.image.width / 2));
                const distanceY = Math.abs((player.pos.y+player.image.height/2) - (tree.pos.y + tree.image.height / 2));
                const distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
    
                // If the player is close enough to the tree, log the tree
                if (distance < TILE_SIZE) {
                    tree.health -= 1
                    // remove apple if present
                    if (tree.apples.length > 0) {
                        player.inventory['apple'] = (player.inventory['apple'] || 0) + 1;
                        const randomIndex = Math.floor(Math.random() * tree.apples.length);
                        const appleToRemove = tree.apples.splice(randomIndex, 1)[0];
                        flash("apple", appleToRemove)}
                        allApples = []
                        getAllApples()
                        // update moveables to reflect removed apple 
                        moveables = [...boundaries, background, ...trees, ...allApples, ...soilTiles, chicken, ...cows, merchant, foreground, ...flashObjects];
                    // if a tree has died then add a wood to inventory and change the image to a stump
                    if (tree.health == 0){
                        player.inventory['wood'] = (player.inventory['wood'] || 0) + 1;
                        if(tree.size == "small"){
                            flash("smallTree", tree)
                            tree.pos.y += 72
                            tree.pos.x += 12
                            tree.image = smallStumpImage
                        }
                        else if(tree.size == "large"){
                            flash("largeTree", tree)
                            tree.pos.y += 80
                            tree.pos.x += 28
                            tree.image = largeStumpImage
                        }
                    }
                    break; // Exit the loop after logging the tree
                }
            }
        }
    }

    function startNewDay() {
        // NIGHT TRANSITION EFFECT
        nightImage.style.display = "block";
        
        // Set initial opacity to 0 for fade in
        nightImage.style.opacity = 0;

        // Fade in the image
        setTimeout(function() {
            // Increase opacity gradually for fade in
            nightImage.style.opacity = 1;

            // Wait for 2 seconds (fade in duration)
            setTimeout(function() {
                // repair trees after fade in
                trees.forEach(tree => {
                    tree.health = 5;
                    if (tree.image == smallStumpImage) {
                        tree.image = smallTreeImage;
                        tree.pos.y -= 72
                        tree.pos.x -= 12
                    } else if (tree.image == largeStumpImage) {
                        tree.image = largeTreeImage;
                        tree.pos.y -= 80
                        tree.pos.x -= 28
                    }
                    tree.apples = [];
                    tree.createApples();
                });

                // repair apples after fade in
                allApples = [];
                trees.forEach(function(tree) {
                    tree.apples.forEach(function(apple) {
                        allApples.push(apple);
                    });
                });

                // update moveables list to reflect the updated trees and apples
                moveables = [...boundaries, background, ...trees, ...allApples, ...soilTiles, chicken, ...cows, merchant, foreground, ...flashObjects];

                // grow any plants which are watered
                soilTiles.forEach(function(soilTile) {
                    if (soilTile.status == "W" && !(soilTile.seedType == null)) {
                        if (soilTile.lifeIndex < 3) {
                            soilTile.lifeIndex += 1;
                        }
                    }
                });

                // chance of rain is recalculated
                raining = chanceOfRain()
                if(raining){
                    createRain()
                    initialSoilStatus = "W"
                    rainAudio.play()}
                else{
                    initialSoilStatus = "X"
                    rainAudio.pause()}
                soilTiles.forEach(function(soilTile){
                    soilTile.status = initialSoilStatus
                })

                // Fade out the image
                nightImage.style.opacity = 0;

                // Wait for 2 seconds (fade out duration)
                setTimeout(function() {
                    // Set display to "none" once fade out is complete
                    nightImage.style.display = "none";
                }, 2000); // 2000 milliseconds = 2 seconds for fade out
            }, 2000); // 2000 milliseconds = 2 seconds after fade in
        }, 0); // No delay for fade in
    }   

    // dictionary of keys
    const keys = {
        d: {
            pressed: false
        },
        a: {
            pressed: false
        },
        w: {
            pressed: false
        },
        s: {
            pressed: false
        },
        q: {
            pressed: false
        }
    };

    // initialisation of list of objects which should be moved when the player "moves"
    let moveables = [...boundaries, background, ...trees, ...allApples, ...soilTiles, chicken, ...cows, merchant, foreground, ...flashObjects];

    // create dissapearing trees
    disapearingTrees(20, 20, 9, 5);
    disapearingTrees(29, 13, 5, 10);
    disapearingTrees(16, 14, 3, 7);
    disapearingTrees(18, 5, 9, 8);

    // function which handles the collisions between 2 objects
    function rectangularCollision({ rectangle1, rectangle2 }) {
        return (
            rectangle1.x < rectangle2.pos.x + rectangle2.width &&
            rectangle1.x + rectangle1.width > rectangle2.pos.x &&
            rectangle1.y < rectangle2.pos.y + rectangle2.height &&
            rectangle1.y + rectangle1.height > rectangle2.pos.y
        );
    }

    // initialise last frame time to be 0
    let lastPlayerFrameTime = 0;
    let lastCowFrameTime = 0;

    // Create arrays which hold images for each direction and tool
    const playerImages = {};

    const directions = ['down', 'up', 'left', 'right'];
    const tools = ['axe', 'hoe', 'water', 'idle'];
    
    const loadPlayerImages = () => {
        directions.forEach(direction => {
            playerImages[direction] = [];
            for (let i = 0; i < 4; i++) {
                const img = new Image();
                img.src = `./graphics/character/${direction}/${i}.png`;
                playerImages[direction].push(img);
            }
        });
    
        tools.forEach(tool => {
            directions.forEach(direction => {
                const toolKey = direction + '_' + tool;
                playerImages[toolKey] = [];
                for (let i = 0; i < 4; i++) {
                    const img = new Image();
                    img.src = `./graphics/character/${direction}_${tool}/${i}.png`;
                    playerImages[toolKey].push(img);
                }
            });
        });
    
        directions.forEach(direction => {
            const idleKey = direction + '_idle';
            playerImages[idleKey] = [];
            for (let i = 0; i < 4; i++) {
                const img = new Image();
                img.src = `./graphics/character/${direction}_idle/${i}.png`;
                playerImages[idleKey].push(img);
            }
        });
    };

    // Call the function to load images
    loadPlayerImages();

    function animatePlayer(timestamp) {
        const deltaTime = timestamp - lastPlayerFrameTime;

        if (player.timers['tool use'].active) {
            // Set the player's status to include direction and tool in use
            player.status = player.direction + "_" + player.tools[player.tool_index];
        }

        // Update the frame index based on deltaTime
        const frameRate = 250;
        if (deltaTime > frameRate) {
            const framesToAdvance = Math.floor(deltaTime / frameRate);
            player.frameIndex += framesToAdvance;
            // Handle frame index limit
            player.frameIndex %= 4;
            lastPlayerFrameTime = timestamp;
        }

        // Determine which images to use based on player's status and tool use timer
        let currentDirectionImages = playerImages[player.status];

        player.image = currentDirectionImages[player.frameIndex];
        
        // Call animatePlayer recursively
        requestAnimationFrame(animatePlayer);
    }

    const cowImages = {
        left: [],
        right: []
    };
    
    // Load cow images 0-4 (left-facing)
    for (let i = 0; i < 5; i++) {
        const imgLeft = new Image();
        imgLeft.src = `./graphics/cow/left/${i}.28.png`;
        // Store each left-facing image in cowImages.left array
        cowImages.left.push(imgLeft);
    }
    
    // Load cow images 0-4 (right-facing)
    for (let i = 0; i < 5; i++) {
        const imgRight = new Image();
        imgRight.src = `./graphics/cow/right/${i}.28.png`;
        // Store each right-facing image in cowImages.right array
        cowImages.right.push(imgRight);
    }

    // function which moves the player along with the cow
    function movePlayerWithCow() {
        cows.forEach(cow => {
            const cowBoundary = {
                pos: {
                    x: cow.pos.x,
                    y: cow.pos.y
                },
                width: cowImage.width,
                height: cowImage.height
            };
            // Check for collision between player and cow
            if (rectangularCollision({ rectangle1: player.hitbox, rectangle2: cowBoundary })) {
                if (cow.direction === -1) {
                    moveables.forEach(moveable => {
                        moveable.pos.x += cow.speed;
                    });
                } else {
                    moveables.forEach(moveable => {
                        moveable.pos.x -= cow.speed;
                    });
                }
            }
        });
    }

    // cow walking animation
    function animateCow(timestamp) {
        const deltaTime = timestamp - lastCowFrameTime;
        // Update the frame index based on deltaTime
        const frameRate = 250;
        if (deltaTime > frameRate) {
            const framesToAdvance = Math.floor(deltaTime / frameRate);
            cows.forEach( cow => {
                cow.frameIndex += framesToAdvance;
    
                // Handle frame index limit
                cow.frameIndex %= 5;})
    
            lastCowFrameTime = timestamp;
        }
    
        // Set the cow image based on cow speed
        cows.forEach( cow => {
            if (cow.direction === 1) {
                cow.image = cowImages.right[cow.frameIndex];
            } else {
                cow.image = cowImages.left[cow.frameIndex];
            }

            try{cowBoundary.pos.x = cow.pos.x;
            cowBoundary.pos.y = cow.pos.y;}
            catch{}
        })

        movePlayerWithCow()
        // call recursively for a loop
        requestAnimationFrame(animateCow);
    }
    

    // functions to check collisions in all directions between player and boundaries
    function checkUpCollision(boundary) {
        return (
            rectangularCollision({
                rectangle1: player.hitbox,
                rectangle2: { ...boundary, pos: { x: boundary.pos.x, y: boundary.pos.y + MOVEMENT_speed } }
            })
        );
    }

    function checkDownCollision(boundary) {
        return (
            rectangularCollision({
                rectangle1: player.hitbox,
                rectangle2: { ...boundary, pos: { x: boundary.pos.x, y: boundary.pos.y - MOVEMENT_speed } }
            })
        );
    }

    function checkRightCollision(boundary) {
        return (
            rectangularCollision({
                rectangle1: player.hitbox,
                rectangle2: { ...boundary, pos: { x: boundary.pos.x - MOVEMENT_speed, y: boundary.pos.y } }
            })
        );
    }

    function checkLeftCollision(boundary) {
        return (
            rectangularCollision({
                rectangle1: player.hitbox,
                rectangle2: { ...boundary, pos: { x: boundary.pos.x + MOVEMENT_speed, y: boundary.pos.y } }
            })
        );
    }

    function move() {
        // handle player movement on key inputs (wasd)
        let moving = true;
        if (keys.w.pressed) {
            player.direction = 'up';
            player.status = 'up';
            for (let i = 0; i < boundaries.length; i++) {
                const boundary = boundaries[i];
                if (checkUpCollision(boundary)) {
                    moving = false;
                    break;
                }
            }

            if (moving) {
                moveables.forEach((moveable) => {
                    moveable.pos.y += MOVEMENT_speed;
                });
            }
        }

        if (keys.s.pressed) {
            player.direction = 'down';
            player.status = 'down';
            for (let i = 0; i < boundaries.length; i++) {
                const boundary = boundaries[i];
                if (checkDownCollision(boundary)) {
                    moving = false;
                    break;
                }
            }

            if (moving) {
                moveables.forEach((moveable) => {
                    moveable.pos.y -= MOVEMENT_speed;
                });
            }
        }

        if (keys.d.pressed) {
            player.direction = 'right';
            player.status = 'right';
            for (let i = 0; i < boundaries.length; i++) {
                const boundary = boundaries[i];
                if (checkRightCollision(boundary)) {
                    moving = false;
                    break;
                }
            }

            if (moving) {
                moveables.forEach((moveable) => {
                    moveable.pos.x -= MOVEMENT_speed;
                });
            }
        }

        if (keys.a.pressed) {
            player.direction = 'left';
            player.status = 'left';
            for (let i = 0; i < boundaries.length; i++) {
                const boundary = boundaries[i];
                if (checkLeftCollision(boundary)) {
                    moving = false;
                    break;
                }
            }

            if (moving) {
                moveables.forEach((moveable) => {
                    moveable.pos.x += MOVEMENT_speed;
                });
            }
        }

        // if no keys are pressed make sure the status is idle
        else if (keys.w.pressed === false &&
            keys.a.pressed === false &&
            keys.s.pressed === false &&
            keys.d.pressed === false &&
            player.status.endsWith('_idle') === false) {
            player.status = player.direction + '_idle';
            player.frameIndex = 0;
        }
        
    }

    function keydownListener(e) {
        switch (e.key) {
            case 'd':
                keys.d.pressed = true;
                break;
            case 'a':
                keys.a.pressed = true;
                break;
            case 'w':
                keys.w.pressed = true;
                break;
            case 's':
                keys.s.pressed = true;
                break;
            case 'q':
                if (!player.timers['tool switch'].active) {
                    player.tool_index = (player.tool_index + 1) % player.tools.length;
                    toolImage.src = './graphics/overlay/' + player.tools[player.tool_index] + '.png';
                    player.timers['tool switch'].activate();
                }
                break;
            case 'e':
                if (!player.timers['seed switch'].active) {
                    player.seed_index = (player.seed_index + 1) % player.seeds.length;
                    seedImage.src = './graphics/overlay/' + player.seeds[player.seed_index] + '.png';
                    player.timers['seed switch'].activate();
                }
                break;
            case 'p':
                if (!player.timers['tool use'].active) {
                    player.timers['tool use'].activate();
                    player.frameIndex = 0;
                    if (player.tools[player.tool_index] === "hoe") {
                        hoeAudio.play();
                        createNewSoilTile();
                        moveables = [...boundaries, background, ...soilTiles, ...trees, ...allApples, chicken, ...cows, merchant, foreground];
                    }
                    if (player.tools[player.tool_index] === "water") {
                        waterAudio.play();
                        changeSoilWaterStatus();
                        drawMud();
                    }
                    if (player.tools[player.tool_index] === "axe") {
                        axeAudio.play();
                        hitTree();
                    }
                }
                break;
            case 'o':
                if (!player.timers['seed use'].active) {
                    plantAudio.play();
                    plantSeed();
                    player.timers['seed use'].activate();
                }
                break;
            case 'n':
                if (!player.timers['new day'].active) {
                    startNewDay();
                    player.timers['new day'].activate();
                }
                break;
        }
    }

    // Define the keyup event listener function
    function keyupListener(e) {
        switch (e.key) {
            case 'd':
                keys.d.pressed = false;
                break;
            case 'a':
                keys.a.pressed = false;
                break;
            case 'w':
                keys.w.pressed = false;
                break;
            case 's':
                keys.s.pressed = false;
                break;
        }
    }

    window.addEventListener('keydown', keydownListener);
    window.addEventListener('keyup', keyupListener);

// S O I L functions
    // check if a soil tile exists at a specific coordinate
    function doesSoilTileExist(x, y) {
        for (const soilTile of soilTiles) {
            if (soilTile.pos.x === x && soilTile.pos.y === y) {
                return true; // Soil tile exists at this position
            }
        }
        return false; // Soil tile does not exist at this position
    }

    // checks existence of soil tiles above below left and right
    function getNeighborTiles(x, y) {
        const t = doesSoilTileExist(x, y - TILE_SIZE);
        const r = doesSoilTileExist(x + TILE_SIZE, y);
        const b = doesSoilTileExist(x, y + TILE_SIZE);
        const l = doesSoilTileExist(x - TILE_SIZE, y);
        return {t, r, b, l};
    }

    // function which changes soil images so that soil tiles which are next to each other "join together"
    function changeSoilImage(t, b, l, r) {
            let soilTileImage = ''
            // all sides
            if (t && r && b && l) soilTileImage = xImage;

            // horizontal tiles only
            if (l && !t && !r && !b) soilTileImage = rImage;
            if (r && !t && !l && !b) soilTileImage = lImage;
            if (r && l && !t && !b) soilTileImage = lrImage;
    
            // vertical only
            if (t && !r && !l && !b) soilTileImage = bImage;
            if (b && !r && !l && !t) soilTileImage = tImage;
            if (b && t && !r && !l) soilTileImage = tbImage;
    
            // corners
            if (l && b && !t && !r) soilTileImage = trImage;
            if (r && b && !t && !l) soilTileImage = tlImage;
            if (l && t && !b && !r) soilTileImage = brImage;
            if (r && t && !b && !l) soilTileImage = blImage;
    
            // T shapes
            if (t && b && r && !l) soilTileImage = tbrImage;
            if (t && b && l && !r) soilTileImage = tblImage;
            if (l && r && t && !b) soilTileImage = lrbImage;
            if (l && r && b && !t) soilTileImage = lrtImage;

            // alone
            if (!l && !r && !b && !t) soilTileImage = soilImage;
            return soilTileImage
    }

    // function to draw the mud that appears on watered soil tiles
    function drawMud() {
        for (const soilTile of soilTiles) {
            if(soilTile.status == "W"){c.drawImage(wateredSoil, soilTile.pos.x, soilTile.pos.y)
        }}
    }

    // function to create a new soil tile
    function createNewSoilTile() {
        const toolOffset = {'left': {x: 55, y:TILE_SIZE},
        'right': {x: 55, y:TILE_SIZE},
        'up': {x: 55, y:TILE_SIZE},
        'down': {x: 55, y:128}}
        // rounded values to make sure soil lines up with tile size
        const roundedX = player.pos.x + toolOffset[player.direction].x+ background.pos.x%TILE_SIZE
        const roundedY = player.pos.y + toolOffset[player.direction].y + background.pos.y%TILE_SIZE
        const soilTileExists = doesSoilTileExist(roundedX, roundedY) //check for a soil tile in that position
        if (!soilTileExists){ // if there's no soil tile there, create one
            soilTiles.push(new classes.SoilTile({
                pos: {
                    x: roundedX,
                    y: roundedY
                },
                image: soilImage,
                status: initialSoilStatus
            }));
            for (const soilTile of soilTiles) {
                const {t, r, b, l} = getNeighborTiles(soilTile.pos.x, soilTile.pos.y)
                soilTile.image = changeSoilImage(t,b,l,r) // change the image so that soil tiles join up
            }
            moveables = [...boundaries, background, ...trees, ...allApples, ...soilTiles, chicken, ...cows, merchant, foreground, ...flashObjects];
        }
    }

    // function to update the status of a soil tile
    function changeSoilWaterStatus() {
        const toolOffset = {
            'left': { x: 55, y: TILE_SIZE },
            'right': { x: 55, y: TILE_SIZE },
            'up': { x: 55, y: TILE_SIZE },
            'down': { x: 55, y: 128 }
        }; // dictionary to offset the tool from the player's position

        // rounded values to up with tile size since soil tiles cant be anywhere else
        const roundedX = player.pos.x + toolOffset[player.direction].x + background.pos.x % TILE_SIZE;
        const roundedY = player.pos.y + toolOffset[player.direction].y + background.pos.y % TILE_SIZE;
        const soilTileExists = doesSoilTileExist(roundedX, roundedY);
    
        // Check if a soil tile exists at the calculated position
        if (soilTileExists) {
            // If a soil tile exists, change its status to "W" (watered)
            for (const soilTile of soilTiles) {
                if (soilTile.pos.x === roundedX && soilTile.pos.y === roundedY) {
                    soilTile.status = "W";
                    break; // Once the status is updated, exit the loop
                }
            }
        }
    }

    // function to plant a seed
    function plantSeed(){
        const toolOffset = {
            'left': { x: 55, y: TILE_SIZE },
            'right': { x: 55, y: TILE_SIZE },
            'up': { x: 55, y: TILE_SIZE },
            'down': { x: 55, y: 128 }
        };

        // rounded values to up with tile size since soil tiles cant be anywhere else
        const roundedX = player.pos.x + toolOffset[player.direction].x + background.pos.x % TILE_SIZE;
        const roundedY = player.pos.y + toolOffset[player.direction].y + background.pos.y % TILE_SIZE;
        const soilTileExists = doesSoilTileExist(roundedX, roundedY);
    
        // Check if a soil tile exists at the calculated position
        if (soilTileExists) {
            // If a soil tile exists, change its status to "W" (watered)
            for (const soilTile of soilTiles) {
                if (soilTile.pos.x === roundedX && soilTile.pos.y === roundedY) {
                    if(soilTile.seedType == null){
                        soilTile.seedType = player.seeds[player.seed_index]
                        soilTile.seedType = player.seeds[player.seed_index]
                        soilTile.SeedIndex = 0
                    }
                    break; // Once the status is updated, exit the loop
                }
            }
        }
    }
    
    // Function to display all plants
    function displayPlants() {
        for (const soilTile of soilTiles) {
            if(soilTile.seedType == "corn"){c.drawImage(cornImages[soilTile.lifeIndex], soilTile.pos.x, soilTile.pos.y)}
            if(soilTile.seedType == "tomato"){c.drawImage(tomatoImages[soilTile.lifeIndex], soilTile.pos.x, soilTile.pos.y)}
        }
    }                                                                                                                                                  

    // Funcitons to harvest a plant
    function harvestPlant() {
        // check all soil tiles
        for (const soilTile of soilTiles) {
            // Check if the player collides with a soil tile
            if (rectangularCollision({
                    rectangle1: player.hitbox,
                    rectangle2: {
                        pos: soilTile.pos,
                        width: TILE_SIZE,
                        height: TILE_SIZE
                    }
                })) {
                // Check if the soil tile has a plant with lifeIndex 3 (which is the last stage of growth)
                if (soilTile.lifeIndex === 3) {
                    // Harvest the plant
                    if(soilTile.seedType=="tomato"){
                        flash("tomato", soilTile)}
                    else if(soilTile.seedType=="corn"){
                        flash("corn", soilTile)}
                    // Update moveables list so that the removed harvested plant is no longer drawn
                    moveables = [...boundaries, background, ...trees, ...allApples, ...soilTiles, chicken, ...cows, merchant, foreground, ...flashObjects];
                    soilTile.lifeIndex = 0; // Reset lifeIndex
                    player.inventory[soilTile.seedType]++;
                    soilTile.seedType = null // No seed type after harvesting
                }
            }
        }
    }

    // loading display while waiting for game to load
    background.image.onload = () => {
        document.getElementById('loading-screen').style.display = 'none'}

    // this loop will continually execute to make sure the screen is always up to date
    function update() {
    
        // Clear the canvas
        c.clearRect(0, 0, canvas.width, canvas.height);
    
        // move the player
        move();
        // move the chicken
        chicken.update(boundaries);
        // move the cow
        cows.forEach(cow => {
            cow.move()
        })
        // Draw all images which are moved when the player moves
        moveables.forEach(moveable => {
            moveable.draw();
        });

        // Functions relating to soil/plants
        drawMud(); // Draws mud on the soil tiles
        harvestPlant(); // Checks for plant being harvested
        displayPlants(); // Draws any plants on their corresponding soil tile
    
        // Draw the player after the moveables so it is at the front
        chicken.draw();
        cows.forEach(cow => {
            cow.draw()
        })
        player.draw();
        // Draw/redraw all images which are "on top" of the player
        // Draw foreground
        foreground.draw();

        // Draw all trees
        trees.forEach(tree => {
            tree.draw();
        });
    
        // Draw all apples
        allApples.forEach(apple => {
            apple.draw();
        });

        // Draw any "flashes" (image turning white before dissapearing)
        flashObjects.forEach(flashObject => {
            flashObject.draw()
        })
        
        // Draw the top 1/2 of the player image for visual effect
        c.drawImage(player.image, 0, 0, player.image.width, player.image.height / 1.8, player.pos.x, player.pos.y, player.image.width, player.image.height / 1.8);

        //draw rain if its raining
        if(raining){updateRain()};
    
        //overlay
        c.drawImage(toolImage, tool.pos.x, tool.pos.y);
        c.drawImage(seedImage, seed.pos.x, seed.pos.y);
    
        // make sure that updates are relative to how much time has passed since last update
        requestAnimationFrame((timestamp) => {
            update(timestamp);
            animatePlayer(timestamp);
            cows.forEach(cow => {
                animateCow(timestamp, cow)
            })
            
        });
    }
    
    // Use requestAnimationFrame to start the game loop
    requestAnimationFrame(update);
};