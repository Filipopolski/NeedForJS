const MAX_ENEMY = 7;
const HEIGHT_ELEM = 100;

const score = document.querySelector('.score'),
  start = document.querySelector('.start'),
  gameArea = document.querySelector('.gameArea'),
  btns = document.querySelectorAll('.btn');

const car = document.createElement('div');
car.classList.add('car');

const music = new Audio('audio.mp3');

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false,
};

const setting = {
  start: false,
  score: 0,
  speed: 3,
  traffic: 3,
};

let startSpeed = 0;

const changeLevel = level => {
  switch(level) {
    case '1': {
      setting.traffic = 4;
      setting.speed = 3;
      break;
    }
    case '2': {
      setting.traffic = 3;
      setting.speed = 6;
      break;
    }
    case '3': {
      setting.traffic = 3;
      setting.speed = 8;
      break;
    }
  }

  startSpeed = setting.speed;
}

const getQuantityElements = heightElement => (gameArea.offsetHeight / heightElement) + 1;
const getRandomEnemy = max => Math.floor((Math.random() * max) + 1);

const moveEnemy = () => {
  let enemy = document.querySelectorAll('.enemy');
  enemy.forEach(item => {
    let carRect = car.getBoundingClientRect();
    let enemyRect = item.getBoundingClientRect();

    if (carRect.top <= enemyRect.bottom
      && carRect.right >= enemyRect.left
      && carRect.left <= enemyRect.right
      && carRect.bottom >= enemyRect.top) {
      setting.start = false;
      start.classList.remove('hide');
    }

    item.y += setting.speed / 2;
    item.style.top = item.y + 'px';

    if (item.y >= gameArea.offsetHeight) {
      item.y = -HEIGHT_ELEM * setting.traffic;
      item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    }
  });
};

const moveRoad = () => {
  let lines = document.querySelectorAll('.line');
  lines.forEach(item => {
    item.y += setting.speed;
    item.style.top = item.y + 'px';

    if (item.y >= gameArea.offsetHeight) {
      item.y = -HEIGHT_ELEM;
    }
  });
};

const startGame = event => {
  const target = event.target;
  if (!target.classList.contains('btn')) return;

  music.play();

  const level = target.dataset.level;

  changeLevel(level);

  btns.forEach(btn => btn.disabled = true);

  gameArea.style.minHeight = Math.floor((document.documentElement.clientHeight - HEIGHT_ELEM) / HEIGHT_ELEM) * HEIGHT_ELEM;
  gameArea.innerHTML = '';

  start.classList.add('hide');

  for (let i = 0; i < getQuantityElements(HEIGHT_ELEM); i++) {
    const line = document.createElement('div');
    line.classList.add('line');
    line.style.top = (i * HEIGHT_ELEM) + 'px';
    line.style.height = (HEIGHT_ELEM / 2) + 'px';
    line.y = i * HEIGHT_ELEM;
    gameArea.append(line);
  }

  for (let i = 0; i < getQuantityElements(HEIGHT_ELEM * setting.traffic); i++) {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.y = -HEIGHT_ELEM * setting.traffic * (i + 1);
    enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    enemy.style.background = `
      transparent
      url(./image/enemy${getRandomEnemy(MAX_ENEMY)}.png)
      center / contain
      no-repeat`;
    enemy.style.top = enemy.y + 'px';
    gameArea.append(enemy);
  }

  setting.score = 0;
  setting.start = true;
  gameArea.append(car);

  car.style.left = (gameArea.offsetWidth / 2) - (car.offsetWidth / 2);
  car.style.top = 'auto'
  car.style.bottom = '10px'

  setting.x = car.offsetLeft;
  setting.y = car.offsetTop;
  requestAnimationFrame(playGame);
};

const playGame = () => {
  if (setting.start) {
    setting.score += setting.speed;
    score.textContent = 'Score: ' + setting.score;

    setting.speed = startSpeed + Math.floor(setting.score / 5000);
    console.log(setting.speed);

    moveRoad();
    moveEnemy();

    if (keys.ArrowLeft && setting.x > 0) {
      setting.x -= setting.speed;
    }

    if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
      setting.x += setting.speed;
    }

    if (keys.ArrowUp && setting.y > 0) {
      setting.y -= setting.speed;
    }

    if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
      setting.y += setting.speed;
    }

    car.style.left = setting.x + 'px';
    car.style.top = setting.y + 'px';

    requestAnimationFrame(playGame);
  } else {
    music.pause();
    btns.forEach(btn => btn.disabled = false);
  }
};

const startRun = event => {
  if (keys.hasOwnProperty(event.key)) {
    event.preventDefault();
    keys[event.key] = true;
  }
};

const stopRun = event => {
  if (keys.hasOwnProperty(event.key)) {
    event.preventDefault();
    keys[event.key] = false;
  }
};

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

// const fibo = n => n <= 2 ? 1 : fibo(n - 1) + fibo(n - 2);