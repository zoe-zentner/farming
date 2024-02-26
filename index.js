//imports
import * as classes from './classes.js';
import * as sorting from './sorting.js';
import * as searching from './searching.js';

//menu button event listeners
document.getElementById('playButton').addEventListener('click', startGame);

document.getElementById('quitButton').addEventListener('click', function() {
    window.close();
});

document.getElementById('menuSettingsButton').addEventListener('click', settingsfunction);

document.getElementById('instructionsButton').addEventListener('click', instructionsDisplay);

document.getElementById('scoresButton').addEventListener('click', scoresDisplay);

function scoresDisplay() {
    // Clear existing content on the page
    document.body.innerHTML = '';

    // Set background color to beige
    document.body.style.backgroundColor = 'beige';

    // Create container for the buttons
    const container = document.createElement('div');
    container.classList.add('container'); // Apply container class
    document.body.appendChild(container);

    //create back button
    const backButton = createBackButton();
    document.body.appendChild(backButton)
    document.getElementById('backButton').addEventListener('click', function() {
        window.location.reload();})

    // Create leaderboard text
    const leaderboardText = document.createElement('div');
    leaderboardText.textContent = 'Leaderboard:';
    leaderboardText.style.fontFamily = 'LycheeSoda';
    leaderboardText.style.fontSize = '60px';
    leaderboardText.style.color = '#522915';
    leaderboardText.style.position = 'relative';
    leaderboardText.style.top = '20px';
    leaderboardText.style.left = '520px';
    container.appendChild(leaderboardText);

    // Create button elements with btn class applied
    const nameButton = createToggleButton('Name', container);
    const scoreButton = createToggleButton('Score', container);
    const ascendingButton = createToggleButton('Ascending', container);
    const descendingButton = createToggleButton('Descending', container);

    // Function to create a toggle button
    function createToggleButton(text, container) {
        const button = document.createElement('button');
        button.textContent = text;
        button.classList.add('btn'); // Apply btn class
        button.style.left = '300'
        button.style.top = `${100 + container.children.length * 100}px`; // Adjust top position based on existing buttons
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
        
        const scoreIsActive = scoreButton.classList.contains('active');
        const ascendingIsActive = ascendingButton.classList.contains('active');
        const nameIsActive = nameButton.classList.contains('active');
        const descendingIsActive = descendingButton.classList.contains('active');

        let sortedData;
        if (scoreIsActive && ascendingIsActive) {
            // Call the sorting function when both buttons are active
            sortedData = sorting.sortByScoresAscending();
            displayLeaderboard(container, sortedData);
        }
        else if (scoreIsActive && descendingIsActive) {
            // Call the sorting function when both buttons are active
            sortedData = sorting.sortByScoresDescending();
            displayLeaderboard(container, sortedData);
        }
        else if (nameIsActive && ascendingIsActive) {
            // Call the sorting function when both buttons are active
            sortedData = sorting.sortByNamesAscending();
            displayLeaderboard(container, sortedData);
        }
        else if (nameIsActive && descendingIsActive) {
            // Call the sorting function when both buttons are active
            sortedData = sorting.sortByNamesDescending();
            displayLeaderboard(container, sortedData);
        }
    }
}


function displayLeaderboard(container, sortedData) {

    // Set background color to beige
    document.body.style.backgroundColor = 'beige';

    //format the sorted data
    const formattedData = sortedData.map(entry => {
        const name = entry.name.padEnd(13); // Ensure name is at least 8 characters long
        const score = entry.score;
        return `${name}${score}`;
    }).join('\n');

    const header = 'Name:        Score:\n'; // Adjust the spacing as needed
    const dataWithHeaders = header + formattedData;
    // Create textarea element
    const textarea = document.createElement('textarea');
    textarea.textContent = dataWithHeaders
    // sortedData.forEach(entry => {
    //     textarea.textContent += formattedData;
    // });
    textarea.style.fontFamily = 'joystix';
    textarea.style.backgroundColor = '#92814d';
    textarea.style.fontSize = '25px';
    textarea.style.paddingLeft = '10px';
    textarea.style.lineHeight = '2';
    textarea.style.color = 'white';
    textarea.style.width = '440px';
    textarea.style.height = '400px';
    textarea.style.maxheight = '400px';
    textarea.style.overflowY = 'auto';
    textarea.style.resize = 'none'; // Disable textarea resize
    textarea.readOnly = true; // Make the textarea read-only
    textarea.style.position = 'absolute';
    textarea.style.top = '150px';
    textarea.style.left = '600px';

    container.appendChild(textarea);

}

//audio 
let audio = new Audio();
audio.src = './audio/music.mp3';
// Enable looping
audio.loop = true;

function playAudio() {
    const musicButton = document.getElementById('musicButton');
    
    if (audio.paused) {
        const playbackPosition = localStorage.getItem('playbackPosition');
        if (playbackPosition) {
            audio.currentTime = parseFloat(playbackPosition);
        }
        audio.play();
        musicButton.classList.add('active');
        localStorage.setItem('musicState', 'playing'); // Save state as playing
    } else {
        localStorage.setItem('playbackPosition', audio.currentTime);
        audio.pause();
        musicButton.classList.remove('active');
        localStorage.setItem('musicState', 'paused'); // Save state as paused
    }
}

// Save playback position and state before unloading the page
window.onbeforeunload = function() {
    localStorage.setItem('playbackPosition', audio.currentTime);
};

// Check if music was playing before the page was reloaded and resume playback
window.onload = function() {
    const musicButton = document.getElementById('musicButton');
    const musicState = localStorage.getItem('musicState');
    try{
        if (musicState === 'playing') {
        const playbackPosition = localStorage.getItem('playbackPosition');
        if (playbackPosition) {
            audio.currentTime = parseFloat(playbackPosition);
        }
        audio.play();
        musicButton.classList.add('active')
    } else {
        musicButton.classList.remove('active');
    }}
    catch {}
};

//button responses
function createBackButton(){
    const backButton = document.createElement('button');
    backButton.textContent = '⇦';
    backButton.style.fontFamily = 'LycheeSoda';
    backButton.style.fontSize = '60px';
    backButton.style.color = '#522915';
    backButton.classList.add('btn');
    backButton.style.position = 'absolute';
    backButton.style.top = '20px';
    backButton.style.left = '20px';
    backButton.id = "backButton";
    return backButton;
}

function createMusicButton() {
    const musicButton = document.createElement('button');
    musicButton.textContent = 'Music';
    musicButton.style.fontFamily = 'LycheeSoda';
    musicButton.style.fontSize = '60px';
    musicButton.style.color = '#522915';
    musicButton.classList.add('btn');
    musicButton.style.position = 'absolute';
    musicButton.style.top = '300px';
    musicButton.style.left = '600px';
    musicButton.id = "musicButton";
    return musicButton;
}

function instructionsDisplay() {
    const container = this.parentElement;
    container.remove();
    const instructionsText = document.createElement('div');
    instructionsText.textContent = 'how to play: ';
    instructionsText.style.fontFamily = 'LycheeSoda';
    instructionsText.style.fontSize = '60px';
    instructionsText.style.color = '#522915';
    instructionsText.style.position = 'fixed';
    instructionsText.style.top = '20px';
    instructionsText.style.left = '535px';

    document.body.appendChild(instructionsText);
    document.body.style.backgroundColor = 'beige';

    const playerMovementText = document.createElement('div');
    playerMovementText.textContent = 'Player Movement';
    playerMovementText.style.fontFamily = 'LycheeSoda';
    playerMovementText.style.fontSize = '24px';
    playerMovementText.style.color = '#522915';
    playerMovementText.style.position = 'fixed';
    playerMovementText.style.top = '200px'; // Adjust top position as needed
    playerMovementText.style.left = '550px'; // Adjust left position as needed
    document.body.appendChild(playerMovementText);

    const wasdImage = document.createElement('img');
    wasdImage.src = './graphics/buttons/wasd.png'; // Set the actual path to your image
    wasdImage.style.position = 'fixed';
    wasdImage.style.left = '540px';
    wasdImage.style.top = '250px';
    document.body.appendChild(wasdImage);

    const backButton = createBackButton();
    document.body.appendChild(backButton)
    document.getElementById('backButton').addEventListener('click', function() {
        window.location.reload();
    });
}

function settingsfunction() {
    const container = this.parentElement;
    container.remove();
    document.body.style.backgroundColor = 'beige';
    const toggleButton = document.getElementById('toggleButton');
    const settingsText = document.createElement('div');
    settingsText.textContent = 'settings: ';
    settingsText.style.fontFamily = 'LycheeSoda';
    settingsText.style.fontSize = '60px';
    settingsText.style.color = '#522915';
    settingsText.style.position = 'fixed';
    settingsText.style.top = '20px';
    settingsText.style.left = '570px';

    document.body.appendChild(settingsText);

    const musicButton = createMusicButton();
    document.body.appendChild(musicButton)
    document.getElementById('musicButton').addEventListener('click', playAudio)

    const backButton = createBackButton();
    document.body.appendChild(backButton)
    document.getElementById('backButton').addEventListener('click', function() {
        window.location.reload();
    });

}

function startGame() {
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
    function createEndGameButton(){
        const endGameButton = document.createElement('button');
        endGameButton.textContent = 'end game';
        endGameButton.style.fontFamily = 'LycheeSoda';
        endGameButton.style.fontSize = '20px';
        endGameButton.style.color = '#522915';
        endGameButton.classList.add('btn');
        endGameButton.style.position = 'relative';
        endGameButton.style.bottom = '30px';
        endGameButton.style.right = '130px';
        endGameButton.id = "endGameButton";
        return endGameButton;
    }

    // display score 
    function displayScore(score) {
        const scoreBox = document.createElement('div');
        scoreBox.style.fontFamily = 'LycheeSoda';
        scoreBox.style.backgroundColor = "beige"
        scoreBox.textContent = 'Score: ' + score;
        scoreBox.style.position = 'absolute';
        scoreBox.style.top = '20px';
        scoreBox.style.left = '20px';
        scoreBox.style.color = '#522915';
        scoreBox.style.fontSize = '40px';
    
        document.body.appendChild(scoreBox);
    }
    

    // G L O B A L constants and variables
    let score = 0;
    const container = this.parentElement;
    container.remove();

    const MOVEMENT_speed = 5;

    const canvas = document.querySelector('canvas');
    const c = canvas.getContext('2d');

    canvas.width = 1280;
    canvas.height = 720;
    let initialSoilStatus = "X"

    var vRain;
    
    // END GAME protocol
    function endGame() {
        // Access the global score variable here
        const playerScore = score; // Use the global score variable
    
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.top = '50%';
        container.style.left = '50%';
        container.style.transform = 'translate(-50%, -50%)';
        container.style.backgroundColor = '#93cfc3'; 
        container.style.padding = '20px';
        container.style.opacity = '0.9';
    
        const nameLabel = document.createElement('label');
        nameLabel.textContent = 'Name: ';
        nameLabel.style.fontFamily = 'LycheeSoda';
        nameLabel.style.fontSize = '40px';
    
        const nameInput = document.createElement('input');
        nameInput.setAttribute('type', 'text');
        nameInput.setAttribute('maxlength', '7');
        nameInput.style.marginLeft = '5px';
        nameInput.style.width = '300px'; 
        nameInput.style.height = '40px';
        nameInput.style.fontSize = '24px';
        nameInput.style.fontFamily = 'LycheeSoda';
    
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
    function chanceOfRain() {
        let raining = false;
        let number = Math.floor(Math.random() * 100) + 1;
        if (number >= 30) {
            raining = true;
        } else {
            raining = false
        }
        return raining;
    }

    function updateRain() {
        if(vRain){
            for (var i = 0; i < vRain.length; i++) {
                vRain[i].show(canvas, c);
                vRain[i].fall(canvas, c);
            }
        }
    }

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
        setInterval(function() {
            updateRain();
        }, 10);
    }
    
    let raining = chanceOfRain();
    if(raining){
        createRain()
        initialSoilStatus = "W"}
    else{initialSoilStatus = "X"}

    const collisionsMap = [];
    for (let i = 0; i < collisions.length; i += 90) {
        collisionsMap.push(collisions.slice(i, i + 90));
    }

    const offset = {
        x: -1800,
        y: -1300
    };

    const boundaries = [];

    collisionsMap.forEach((row, i) => {
        row.forEach((symbol, j) => {
            if (symbol === 267) {
                boundaries.push(
                    new classes.Boundary({
                        pos: {
                            x: j * 64 + offset.x,
                            y: i * 64 + offset.y
                        },
                        width: 64,
                        height: 64
                    })
                );
            } else if (symbol === 268) {
                boundaries.push(
                    new classes.Boundary({
                        pos: {
                            x: j * 64 + offset.x + 32,
                            y: i * 64 + offset.y
                        },
                        width: 32,
                        height: 64
                    })
                );
            } else if (symbol === 269) {
                boundaries.push(
                    new classes.Boundary({
                        pos: {
                            x: j * 64 + offset.x,
                            y: i * 64 + offset.y
                        },
                        width: 32,
                        height: 64
                    })
                );
            } else if (symbol === 270) {
                boundaries.push(
                    new classes.Boundary({
                        pos: {
                            x: j * 64 + offset.x,
                            y: i * 64 + offset.y + 32
                        },
                        width: 64,
                        height: 32
                    })
                );
            }
        });
    });

    c.fillRect(0, 0, canvas.width, canvas.height);

    let soilTiles = [];

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
        container.className = 'inventory-container'; // Add a class name for easier reference
        container.style.position = 'absolute';
        container.style.top = '50%';
        container.style.left = '50%';
        container.style.transform = 'translate(-50%, -50%)';
        container.style.padding = '50px 100px'; // Adjust padding to make it less tall and wider
        container.style.width = '400px'; // Make the box wider
        container.style.backgroundColor = '#f7f2d5';
        container.style.maxHeight = '80%';
        container.style.border = '2px solid black';
        container.style.fontFamily = 'LycheeSoda'; // Apply Lychee Soda font
        container.style.textAlign = 'center'; // Center text
        container.style.fontSize = '24px'; // Set font size
        container.style.color = '#522915';
    
        // Populate the container with text displaying the player's inventory
        const inventoryText = document.createElement('p');
        inventoryText.textContent = 'Player Inventory:';
        inventoryText.style.marginBottom = '20px'; // Add some space between inventory title and items
        inventoryText.style.fontSize = '50px'; // Set font size for title
        inventoryText.style.marginTop = '0'; 
        container.appendChild(inventoryText);
    
        // Loop through player's inventory and add items to the container
        for (const [item, quantity] of Object.entries(player.inventory)) {
            const itemContainer = document.createElement('div');
            itemContainer.style.display = 'flex'; // Display items in a row
            itemContainer.style.justifyContent = 'space-between'; // Space out items and prices

            // Create a paragraph element for item and quantity
            const itemText = document.createElement('p');
            itemText.textContent = `${item}: ${quantity}`;
            itemText.style.fontSize = '32px'; // Set font size for inventory items
            itemText.style.textAlign = 'left';
            itemText.style.paddingLeft = '25px';

            // Create a paragraph element for price
            const priceText = document.createElement('p');
            priceText.textContent = `price: ${SALE_PRICES[item]}`;
            priceText.style.textAlign = 'right';
            priceText.style.fontSize = '32px'; // Set font size for inventory items
            priceText.style.paddingRight = '25px';

            // Append item and price to the item container
            itemContainer.appendChild(itemText);
            itemContainer.appendChild(priceText);

            // Append the item container to the main container
            container.appendChild(itemContainer);
        }


    
        // Create a "Sell All" button
        const sellAllButton = document.createElement('button');
        sellAllButton.textContent = 'Sell All';
        sellAllButton.style.marginTop = '20px'; // Add more space between inventory items and buttons
        sellAllButton.style.fontSize = '20px';
        sellAllButton.style.marginRight = '40px'; // Add more space between buttons
        sellAllButton.style.fontFamily = 'LycheeSoda'; // Apply Lychee Soda font
        sellAllButton.style.padding = '10px 20px'; // Increase button size
        sellAllButton.addEventListener('click', sellAllItems); // Add event listener to handle selling all items
        container.appendChild(sellAllButton);
    
        // Create a "Close Inventory" button
        const closeInventoryButton = document.createElement('button');
        closeInventoryButton.textContent = 'Close Inventory';
        closeInventoryButton.style.fontSize = '20px';
        closeInventoryButton.style.marginTop = '20px'; // Add more space between inventory items and buttons
        closeInventoryButton.style.fontFamily = 'LycheeSoda'; // Apply Lychee Soda font
        closeInventoryButton.style.padding = '10px 20px'; // Increase button size
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
        // Set player inventory to 0

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
    
    function updateDisplayedInventory() {
        // Remove the existing inventory container
        const existingInventoryContainer = document.querySelector('.inventory-container');
        if (existingInventoryContainer) {
            document.body.removeChild(existingInventoryContainer);
        }
        // Re-create the inventory display
        merchantInteraction();
    }

    canvas.addEventListener('click', function(event) {
        // Get the mouse position relative to the canvas
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
    
        // Check if the mouse click occurred within the bounding box of the merchant
        if (mouseX >= merchant.pos.x && mouseX <= merchant.pos.x + merchantImage.width &&
            mouseY >= merchant.pos.y && mouseY <= merchant.pos.y + merchantImage.height) {
            merchantInteraction();
        }
    });

    const player = new classes.Player({
        pos: {
            x: canvas.width / 2 - 86,
            y: canvas.height / 2 - 62
        },
        image: playerImage,
        status: 'down_idle'
    });

    const chicken = new classes.Chicken({
        pos: {
            x: canvas.width / 2 - 186,
            y: canvas.height / 2 - 182
        },
        image: chickenImage, // Provide the image for the chicken
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

    const background = new classes.Map({
        pos: {
            x: offset.x,
            y: offset.y
        },
        image: mapImage
    });

    const foreground = new classes.Map({
        pos: {
            x: offset.x,
            y: offset.y
        },
        image: foregroundImage
    });

    const tool = new classes.Sprite({
        pos: {
            x: 10,
            y: canvas.height - 70,
        },
        image: toolImage
    })

    const seed = new classes.Sprite({
        pos: {
            x: 70,
            y: canvas.height - 70,
        },
        image: seedImage
    })

    let trees = []
    let flashObjects = []
        
        // Loop through each tile
        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 10; j++) {
                // Calculate the coordinates of the current tile
                const tileX = player.pos.x + background.pos.x + 64*20 + i * 64;
                const tileY = player.pos.y + background.pos.y + 64*16 + j * 64;
                
                // Generate a random number between 0 and 1
                const chanceOfTree = Math.random();
                const chanceOfSize = Math.random();
                // Determine if a tree should be placed on this tile (10% chance)
                if (chanceOfTree <= 0.1) {
                    var tree
                    if (chanceOfSize <0.4) {
                        tree = new classes.Tree({pos:{x:tileX, y:tileY}, size:"large", image:largeTreeImage});
                        const boundary = new classes.Boundary({
                            pos: { x: tileX + 15, y: tileY +44},
                            width: 64,
                            height: 64
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
                    // Append the tree to the trees list
                    trees.push(tree);
                    tree.createApples()
                }
            }
        }

    function flash(objectType, objectToRemove) {
        let objectToFlash
        if(objectType == "apple"){
            console.log("apple flash")
            objectToFlash = new classes.Sprite({
                pos: { x: objectToRemove.pos.x, y: objectToRemove.pos.y },
                image: whiteAppleImage
        })}
        else if(objectType == "tomato"){
            console.log("tomato flash")
            objectToFlash = new classes.Sprite({
                pos: { x: objectToRemove.pos.x, y: objectToRemove.pos.y },
                image: whiteTomatoImage
        })}
        else if(objectType == "corn"){
            console.log("corn flash")
            objectToFlash = new classes.Sprite({
                pos: { x: objectToRemove.pos.x, y: objectToRemove.pos.y },
                image: whiteCornImage
        })}
        else if(objectType == "smallTree"){
            console.log("small tree flash")
            objectToFlash = new classes.Sprite({
                pos: { x: objectToRemove.pos.x, y: objectToRemove.pos.y },
                image: whiteSmallTreeImage
        })}
        else if(objectType == "largeTree"){
            console.log("large tree flash")
            objectToFlash = new classes.Sprite({
                pos: { x: objectToRemove.pos.x, y: objectToRemove.pos.y },
                image: whiteLargeTreeImage
        })}
    
        // Add the new apple to the list of all apples
        flashObjects.push(objectToFlash);
        setTimeout(() => {
            const index = flashObjects.indexOf(objectToFlash);
            if (index !== -1) {
                flashObjects.splice(index, 1);
                moveables = [...boundaries, background, ...trees, ...allApples, ...soilTiles, chicken, merchant, foreground, ...flashObjects];
            }
        }, 300);
    }
        

    //create a list of all apples
    let allApples = []
    trees.forEach(function(tree){
        tree.apples.forEach(function(apple){
            allApples.push(apple)
        })})

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
                if (distance < 64) {
                    tree.health -= 1
                    console.log(tree.health)
                    // remove apple if present
                    if (tree.apples.length > 0) {
                        player.inventory['apple'] = (player.inventory['apple'] || 0) + 1;
                        const randomIndex = Math.floor(Math.random() * tree.apples.length);
                        const appleToRemove = tree.apples.splice(randomIndex, 1)[0];
                        flash("apple", appleToRemove)}
                        allApples = []
                        trees.forEach(function(tree){
                            tree.apples.forEach(function(apple){
                                allApples.push(apple)
                            })})
                        moveables = [...boundaries, background, ...trees, ...allApples, ...soilTiles, chicken, merchant, foreground, ...flashObjects];
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

    function startNewDay(){
        // repair trees and apples
        trees.forEach(tree => {
            tree.health = 5;
            if (tree.image == smallStumpImage){tree.image=smallTreeImage}
            else if (tree.image == largeStumpImage){tree.image=largeTreeImage}
            tree.apples = []
            tree.createApples()
        });
        allApples = []
        trees.forEach(function(tree){
            tree.apples.forEach(function(apple){
                allApples.push(apple)
            })})
        moveables = [...boundaries, background, ...trees, ...allApples, ...soilTiles, chicken, merchant, foreground, ...flashObjects];

        // grow any plants which have been watered
        soilTiles.forEach(function(soilTile){
            if(soilTile.status == "W" && !(soilTile.seedType == null)){
                if(soilTile.lifeIndex<3){soilTile.lifeIndex += 1}
            }
        })

        // chance of rain is recalculated
        raining = chanceOfRain()
        if(raining){
            initialSoilStatus = "W"}
        else{initialSoilStatus = "X"}
        soilTiles.forEach(function(soilTile){
            soilTile.status = initialSoilStatus
        })
    }
    

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

    let moveables = [...boundaries, background, ...trees, ...allApples, ...soilTiles, chicken, merchant, foreground, ...flashObjects];

    function rectangularCollision({ rectangle1, rectangle2 }) {
        return (
            rectangle1.x < rectangle2.pos.x + rectangle2.width &&
            rectangle1.x + rectangle1.width > rectangle2.pos.x &&
            rectangle1.y < rectangle2.pos.y + rectangle2.height &&
            rectangle1.y + rectangle1.height > rectangle2.pos.y
        );
    }



    let lastFrameTime = 0;
    function animatePlayer(timestamp) {
        const deltaTime = timestamp - lastFrameTime;
    
        if (player.timers['tool use'].active) {
            // Set the player's status to include direction and tool in use
            player.status = player.direction + "_" + player.tools[player.tool_index];
        }
    
        // Update the frame index based on deltaTime
        const frameRate = 250; // Adjust frame rate as needed
        if (deltaTime > frameRate) {
            const framesToAdvance = Math.floor(deltaTime / frameRate);
            player.frameIndex += framesToAdvance;
    
            // Handle frame index limit
        player.frameIndex %= 4; 
    
            lastFrameTime = timestamp;
        }
    
        // Update player image source and continue animation loop
        playerImage.src = './graphics/character/' + player.status + '/' + player.frameIndex + '.png';
        requestAnimationFrame(animatePlayer);
    }
    

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

        else if (keys.w.pressed === false &&
            keys.a.pressed === false &&
            keys.s.pressed === false &&
            keys.d.pressed === false &&
            player.status.endsWith('_idle') === false) {
            player.status = player.direction + '_idle';
            player.frameIndex = 0;
        }
        
    }

    function input() {
        window.addEventListener('keydown', (e) => {
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
                        toolImage.src = './graphics/overlay/' + player.tools[player.tool_index] + '.png'
                        player.timers['tool switch'].activate();
                    }
                    break;
                case 'e':
                    if (!player.timers['seed switch'].active) {
                        player.seed_index = (player.seed_index + 1) % player.seeds.length;
                        seedImage.src = './graphics/overlay/' + player.seeds[player.seed_index] + '.png';
                        player.timers['seed switch'].activate();
                    }
                    break
                case 'p':
                    if (!player.timers['tool use'].active){
                        player.timers['tool use'].activate();
                        player.frameIndex = 0
                        if(player.tools[player.tool_index] == "hoe"){
                            createNewSoilTile()
                            moveables = [...boundaries, background, ...soilTiles, ...trees, ...allApples, chicken, merchant, foreground];};
                        if(player.tools[player.tool_index] == "water"){
                            changeSoilWaterStatus()
                            waterSoilTiles()
                        }
                        if(player.tools[player.tool_index] == "axe"){
                            hitTree()
                        }
                    }
                    break;
                case 'o':
                    if (!player.timers['seed use'].active){
                        plantSeed()
                        player.timers['seed use'].activate();
                    }
                    break;
                case 'n':
                    if((background.pos.x > -1735 && background.pos.x < -1245)  && (background.pos.y < -950 && background.pos.y > -1205)){
                        if (!player.timers['new day'].active){
                            startNewDay()
                            player.timers['new day'].activate();
                    }
                    }
            }
        });

        window.addEventListener('keyup', (e) => {
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
        });
    }

// S O I L functions
    function doesSoilTileExist(x, y) {
        for (const soilTile of soilTiles) {
            if (soilTile.pos.x === x && soilTile.pos.y === y) {
                return true; // Soil tile exists at this position
            }
        }
        return false; // Soil tile does not exist at this position
    }

    function getNeighborTiles(x, y) {
        const t = doesSoilTileExist(x, y - 64);
        const r = doesSoilTileExist(x + 64, y);
        const b = doesSoilTileExist(x, y + 64);
        const l = doesSoilTileExist(x - 64, y);
        return {t, r, b, l};
    }

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

    function waterSoilTiles() {
        for (const soilTile of soilTiles) {
            if(soilTile.status == "W"){c.drawImage(wateredSoil, soilTile.pos.x, soilTile.pos.y)
        }}
    }

    function createNewSoilTile() {
        const toolOffset = {'left': {x: 55, y:64},
        'right': {x: 55, y:64},
        'up': {x: 55, y:64},
        'down': {x: 55, y:128}}
        const roundedX = player.pos.x + toolOffset[player.direction].x+ background.pos.x%64
        const roundedY = player.pos.y + toolOffset[player.direction].y + background.pos.y%64
        const soilTileExists = doesSoilTileExist(roundedX, roundedY)
        if (!soilTileExists){
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
                soilTile.image = changeSoilImage(t,b,l,r)
            }
        }
    }

    function changeSoilWaterStatus() {
        const toolOffset = {
            'left': { x: 55, y: 64 },
            'right': { x: 55, y: 64 },
            'up': { x: 55, y: 64 },
            'down': { x: 55, y: 128 }
        };
        const roundedX = player.pos.x + toolOffset[player.direction].x + background.pos.x % 64;
        const roundedY = player.pos.y + toolOffset[player.direction].y + background.pos.y % 64;
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

    function plantSeed(){
        const toolOffset = {
            'left': { x: 55, y: 64 },
            'right': { x: 55, y: 64 },
            'up': { x: 55, y: 64 },
            'down': { x: 55, y: 128 }
        };
        const roundedX = player.pos.x + toolOffset[player.direction].x + background.pos.x % 64;
        const roundedY = player.pos.y + toolOffset[player.direction].y + background.pos.y % 64;
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
    
    function displayPlants() {
        for (const soilTile of soilTiles) {
            if(soilTile.seedType == "corn"){c.drawImage(cornImages[soilTile.lifeIndex], soilTile.pos.x, soilTile.pos.y)}
            if(soilTile.seedType == "tomato"){c.drawImage(tomatoImages[soilTile.lifeIndex], soilTile.pos.x, soilTile.pos.y)}
        }
    }                                                                                                                                                  

    function harvestPlant() {
        for (const soilTile of soilTiles) {
            // Check if the player collides with a soil tile
            if (rectangularCollision({
                    rectangle1: player.hitbox,
                    rectangle2: {
                        pos: soilTile.pos,
                        width: 64,
                        height: 64
                    }
                })) {
                // Check if the soil tile has a plant with lifeIndex 3
                if (soilTile.lifeIndex === 3) {
                    // Harvest the plant
                    if(soilTile.seedType=="tomato"){
                        flash("tomato", soilTile)}
                    else if(soilTile.seedType=="corn"){
                        flash("corn", soilTile)}
                    moveables = [...boundaries, background, ...trees, ...allApples, ...soilTiles, chicken, merchant, foreground, ...flashObjects];
                    soilTile.lifeIndex = 0; // Reset lifeIndex
                    player.inventory[soilTile.seedType]++;
                    soilTile.seedType = null
                }
            }
        }
    }
    


    function update() {
        input();
    
        // Clear the canvas
        c.clearRect(0, 0, canvas.width, canvas.height);
    
        move();
    
        chicken.update(boundaries);
        
        moveables.forEach(moveable => {
            moveable.draw();
        });

        waterSoilTiles()
        harvestPlant()
        displayPlants()
    
        // Draw the player last
        player.draw();

        foreground.draw();
        // tree1.apples.forEach(function(apple) {apple.draw()})
        trees.forEach(tree => {
            tree.draw();
        });
    
        // Draw all apples
        allApples.forEach(apple => {
            apple.draw();
        });

        flashObjects.forEach(flashObject => {
            flashObject.draw()
        })
        
        // Draw the top 1/2 of the player image
        c.drawImage(player.image, 0, 0, player.image.width, player.image.height / 1.8, player.pos.x, player.pos.y, player.image.width, player.image.height / 1.8);

        //draw rain if its raining
        if(raining){updateRain()}
    
        //overlay
        c.drawImage(toolImage, tool.pos.x, tool.pos.y);
        c.drawImage(seedImage, seed.pos.x, seed.pos.y);
    
        // Find the shortest path using A* algorithm
        // let chickenPos = { x: Math.floor(chicken.pos.x / 64), y: Math.floor(chicken.pos.y / 64) };
        // let playerPos = { x: Math.floor(player.pos.x / 64), y: Math.floor(player.pos.y / 64) };
        // // try{let shortestPath = searching.search(chickenPos, playerPos);
        // console.log(shortestPath)}
        // catch{}
    
        // Check collisions inside the setTimeout callback
        requestAnimationFrame((timestamp) => {
            update(timestamp);
            animatePlayer(timestamp);
            
        });
    }
    
    // Use requestAnimationFrame to start the game loop
    requestAnimationFrame(update);
};