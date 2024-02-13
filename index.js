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

function createEndGameButton(){
    const endGameButton = document.createElement('button');
    endGameButton.textContent = 'end game';
    endGameButton.style.fontFamily = 'LycheeSoda';
    endGameButton.style.fontSize = '20px';
    endGameButton.style.color = '#522915';
    endGameButton.classList.add('btn');
    endGameButton.style.position = 'absolute';
    endGameButton.style.bottom = '10px';
    endGameButton.style.right = '130px';
    endGameButton.id = "endGameButton";
    return endGameButton;
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

function displayScore() {
    let score = 0;

    const scoreBox = document.createElement('div');
    scoreBox.style.fontFamily = 'LycheeSoda';
    scoreBox.style.backgroundColor = "beige"
    scoreBox.textContent = 'Score: ' + score;
    scoreBox.style.position = 'absolute';
    scoreBox.style.top = '20px';
    scoreBox.style.left = '20px';
    scoreBox.style.color = '#522915';
    scoreBox.style.fontSize = '24px';

    document.body.appendChild(scoreBox);
}

//  need to update score when the user is the merchant
function updateScore(newScore) {
    score = newScore;
    scoreBox.textContent = 'Score: ' + score;
}

let score = 0; // Declare score globally

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


function startGame() {
    const container = this.parentElement;
    container.remove();

    const MOVEMENT_speed = 5;
    const FRAME_RATE = 60;

    const canvas = document.querySelector('canvas');
    const c = canvas.getContext('2d');

    canvas.width = 1280;
    canvas.height = 720;

    const endGameButton = createEndGameButton();
    document.body.appendChild(endGameButton);
    displayScore()

    document.getElementById('endGameButton').addEventListener('click', endGame)

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

    const mapImage = new Image();
    mapImage.src = './graphics/my_world/main_map.png';

    const playerImage = new Image();
    playerImage.src = './graphics/character/down_idle/0.png';

    const chickenImage = new Image();
    chickenImage.src = './graphics/chicken/idle/0.png'

    const foregroundImage = new Image();
    foregroundImage.src = './graphics/world/foreground.png';

    const toolImage = new Image();
    toolImage.src = './graphics/overlay/axe.png';

    const seedImage = new Image();
    seedImage.src = './graphics/overlay/corn.png';

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
            y: canvas.height - 150,
        },
        image: toolImage
    })

    const seed = new classes.Sprite({
        pos: {
            x: 70,
            y: canvas.height - 140,
        },
        image: seedImage
    })

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

    const moveables = [...boundaries, background, chicken, foreground];

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
                    console.log("colliding");
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
                    console.log("colliding");
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
                    console.log("colliding");
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
                    console.log("colliding");
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
                        console.log("tool use")
                        player.timers['tool use'].activate();
                    }
                    break;
                case 'o':
                    if (!player.timers['seed use'].active){
                        console.log("seed use")
                        player.timers['seed use'].activate();
                    }
                    break;
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

    function update(timestamp) {
        input();

        // Clear the canvas
        c.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the background (map) first
        c.drawImage(mapImage, background.pos.x, background.pos.y);

        move();

        chicken.update(boundaries)
        
        moveables.forEach(moveable => {
            moveable.draw();
        });

        // Draw the player last
        player.draw();
        foreground.draw();

        //overlay
        c.drawImage(toolImage, tool.pos.x, tool.pos.y)
        c.drawImage(seedImage, seed.pos.x, seed.pos.y)
        
        // Check collisions inside the setTimeout callback
        requestAnimationFrame((timestamp) => {
            update(timestamp);
            animatePlayer(timestamp);
        });
    }

    // Use requestAnimationFrame to start the game loop
    requestAnimationFrame(update);
};