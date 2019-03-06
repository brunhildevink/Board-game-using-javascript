$(document).ready(function() {

  /* ================
  ==== Variables ====
  =================== */

  // Game variables.
  const mapTileLimit = 100;
  const obstacleTileLimit = 10;
  const weaponTileLimit = 1;
  const playerMoveLimit = 3;
  const adjacentLimit = 1;
  let mapTilesId = [[],[],[],[],[],[],[],[],[],[]];
  let firstPlayerActive = true;
  let secondPlayerActive = false;
  let possibleMoves = [];
  let reservedTiles = [18, 81, 11, 88];

  // DOM variables.
  let mapContainer = document.querySelector('.container-map');
  let allTiles = document.getElementsByClassName('tile');
  console.log($(".tile"))
  console.log(document.getElementsByClassName('tile'))
  let currentPlayerPosition_01 = document.getElementsByClassName('player_01');
  let currentPlayerPosition_02 = document.getElementsByClassName('player_02');

  /* =============================
  ==== Game assets generation ====
  ================================ */

  //Handles the random generation behaviour.
  function generateRandomNumber(min, max) {
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber;
  }

  // Generates map with blank tiles
  function generateMap() {
    for (let i = 0 ; i < mapTileLimit; i++) {
      //Generate DOM code.
      const htmlElement = document.createElement("div");
      let x = i % 10;
      let y = parseInt(i / 10);
      htmlElement.className = 'tile blank-tile';
      htmlElement.id = i;
      mapTilesId[y][x] = i;
      //Inject generated code into the DOM.
      mapContainer.appendChild(htmlElement);
    }
  }

  function generateDetails(detail, limitNumber, number) {
    //Counter
    let counter = 0;
    //Loop
    for (let i = 0; i < mapTileLimit; i++) {
      if (counter === limitNumber) break;
      let randomNumber = generateRandomNumber(0, number);
      if (randomNumber === 0 && allTiles[i].classname != 'obstacle' && allTiles[i].classname != 'weapon') {
        allTiles[i].className = 'tile ' + detail;
        counter += 1;
      }
    }
  }

  // Obstacle generation
  function generateObstacles(name) {
    //Counter
    let counter = 0;
    //Loop
    for (let i = 0 ; i < mapTileLimit; i++) {
    	if (counter === obstacleTileLimit) break;
      let randomNumber = generateRandomNumber(0, 10);
      if (randomNumber === 0) {
        allTiles[i].className = 'tile obstacle ' + name;
        counter += 1;
      }
    }
  }

  // Weapon generation
  function generateWeapons(name, damage) {
    let weapon = new Object()
    weapon.name = name;
    weapon.damage = damage;
    //Counter
    let counter = 0;
    //Loop
    for (let i = 0 ; i < mapTileLimit; i++) {
      if (counter === weaponTileLimit) break;
      let randomNumber = generateRandomNumber(0, 25);
      // Assigns weapon class after checking if it overwrites or not.
      if (randomNumber === 0 && allTiles[i].classname != 'obstacle' && !reservedTiles.includes(i)) {
        allTiles[i].className = 'tile weapon ' + name;
        counter += 1;
      }
    }
  return weapon;
  }

  // Player generation
  function generatePlayer(name, opponent, healthBar, health, weaponDamage, isAlive, position_01, position_02) {
    // Player assets
    let player = new Object()
    player.name = name;
    player.maxHealth = 100;
    player.healthBarPercentage = 100;
    player.healthBar = document.getElementById(healthBar);
    player.health = health;
    player.weapon = weaponDamage;
    player.isAlive = isAlive;
    player.isDefending = false;

    let spawnPoints =
    [
      firstSpawnPoint = document.getElementById(position_01),
      secondSpawnPoint = document.getElementById(position_02)
    ]

    let randomNumber = generateRandomNumber(1, 2);

    if (randomNumber === 1) {
      spawnPoints[0].className = 'tile blank-tile ' + opponent;
      spawnPoints[0].classList.add(name);
      player.position = position_01;
    }
    else {
      spawnPoints[1].className = 'tile blank-tile ' + opponent;
      spawnPoints[1].classList.add(name);
      player.position = position_02;
    }
    return player;
  }

  /* ===============================================
  ==== Game logic, movement, fight and adjacent ====
  ================================================== */

  //Moves players when clicking on the map.
  document.addEventListener('click', function(event) {
    let id = event.target.id;
    if(event.target.tagName === "BUTTON") fightHandler(event.target);
    if(possibleMoves.includes(parseInt(id))) gameHandler();
  });

  function resourceHandler(healthDOMSelector, weaponDOMSelector, player) {
    playerHealth = document.getElementsByClassName(healthDOMSelector)[0];
    playerWeapon = document.getElementsByClassName(weaponDOMSelector)[0];

    if (event.target.classList.contains('weapon-01')) {
      player.weapon += parseInt(weapon_01.damage);
      playerWeapon.innerHTML = `Damage: ${player.weapon}`;
      event.target.classList.remove('weapon-01');
      event.target.classList.add('blank-tile');
    }
    else if (event.target.classList.contains('weapon-02')) {
      player.health += parseInt(weapon_02.damage);
      player.maxHealth += parseInt(weapon_02.damage);
      playerHealth.innerHTML = `Health: ${player.health}`;
      event.target.classList.remove('weapon-02');
      event.target.classList.add('blank-tile');
    }
    else if (event.target.classList.contains('weapon-03')) {
      player.weapon += parseInt(weapon_03.damage);
      playerWeapon.innerHTML = `Damage: ${player.weapon}`;
      event.target.classList.remove('weapon-03');
      event.target.classList.add('blank-tile');
    }
    else if (event.target.classList.contains('weapon-04')) {
      player.weapon += parseInt(weapon_04.damage);
      playerWeapon.innerHTML = `Damage: ${player.weapon}`;
      event.target.classList.remove('weapon-04');
      event.target.classList.add('blank-tile');
    }
    else {
    }
  }

  //Handles entire game logic
  function gameHandler() {
    if(audio.paused) audio.play();
    if (firstPlayerActive === true && event.target.classList.contains("possible-move")) {
      movePlayer(currentPlayerPosition_01, "player_01");
      if (event.target.classList.contains('weapon')) {
        resourceHandler("player_01-health", "player_01-weapon", player_01);
        event.target.classList.remove('weapon');
        event.target.classList.add('blank-tile');
      }
      currentPlayerPosition_02[0].classList.remove("opponent");
      currentPlayerPosition_01[0].classList.add("opponent")
      secondPlayerActive = true;
      firstPlayerActive = false;
      resetAllMoves();
      updatePossibleMoves(currentPlayerPosition_02);
    }
    else if (secondPlayerActive === true && event.target.classList.contains("possible-move")) {
      movePlayer(currentPlayerPosition_02, "player_02");
      if (event.target.classList.contains('weapon')) {
        resourceHandler("player_02-health", "player_02-weapon", player_02);
        //If the clicked tile ALSO is a weapon it removes the weapon and replaces it with a 'blank-tile' class instead.
        event.target.classList.remove('weapon');
        event.target.classList.add('blank-tile');
      }
      currentPlayerPosition_01[0].classList.remove("opponent");
      currentPlayerPosition_02[0].classList.add("opponent")
      firstPlayerActive = true;
      secondPlayerActive = false;
      resetAllMoves()
      updatePossibleMoves(currentPlayerPosition_01);
    }
  }

  //Moves player.
  function movePlayer(userPlayerPosition, player) {
    //If the clicked tile id integer corresponds to the integers in the possible moves array,
    //then player will be moved accordingly if NOT movement will happen.
    if (updatePossibleMoves(userPlayerPosition).includes(parseInt(event.target.id))) {
      userPlayerPosition[0].classList.remove(player);
    	event.target.classList.add(player);
      //Resets past possible moves
      if (event.target.classList.contains('possible-move')) {
        resetAllMoves();
        updatePossibleMoves(userPlayerPosition);
      }
    }
    // Now the game needs to search for NEW possible moves AFTER having clicked thus update the playerposition:
    let currentPlayerPositionId = event.target.id;
    return currentPlayerPositionId;
  }

  //Resets all player's possible moves
  function resetAllMoves() {
    for (let i = 0; i <= allTiles.length - 1; i++) {
      allTiles[i].classList.remove('possible-move');
    }
  }

  //Gets player's position
  function getPlayerPosition(userPlayerPosition) {
    let currentPlayerPositionId = userPlayerPosition[0].id;
    return currentPlayerPositionId;
  }

  function fightHandler(button) {
    if (firstPlayerActive == true) {
      if(button.classList.contains("attack")) {
        healthContainer = document.getElementsByClassName("player_02-health")[0];
        attack(player_01, healthContainer, player_01.healthBar, player_01.healthBarPercentage);
      } else if (button.classList.contains("defend")) {
        defend(player_01);
      }

      firstPlayerActive = false;
      secondPlayerActive = true;

      if (player_02.health <= 0) {
        endGame(player_01);
      } else {
        toggleFight();
      }

    } else if (secondPlayerActive == true) {
      if(button.classList.contains("attack")) {
        healthContainer = document.getElementsByClassName("player_01-health")[0];
        attack(player_02, healthContainer, player_02.healthBar, player_02.healthBarPercentage);
      } else if (button.classList.contains("defend")) {
        defend(player_02);
      }

      firstPlayerActive = true;
      secondPlayerActive = false;

      if (player_01.health <= 0) {
        endGame(player_02);
      } else {
        toggleFight();
      }
    }
  } // end fightHandler

  function endGame(player) {
    // audio handler
    audio.pause();
    audio = new Audio('http://66.90.93.122/ost/pokemon-black-and-white/gmogjdcl/146%20Victory%20Against%20Gym%20Leader%21.mp3');
    audio.loop = true;
    audio.volume = 0.1;
    if(audio.paused) audio.play();

    document.getElementsByClassName("bar left-bar")[0].classList.add("invisible");
    document.getElementsByClassName("bar right-bar")[0].classList.add("invisible");
    document.querySelector(".battlescreen").classList.add("invisible");

    let victoryMessage = document.getElementById("victory-message");
    victoryMessage.classList.remove("invisible");
    victoryMessage.innerHTML = `
        <div class="end-message-wrapper">
          <p class="end-message">Congrats! ${player.name} has won with a score of ${player.health}<br>
          <img src="sprites/chars/kiiroitori-03.gif"><br>
          <a href=index.html>Play again!</a></p>
        </div>
    `;
  }

  function attack(currentPlayer, healthContainer, healthBar, healthPercentage) {
    // audio handler
    att = new Audio('http://66.90.93.122/ost/pokemon-sfx-gen-3-emerald-all-sound-effects-sfx/gwzspjdnjh/emerald%20000E%20-%20Hit%20Super%20Effective.mp3');
    att.volume = 0.1;
    att.play();

    if (currentPlayer.opponent.isDefending) {
      currentPlayer.opponent.health -= (10 + currentPlayer.weapon) / 2;
    } else {
      currentPlayer.opponent.health -= (10 + currentPlayer.weapon);
    }

    healthContainer.innerHTML = `Health: ${currentPlayer.opponent.health}`;
    currentPlayer.opponent.isDefending = false;
    // handles opponent's healthbar percentage
    let opponentHealthPercentage = Math.round(currentPlayer.opponent.health / currentPlayer.opponent.maxHealth * 100);
    currentPlayer.opponent.healthBar.setAttribute("style", `width:${opponentHealthPercentage}%`);
    currentPlayer.opponent.healthBar.innerHTML = `${opponentHealthPercentage}%`;
  }

  function defend(currentPlayer) {
    currentPlayer.isDefending = true;
  }

  function startFight(){
    audio.pause();
    audio = new Audio('http://66.90.93.122/ost/pokemon-black-and-white/axwqeqvp/145%20Victory%20is%20Right%20Before%20Your%20Eyes%21.mp3');
    audio.loop = true;
    audio.volume = 0.1;
    if(audio.paused) audio.play();
    mapContainer.classList.add('invisible');
    document.querySelector(".battlescreen").classList.remove("invisible");
    toggleFight();
  }

  function toggleFight() {
    if (firstPlayerActive == true) {
      document.getElementById("player_01-fight-button").classList.remove("invisible");
      document.getElementById("player_01-defend-button").classList.remove("invisible");
      document.getElementById("player_02-fight-button").classList.add("invisible");
      document.getElementById("player_02-defend-button").classList.add("invisible");
    } else if (secondPlayerActive == true) {
      document.getElementById("player_02-fight-button").classList.remove("invisible");
      document.getElementById("player_02-defend-button").classList.remove("invisible");
      document.getElementById("player_01-fight-button").classList.add("invisible");
      document.getElementById("player_01-defend-button").classList.add("invisible");
    }
  }

  //Updates possible moves of one player
  function updatePossibleMoves(userPlayerPosition) {
    let playerPosition = parseInt(getPlayerPosition(userPlayerPosition));
    let x = playerPosition % 10;
    let y = parseInt(playerPosition / 10);
    possibleMoves = [];

    //tile left of player
    for(let i = 1; i <= playerMoveLimit; i++) {
      if (mapTilesId[y][x-i] === undefined) break;
      let isObstacle = document.getElementById(mapTilesId[y][x-i]).classList.contains("obstacle");
      if (isObstacle) break;
      possibleMoves.push(mapTilesId[y][x-i]);

      //Check adjacent
      for(let i = 0; i <= adjacentLimit; i++) {
        let isPlayer = document.getElementById(mapTilesId[y][x-i]).classList.contains("opponent");
        if (isPlayer) {
          startFight();
        }
      }
    }

    //tile right of player
    for(let i = 1; i <= playerMoveLimit; i++) {
      if (mapTilesId[y][x+i] === undefined) break;
      let isObstacle = document.getElementById(mapTilesId[y][x+i]).classList.contains("obstacle");
      if (isObstacle) break;
      possibleMoves.push(mapTilesId[y][x+i]);

      //Check adjacent
      for(let i = 0; i <= adjacentLimit; i++) {
        let isPlayer = document.getElementById(mapTilesId[y][x+i]).classList.contains("opponent");
        if (isPlayer) {
          startFight();
        }
      }
    }

    //tile above player
    for(let i = 1; i <= playerMoveLimit; i++) {
      if (mapTilesId[y-i] === undefined) break;
      let isObstacle = document.getElementById(mapTilesId[y-i][x]).classList.contains("obstacle");
      if (isObstacle) break;
      possibleMoves.push(mapTilesId[y-i][x]);

      //Check adjacent
      for(let i = 0; i <= adjacentLimit; i++) {
        let isPlayer = document.getElementById(mapTilesId[y-i][x]).classList.contains("opponent");
        if (isPlayer) {
          startFight();
        }
      }
    }

    //tile under player
    for(let i = 1; i <= playerMoveLimit; i++) {
      if (mapTilesId[y+i] === undefined) break;
      let isObstacle = document.getElementById(mapTilesId[y+i][x]).classList.contains("obstacle");
      if (isObstacle) break;
      possibleMoves.push(mapTilesId[y+i][x]);

      //Check adjacent
      for(let i = 0; i <= adjacentLimit; i++) {
        let isPlayer = document.getElementById(mapTilesId[y+i][x]).classList.contains("opponent");
        if (isPlayer) {
          startFight();
        }
      }
    }

    //Loops array, sets 'possible-move' classes (these are the clickable tiles the players can move on).
    for (let i = 0; i <= possibleMoves.length; i++) {
      let possibleMove = document.getElementById(possibleMoves[i]);
      if (possibleMove !== null) {
        possibleMove.classList.add('possible-move');
      }
    }

    //Returns array with IDs's integers.
    return possibleMoves;
  }

  /* ============
  ==== Audio ====
  =============== */

  let audio = new Audio('http://66.90.93.122/ost/pokemon-heartgold-and-soulsilver/ydfqfxdj/111%20Route%201.mp3');

  window.onload = function() {
      try {
        // audio.play();
      } catch(err) {
        console.log('Audio error', err)
      }
   }

  audio.volume = 0.1;
  audio.loop = true;

  function muteAudio() {
    if (audio.muted == false) {
        document.getElementById('audioPlayer').muted = true;
    }
    else if (audio.muted == true) {
        document.getElementById('audioPlayer').muted = false;
    }
  }

  const musicMute = document.getElementById('mute-button')
  const musicUnmute = document.getElementById('unmute-button')

  musicMute.style.display = 'inline';
  musicUnmute.style.display = 'none';

  musicMute.addEventListener('click', () => {
    play(audio);
  });

  musicUnmute.addEventListener('click', () => {
    pause(audio);
  });

  function play(elem) {
      elem.muted = true;
      elem.pause();
      musicMute.style.display = 'none';
      musicUnmute.style.display = 'inline';
  }

  function pause(elem) {
    elem.muted = false;
    elem.play();
    musicMute.style.display = 'inline';
    musicUnmute.style.display = 'none';
  }

  /* ==================
  ==== Launch game ====
  ===================== */

  generateMap();
  generateDetails("grass", 7, 10);
  generateDetails("pebble", 5, 10);
  generateObstacles("lake");
  generateObstacles("tree");
  let weapon_01 = generateWeapons('weapon-01', 40);
  let weapon_02 = generateWeapons('weapon-02', 35);
  let weapon_03 = generateWeapons('weapon-03', 30);
  let weapon_04 = generateWeapons('weapon-04', 50);

  let player_01 = generatePlayer('player_01', "", "player_01-health-bar", 100, 0, true, reservedTiles[0], reservedTiles[1]);
  let player_02 = generatePlayer('player_02', "opponent", "player_02-health-bar", 100, 0, true, reservedTiles[2], reservedTiles[3]);
  player_01.opponent = player_02;
  player_02.opponent = player_01;
  getPlayerPosition(currentPlayerPosition_01);
  getPlayerPosition(currentPlayerPosition_02);
  updatePossibleMoves(currentPlayerPosition_01);

});
