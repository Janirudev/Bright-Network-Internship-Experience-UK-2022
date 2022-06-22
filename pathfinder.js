function removeFromArray(arr, el) {
  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i] == el) {
      arr.splice(i, 1);
    }
  }
}

function heuristic(a, b) {
  // var d = dist(a.i, a.j, b.i, b.j);
  var d = abs(a.i - b.i) + abs(a.j - b.j);
  return d;
}

var cols = 10;
var rows = 10;
var grid = new Array(cols);

var openSet = [];
var closedSet = [];

var start, end, w, h;
var path = [];
var noSolution = false;
var steps = 0;
var outputStr = '';

function Cell(i, j) {
  this.x = i;
  this.y = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.neighbors = [];
  this.previous = undefined;
  this.wall = false;

  if (random(1) < 0.1) {
    this.wall = true;
  }

  this.show = function (col) {
    fill(col);
    if (this.wall) {
      fill(0);
    }
    rect(this.x * w, this.y * h, w - 1, h - 1);
    // console.log(`(${this.x}, ${this.y})`);
  };

  this.addNeighbors = function (grid) {
    var i = this.x;
    var j = this.y;
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
    if (i > 0 && j > 0) {
      this.neighbors.push(grid[i - 1][j - 1]);
    }
    if (i < cols - 1 && j > 0) {
      this.neighbors.push(grid[i + 1][j - 1]);
    }
  };
}

function setup() {
  createCanvas(400, 400);

  w = width / cols;
  h = height / rows;

  // Construct a 2D array
  for (var i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j] = new Cell(i, j);
    }
  }

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].addNeighbors(grid);
    }
  }

  start = grid[0][0];
  end = grid[cols - 1][rows - 1];
  start.wall = false;
  end.wall = false;

  openSet.push(start);

  console.log(grid);
}
function draw() {
  // A* algorithm
  if (openSet.length > 0) {
    var winner = 0;

    for (var i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[winner].f) {
        winner = i;
      }
    }

    var current = openSet[winner];

    // Finishes
    if (current == end) {
      console.log('Done');
      noLoop();

      path = [];
      var temp = current;
      path.push(temp);

      while (temp.previous) {
        path.push(temp.previous);
        temp = temp.previous;
      }

      for (var i = path.length - 1; i >= 0; i--) {
        outputStr = `${outputStr} (${path[i].x}, ${path[i].y}),`;
      }

      console.log('[' + outputStr + ']');
      console.log(`Steps: ${steps}`);
    }

    removeFromArray(openSet, current);
    closedSet.push(current);

    var neighbors = current.neighbors;

    for (var i = 0; i < neighbors.length; i++) {
      var neighbor = neighbors[i];

      if (!closedSet.includes(neighbor) && !neighbor.wall) {
        var tempG = current.g + 1;
        steps = steps + 1;

        if (openSet.includes(neighbor)) {
          if (tempG < neighbor.g) {
            neighbor.g = tempG;
          }
        } else {
          neighbor.g = tempG;
          openSet.push(neighbor);
        }

        neighbor.h = heuristic(neighbor, end);
        neighbor.f = neighbor.g + heuristic.h;
        neighbor.previous = current;
      }
    }

    // Solution
  } else {
    // no solution
    console.log('Unable to reach delivery');
    return;
    noLoop();
  }

  background(0);

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].show(color(255));
    }
  }

  for (var i = 0; i < closedSet.length; i++) {
    closedSet[i].show(color(255, 0, 0));
  }

  for (var i = 0; i < openSet.length; i++) {
    openSet[i].show(color(0, 255, 0));
  }

  path = [];
  var temp = current;
  path.push(temp);

  while (temp.previous) {
    path.push(temp.previous);
    temp = temp.previous;
  }

  for (var i = 0; i < path.length; i++) {
    path[i].show(color(0, 0, 255));
  }
}
