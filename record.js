import * as classes from './classes.js'
import * as settings from './settings.js'
const MOVEMENT_speed = 5
const FRAME_RATE = 60

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1280
canvas.height = 720

const collisionsMap = []
for (let i=0; i < collisions.length; i+=70) {
    collisionsMap.push(collisions.slice(i, i + 70))
}

const offset = {
    x: - 800,
    y: - 600
}

const boundaries = []

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 267){
            boundaries.push(
                new classes.Boundary({
                    pos: {
                        x: j * 64 + offset.x,
                        y: i * 64 + offset.y
                    },
                    width: 64,
                    height: 64
                })
            )}
        else if (symbol === 268){
            boundaries.push(
                new classes.Boundary({
                    pos: {
                        x: (j * 64 + offset.x) + 32,
                        y: i * 64 + offset.y
                    },
                    width: 32,
                    height: 64
                })
            )
        }

        else if (symbol === 269){
            boundaries.push(
                new classes.Boundary({
                    pos: {
                        x: j * 64 + offset.x,
                        y: i * 64 + offset.y
                    },
                    width: 32,
                    height: 64
                })
            )
        }

        else if (symbol === 270){
            boundaries.push(
                new classes.Boundary({
                    pos: {
                        x: j * 64 + offset.x,
                        y: (i * 64 + offset.y) + 32
                    },
                    width: 64,
                    height: 32
                })
            )
        }

    })
})

c.fillRect(0, 0, canvas.width, canvas.height)

const mapImage = new Image()
mapImage.src = './graphics/world/main_map.png'

const playerImage = new Image()
playerImage.src = './graphics/character/down_idle/0.png'

const foregroundImage = new Image()
foregroundImage.src = './graphics/world/foreground.png'

const merchantImage = new Image()
merchantImage.src = './graphics/objects/merchant.png'

const merchant = new classes.Sprite({
    pos: {
        x: 165,
        y: -220
    },
    image: merchantImage
})

merchant.hitbox = {
    x: merchant.pos.x - 10,
    y: merchant.pos.y - 10,
    width: merchantImage.width + 20,
    height: merchantImage.height +20
}

const player = new classes.Sprite({
    pos: {
        x:canvas.width / 2 - 86,
        y:canvas.height / 2 - 62
    },
    image: playerImage,
    status: 'down_idle'
})

// Clone the player's rect object
player.hitbox = {
    x: player.pos.x + 63,
    y: player.pos.y + 55,
    width: playerImage.width - 126,
    height: playerImage.height - 80
};

const background = new classes.Sprite({
    pos:
    {
        x: offset.x,
        y: offset.y
    },
    image: mapImage
})

const foreground = new classes.Sprite({
    pos:
    {
        x: offset.x,
        y: offset.y
    },
    image: foregroundImage
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
    }
}

const moveables = [background, foreground, merchant, ...boundaries]

function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.x < rectangle2.pos.x + rectangle2.width &&
        rectangle1.x + rectangle1.width > rectangle2.pos.x &&
        rectangle1.y < rectangle2.pos.y + rectangle2.height &&
        rectangle1.y + rectangle1.height > rectangle2.pos.y
    );
}

let lastFrameTime = 0
function animatePlayer(timestamp) {
    // Calculate the time difference since the last frame
    const deltaTime = timestamp - lastFrameTime;

    // Update the frame index every second
    if (deltaTime > 250) {  // 1000 milliseconds = 1 second
        player.frameIndex += 1
        if (player.status.endsWith('idle')) {
            if (player.frameIndex > 1) {
                player.frameIndex = 0
            }
        } 
        else if (player.frameIndex > 3) {
            player.frameIndex = 0
        };
        lastFrameTime = timestamp;
    }

    playerImage.src = './graphics/character/' + player.status + '/' + player.frameIndex + '.png';

    // Continue the animation loop
    requestAnimationFrame(animatePlayer);
}

function checkUpCollision(boundary) {
    return (
        rectangularCollision({
            rectangle1: player.hitbox,
            rectangle2: {...boundary, pos: {
                x: boundary.pos.x,
                y: boundary.pos.y + MOVEMENT_speed
            }}
        })
    )
}

function checkDownCollision(boundary) {
    return (
        rectangularCollision({
            rectangle1: player.hitbox,
            rectangle2: {...boundary, pos: {
                x: boundary.pos.x,
                y: boundary.pos.y - MOVEMENT_speed
            }}
        })
    )
}

function checkRightCollision(boundary) {
    return (
        rectangularCollision({
            rectangle1: player.hitbox,
            rectangle2: {...boundary, pos: {
                x: boundary.pos.x - MOVEMENT_speed,
                y: boundary.pos.y
            }}
        })
    )
}

function checkLeftCollision(boundary) {
    return (
        rectangularCollision({
            rectangle1: player.hitbox,
            rectangle2: {...boundary, pos: {
                x: boundary.pos.x + MOVEMENT_speed,
                y: boundary.pos.y 
            }}
        })
    )
}

function move() {
    let moving= true
    if (keys.w.pressed) {
        player.status = 'up'
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (checkUpCollision(boundary)) {
                console.log("colliding");
                moving = false
                break;
            }
        }

        if (moving) {
            moveables.forEach((moveable) => {
                moveable.pos.y += MOVEMENT_speed
            })
        }
    }

    if (keys.s.pressed) {
        player.status = 'down'
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (checkDownCollision(boundary)) {
                console.log("colliding");
                moving = false
                break;
            }
        }

        if (moving) {
            moveables.forEach((moveable) => {
                moveable.pos.y -= MOVEMENT_speed
            })
        }
    }

    if (keys.d.pressed) {
        player.status = 'right'
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (checkRightCollision(boundary)) {
                console.log("colliding");
                moving = false
                break;
            }
        }

        if (moving) {
            moveables.forEach((moveable) => {
                moveable.pos.x -= MOVEMENT_speed
            })
        }
    }

    if (keys.a.pressed) {
        player.status = 'left'
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (checkLeftCollision(boundary)) {
                console.log("colliding");
                moving = false
                break;
            }
        }

        if (moving) {
            moveables.forEach((moveable) => {
                moveable.pos.x += MOVEMENT_speed
            })
        }
    }
    
    else if (keys.w.pressed === false &&
        keys.a.pressed === false &&
        keys.s.pressed === false &&
        keys.d.pressed === false &&
        player.status.endsWith('_idle') === false){
        player.status += '_idle'
        player.frameIndex = 0
    }
}

function input () {
    window.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'd':
                keys.d.pressed = true
                break

            case 'a':
                keys.a.pressed = true
                break

            case 'w':
                keys.w.pressed = true
                break

            case 's':
                keys.s.pressed = true
                break
        }
    })

    window.addEventListener('keyup', (e) => {
        switch (e.key) {
            case 'd':
                keys.d.pressed = false
                break

            case 'a':
                keys.a.pressed = false
                break

            case 'w':
                keys.w.pressed = false
                break

            case 's':
                keys.s.pressed = false
                break
        }

    })
}

function update() {
    input();

    // Clear the canvas
    c.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the background (map) first
    c.drawImage(mapImage, background.pos.x, background.pos.y);

    // Draw boundaries
    // boundaries.forEach(boundary => {
    //     boundary.draw()
    // });

    // Move and draw moveables
    move()
    moveables.forEach(moveable => {
        moveable.draw()
    })

    // Check for collisions between player and merchant
    if (rectangularCollision({ rectangle1: player.hitbox, rectangle2: merchant.hitbox })) {
        console.log("Player and merchant are colliding!");
    }

    // Draw the player last
    player.draw()
    foreground.draw()
    // c.fill = 'White'
    // c.fillRect(
    //     merchant.hitbox.x,
    //     merchant.hitbox.y,
    //     merchant.hitbox.width,
    //     merchant.hitbox.height
    // )

    // Check collisions inside the setTimeout callback
    requestAnimationFrame((timestamp) => {
        update(timestamp);
        animatePlayer(timestamp);
    });
}
// Use requestAnimationFrame to start the game loop
requestAnimationFrame(update)