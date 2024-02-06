import * as support from './support.js'
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

// import * as support from './support.js'

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

export class Player extends Sprite {
    constructor({ pos, image, status}) {
        super({ pos, image, status});
        this.speed = 0
        this.frameIndex = 0
        this.direction = "down"
        this.moving = false
        this.timers = {
            'tool use': new Timer(350,this.use_tool),
            'tool switch': new Timer(200),
            'seed use': new Timer(350,this.use_seed),
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
        this.animations = {
            'up': [], 'down': [], 'left': [], 'right': [],
            'right_idle': [], 'left_idle': [], 'up_idle': [], 'down_idle': [],
            'right_hoe': [], 'left_hoe': [], 'up_hoe': [], 'down_hoe': [],
            'right_axe': [], 'left_axe': [], 'up_axe': [], 'down_axe': [],
            'right_water': [], 'left_water': [], 'up_water': [], 'down_water': []
          };

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
  
  // To stop the timer prematurely, call deactivate():
  // myTimer.deactivate();
  

// export class Player {
//     constructor({pos}) {
//         this.pos = pos
//         this.status = 'down_idle'
//         this.frame_index = 0

//     }

//     import_assets() {
//         this.animations = {'up': [], 'down': [], 'left': [], 'right': [],
//         'right_idle':[],'left_idle':[],'up_idle':[],'down_idle':[],
//         'right_hoe': [], 'left_hoe': [], 'up_hoe': [], 'down_hoe': [],
//         'right_axe':[],'left_axe':[],'up_axe':[],'down_axe':[],
//         'right_water':[],'left_water':[],'up_water':[],'down_water':[]}
//     }

//         this.animations.keys().forEach((animation) {
//                 const full_path ='./graphics/character/' + animation
//                 this.animations[animation] = import_folder(full_path)
//             })
// }
