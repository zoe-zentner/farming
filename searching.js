export function search(chickenPos, playerPos) {
    const cols = 90; // columns in the grid
    const rows = 60; // rows in the grid
    const gridSize = 64; // grid size

    let grid = new Array(cols); // array of all the grid points
    let openSet = []; // array containing unevaluated grid points
    let closedSet = []; // array containing completely evaluated grid points
    let start; // starting grid point
    let end; // ending grid point (goal)
    let path = [];

    // heuristic function - Manhattan distance
    function heuristic(position0, position1) {
        let d1 = Math.abs(position1.x - position0.x);
        let d2 = Math.abs(position1.y - position0.y);
        return d1 + d2;
    }

    // constructor function to create all the grid points as objects containing the data for the points
    function GridPoint(x, y) {
        this.x = x; // x location of the grid point
        this.y = y; // y location of the grid point
        this.f = 0; // total cost function
        this.g = 0; // cost function from start to the current grid point
        this.h = 0; // heuristic estimated cost function from current grid point to the goal
        this.neighbors = []; // neighbors of the current grid point
        this.parent = undefined; // immediate source of the current grid point

        // update neighbors array for a given grid point
        this.updateNeighbors = function (grid) {
            let i = this.x;
            let j = this.y;
            if (i < cols - 1) {
                this.neighbors.push(grid[i + 1][j]);
            }
            if (i > 0) {
                this.neighbors.push(grid[i - 1][j]);
            }
            if (j < rows - 1) {
                this.neighbors.push(grid[i][j + 1]);
            }
            if (j > 0) {
                this.neighbors.push(grid[i][j - 1]);
            }
        };
    }

    // initialize the grid
    function init() {
        // making a 2D array
        for (let i = 0; i < cols; i++) {
            grid[i] = new Array(rows);
        }

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                grid[i][j] = new GridPoint(i, j);
            }
        }

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                grid[i][j].updateNeighbors(grid);
            }
        }

        // set start and end points based on the provided positions
        start = grid[chickenPos.x][chickenPos.y];
        end = grid[playerPos.x][playerPos.y];

        openSet.push(start);
    }

    // A* search implementation
    init();
    while (openSet.length > 0) {
        let lowestIndex = 0;
        for (let i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[lowestIndex].f) {
                lowestIndex = i;
            }
        }
        let current = openSet[lowestIndex];

        if (current === end) {
            let temp = current;
            path.push(temp);
            while (temp.parent) {
                path.push(temp.parent);
                temp = temp.parent;
            }
            return path.reverse();
        }

        openSet.splice(lowestIndex, 1);
        closedSet.push(current);

        let neighbors = current.neighbors;

        for (let i = 0; i < neighbors.length; i++) {
            let neighbor = neighbors[i];

            if (!closedSet.includes(neighbor)) {
                let possibleG = current.g + 1;

                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor);
                } else if (possibleG >= neighbor.g) {
                    continue;
                }

                neighbor.g = possibleG;
                neighbor.h = heuristic(neighbor, end);
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.parent = current;
            }
        }
    }

    // no solution by default
    return [];
}