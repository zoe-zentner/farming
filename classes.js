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
            'seed switch': new Timer(200)
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
        // this.animations = {
        //     'up': [], 'down': [], 'left': [], 'right': [],
        //     'right_idle': [], 'left_idle': [], 'up_idle': [], 'down_idle': [],
        //     'right_hoe': [], 'left_hoe': [], 'up_hoe': [], 'down_hoe': [],
        //     'right_axe': [], 'left_axe': [], 'up_axe': [], 'down_axe': [],
        //     'right_water': [], 'left_water': [], 'up_water': [], 'down_water': []
        //   };

        const animationFolderPath = './graphics/character';
        const imagesPerAnimation = 1; // Number of images per animation key

        for (let animation in this.animations) {
            for (let i = 0; i <= imagesPerAnimation; i++) {
                const filename = `${animation}/${i}.png`; // Assuming PNG format
                const imagePath = `${animationFolderPath}/${filename}`;
                this.loadImage(imagePath, animation);
                }
        }
        
            // Additional initialization
            // ...
            }
        
            // Method to load image asynchronously
            loadImage(url, animationKey) {
            const image = new Image();
            image.onload = () => {
                this.animations[animationKey].push(image);
            };
            image.src = url;
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
    constructor({ pos, image}) {
    super({ pos, image})
    }
}

export class SoilLayer {
    constructor() {}
    createSoilGrid() {
        var ground = new Image();
        ground.onload = function() {
            var hTiles = Math.floor(ground.width / TILE_SIZE);
            var vTiles = Math.floor(ground.height / TILE_SIZE);
            var grid = new Array(vTiles).fill(null).map(() => new Array(hTiles).fill([]));
    
            // Assuming load_pygame function is defined elsewhere
            load_pygame('Animations/data/map.tmx').get_layer_by_name('Farmable').tiles().forEach(tile => {
                var [x, y, _] = tile;
                grid[y][x].push('F');
            });
    
            // Now you have your grid populated
            console.log(grid);
        };
        ground.src = 'Animations/graphics/world/ground.png';
    }
    
}