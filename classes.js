const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

export class Sprite {
    constructor({pos, image, status}) {
        this.pos = pos
        this.image = image
        this.image.onload = () => {
            this.width = this.image.width
            this.height = this.image.height
        }  
        this.hitbox = {
            x: pos.x,
            y: pos.y,
            width: image.width,
            height: image.height
        }
        this.status = status
        this.frameIndex = 0
    }
        

    draw() {
        c.drawImage(
            this.image,
            this.pos.x,
            this.pos.y
        )
    }
}

export class Rain {
    constructor(x, y, l, v) {
        this.x = x;
        this.y = y;
        this.vy = v;
        this.l = l;
    }
    show() {
        c.beginPath();
        c.strokeStyle = "white";
        c.moveTo(this.x, this.y);
        c.lineTo(this.x, this.y + this.l);
        c.stroke();
    }

    fall() {
        this.y += this.vy;
        if (this.y > canvas.height) {
            this.x = Math.floor(Math.random() * canvas.width) + 5;
            this.y = Math.floor(Math.random() * 100) - 100;
            this.l = Math.floor(Math.random() * 30) + 1;
            this.vy = Math.floor(Math.random() * 12) + 4;
        }
    }
}

export class Merchant extends Sprite {
    constructor({ pos, image}) {
        super({ pos, image});
    }
}

export class Map extends Sprite {
    constructor({ pos, image }) {
        super({ pos, image });
    }

}

export class Player extends Sprite {
    constructor({ pos, image, status}) {
        super({ pos, image, status});
        this.speed = 0
        this.frameIndex = 0
        this.direction = "down"
        this.moving = false
        this.timers = {
            'tool use': new Timer(350),
            'tool switch': new Timer(200),
            'seed use': new Timer(350),
            'seed switch': new Timer(200),
            'new day': new Timer(200)
        }
        //tools
        this.tools = ['hoe', 'axe', 'water']
        this.tool_index = 0
        this.selected_tool = this.tools[this.tool_index]
        //seeds
        this.seeds = ['corn', 'tomato']
        this.seed_index = 0
        this.selected_seed = this.seeds[this.seed_index]
        //inventory
        this.inventory = {
            'wood':   0,
            'apple':  0,
            'corn':   0,
            'tomato': 0
        }
    }
}

export class Chicken extends Sprite {
    constructor({ pos, image, status, player }) {
        super({ pos, image, status });
        this.player = player;
        this.speed = 4; // Adjust the speed as needed
    }

    update(collisions) {
        // Calculate distance between chicken and player
        const dx = (this.player.pos.x + this.player.image.width / 2) - (this.pos.x + this.image.width / 2);
        const dy = (this.player.pos.y + this.player.image.height / 2) - (this.pos.y + this.image.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);

        // If distance is greater than 100 pixels, move towards the player
        if (distance > 100) {
            const angle = Math.atan2(dy, dx);
            const nextX = this.pos.x + this.speed * Math.cos(angle);
            const nextY = this.pos.y + this.speed * Math.sin(angle);

            // Check for collisions with boundaries in the x direction
            let collidingX = false;
            for (const boundary of collisions) {
                if (this.isCollidingWithBoundary(nextX, this.pos.y, boundary)) {
                    collidingX = true;
                    break;
                }
            }

            // Only move in the x direction if not colliding in the x direction
            if (!collidingX) {
                this.pos.x = nextX;
            }

            // Check for collisions with boundaries in the y direction
            let collidingY = false;
            for (const boundary of collisions) {
                if (this.isCollidingWithBoundary(this.pos.x, nextY, boundary)) {
                    collidingY = true;
                    break;
                }
            }

            // Only move in the y direction if not colliding in the y direction
            if (!collidingY) {
                this.pos.y = nextY;
            }
        }
    }

    // Method to check if the chicken collides with a boundary
    isCollidingWithBoundary(nextX, nextY, boundary) {
        return (
            nextX < boundary.pos.x + boundary.width &&
            nextX + this.image.width > boundary.pos.x &&
            nextY < boundary.pos.y + boundary.height &&
            nextY + this.image.height > boundary.pos.y
        );
    }
}

export class Cow extends Sprite {
    constructor({ pos, image, status, background}) {
        super({ pos, image, status });
        this.background = background;
        this.speed = 4;
        this.direction = 1;
    }

    move() {
        // Move the cow
        this.pos.x += this.speed * this.direction;

        // Check if the cow has reached the left or right boundary
        if (this.pos.x <= 1800 + this.background.pos.x) {
            // If reached left boundary, change direction to move right
            this.direction = 1;
        } else if (this.pos.x >= 2300 + this.background.pos.x) {
            // If reached right boundary, change direction to move left
            this.direction = -1;
        }
    }
}

export class Boundary {
    constructor({pos, width, height}) {
        this.pos = pos
        this.width = width
        this.height = height
    }

    draw() {
        c.fillStyle = 'rgba(255, 0, 0, 0.3)'
        c.fillRect(this.pos.x, this.pos.y, this.width, this.height)
    }
}

class Timer {
    constructor(duration, func = null) {
      this.duration = duration;
      this.func = func;
      this.timerId = null;
      this.active = false;
    }
  
    activate() {
      if (!this.active) {
        this.active = true;
        this.timerId = setTimeout(() => {
          if (this.func) {
            this.func();
          }
          this.deactivate();
        }, this.duration);
      }
    }
  
    deactivate() {
      if (this.active) {
        clearTimeout(this.timerId);
        this.active = false;
      }
    }
}

export class SoilTile extends Sprite{
    constructor({ pos, image, status}) {
    super({ pos, image, status})
    this.seedType = null
    this.seedStatus = null
    this.lifeIndex = 0
    }
}

const APPLE_POS = {
    'small': [[18,17], [30,37], [12,50], [30,45], [20,30], [30,10]],
    'large': [[30,24], [60,65], [50,50], [16,40], [45,50], [42,70]]
}
const appleImage = new Image()
appleImage.src = './graphics/fruit/apple.png'

export class Tree extends Sprite{
    constructor({pos, size, image}){
    super({pos, image})
    this.health = 5
    this.size = size
    this.applePos = APPLE_POS[size]
    this.apples = []
    }

    damage(){
        this.health -= 1
        console.log(this.health)
    }

    createApples(){
        for (let pos of this.applePos) {
            if (Math.floor(Math.random() * 11) < 2) {
                let x = pos[0] + this.pos.x;
                let y = pos[1] + this.pos.y;
                // Do something with x and y
                let apple = new Sprite({pos:{x,y}, image: appleImage})
                this.apples.push(apple)
            }
        }
    }
}