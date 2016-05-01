// start slingin' some d3 here.
var gameOptions = {
  height: 550,
  width: 1366,
  nEnemies: 1,
  padding: 20
};

var gameStats = {
  score: 0,
  bestScore: 0
};

var wait = 1500;
var fatness = 4

var randx = () => Math.random() * (gameOptions.width-15)+15; //generate random x
var randy = () => Math.random() * (gameOptions.height-15)+15; //generate random y

//fn that generates id# and coord for enemy circle
function makeEnemy(i) {
  var enemy = {
      // id: 'asteroid.png',
      x: randx(),
      y: randy()
    };
    //console.log(enemy.x);
  return enemy;
}

//array that holds all enemy data
var enemy_data = [];

var spawn = function(enemies) {
  for (var i = 0; i < enemies; i++) {
    enemy_data.push(makeEnemy(i));
  }
};

spawn(gameOptions.nEnemies);

//append svg to body, svg will be viewport/gameboard
var gameBoard = d3.select('body').append('svg')
  .attr('class', 'game')
  .attr('width', gameOptions.width)
  .attr('height', gameOptions.height)
  // .style('border', '1px solid black')
  .style('margin-left', 50);

var update = function(data) {
  // debugger;
  var enemies = gameBoard.selectAll('circle.enemy')
    .data(data);

  enemies.enter()
    .append('circle')
    .attr('class', 'enemy')
    .attr('r', fatness)
    .attr('fill', 'red')
    .attr('opacity', 0.3)
    .attr('cx', d => d.x)
    .attr('cy', d => d.y);

  // update position of circle
  
  // update(enemy_data);

  enemies.transition()
    .duration(2000) // enemy speed
    .attr('opacity', 1)
    .attr('cx', () => randx())
    .attr('cy', () => randy());

  // console.log('game', gameBoard.selectAll('circle.enemy'));

  enemies.exit().remove();
};

  // update(enemy_data);

var currentScore = 0;
var highScore = 0;



// actions called once per round;
setInterval(function() {
  update(enemy_data);
  currentScore++;
  if (currentScore > highScore) {
    highScore = currentScore;
  }
  spawn(1);
  fatness = fatness + 0.1;
}, 2000); // round duration

//make player circle
gameBoard.selectAll('circle.player')
  .data([1])
  .enter()
  .append('circle')
  .attr('class', 'player')
  .attr('fill', 'blue')
  .attr('cx', 350)
  .attr('cy', 250)
  .attr('r', 10);

gameBoard.on('mousemove', function() {
  var coordinates = d3.mouse(this);
  //console.log(coordinates);
  gameBoard.selectAll('circle.player')
    .data([coordinates]) //data is an array with two values : x,y (mouse position)
    .attr('cx', (d) => d[0])
    .attr('cy', (d) => d[1])
    .style('cursor', 'none');
});

//COLLISION DETECTION

var obj = {};

var tracker = function() {
  obj[this + 'cx'] = (this.attributes.cx.value);
  obj[this + 'cy'] = (this.attributes.cy.value);
};

var collisionCount = 0;
var distance = (dx, dy) => Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

// console.log(gameBoard.selectAll('circle.player')[0][0].attributes.cx.value);
var hasBeenHit = false;

var collisionRunner = function() {
  if (hasBeenHit === false) {
    collision();
  }
}
var testenemy = gameBoard.selectAll('circle.enemy');


var collision = function() {


  var enemyArr = gameBoard.selectAll('circle.enemy');
  var playercx = +gameBoard.selectAll('circle.player').attr('cx');
  var playercy = +gameBoard.selectAll('circle.player').attr('cy');

  //store current enemy coordinates
  for (var i = 0; i < enemyArr[0].length; i++) {
    var enemycx = enemyArr[0][i].attributes.cx.value;
    var enemycy = enemyArr[0][i].attributes.cy.value;
    // console.log(playercx, playercy);

    if (distance(enemycx - playercx, enemycy - playercy) <= 20) {
      if (hasBeenHit === false) {
        collisionCount++;
        currentScore = 0;
        hasBeenHit = true;
      }
      // turn off collision detection for a half second
      setTimeout(function() { hasBeenHit = false; }, 500);
    }

  }

  d3.select('body').selectAll('div.collisions')
    .selectAll('span')
    .text(collisionCount);

  d3.select('body').selectAll('div.current')
    .selectAll('span')
    .text(currentScore);

  d3.select('body').selectAll('div.highscore')
    .selectAll('span')
    .text(highScore);

};

// check for a collision every 10 milliseconds
setInterval(function() { collisionRunner(); }, 10);
