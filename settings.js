const SCREEN_WIDTH = 1280;
const SCREEN_HEIGHT = 720;
const TILE_SIZE = 64
// class Vector2 {
//     constructor(x, y) {
//       this.x = x;
//       this.y = y;
//     }
  
//     add(otherVector) {
//       return new Vector2(this.x + otherVector.x, this.y + otherVector.y);
//     }
//   }
  
//   // Screen
//   const SCREEN_WIDTH = 1280;
//   const SCREEN_HEIGHT = 720;
//   const TILE_SIZE = 64;
  
//   // Overlay Positions
//   const OVERLAY_POSITIONS = {
//     tool: new Vector2(40, SCREEN_HEIGHT - 15),
//     seed: new Vector2(70, SCREEN_HEIGHT - 5),
//   };
  
//   // Player Tool Offsets
//   const PLAYER_TOOL_OFFSET = {
//     left: new Vector2(-50, 40),
//     right: new Vector2(50, 40),
//     up: new Vector2(0, -10),
//     down: new Vector2(0, 50),
//   };
  
//   // Layers
//   const LAYERS = {
//     'water': 0,
//     'ground': 1,
//     'soil': 2,
//     'soil water': 3,
//     'rain floor': 4,
//     'house bottom': 5,
//     'ground plant': 6,
//     'main': 7,
//     'house.top': 8,
//     'fruit': 9,
//     'rain drops': 10,
//   };
  
//   // Apple Positions
//   const APPLE_POS = {
//     Small: [
//       new Vector2(18, 17),
//       new Vector2(30, 37),
//       new Vector2(12, 50),
//       new Vector2(30, 45),
//       new Vector2(20, 30),
//       new Vector2(30, 10),
//     ],
//     Large: [
//       new Vector2(30, 24),
//       new Vector2(60, 65),
//       new Vector2(50, 50),
//       new Vector2(16, 40),
//       new Vector2(45, 50),
//       new Vector2(42, 70),
//     ],
//   };
  
//   // Grow Speed
//   const GROW_SPEED = {
//     corn: 1,
//     tomato: 0.7,
//   };
  
//   // Sale Prices
//   const SALE_PRICES = {
//     wood: 4,
//     apple: 2,
//     corn: 10,
//     tomato: 20,
//   };
  
//   // Purchase Prices
//   const PURCHASE_PRICES = {
//     corn: 4,
//     tomato: 5,
//   };