// this code does the following:
// 1- runs the game on clicking "New Game"
// 2- fetches game settings from session storage before running game
// 3- displays "Correct" when a game finishes (see formula)
// 4- defines game logic

// formula for highscore/correct:
// ( correctSelections / ( correctSelections + wrongSelections ) ) * 100
// correctSelections = if two consecutive selections have same image then update correctSelections by 1
// wrongSelections = if two consecutive selections do not have same image then update wrongSelections by 1

function PlayGame(numberOfCards, playerName) {
  this.playerName = playerName;
  this.numberOfCards = parseInt(numberOfCards);
  this.backImage = "./images/back.png"; // address for card back side image
}
//Delete if not used
PlayGame.prototype.getStaticImages = function populateImagesMap() {
  var map = new Map();
  for (let i = 0; i < this.numberOfCards; i++) {
    map[i] = `./images/card_${i + 1}.png`;
  }
  return map;
};
// get the randomize imagesIds to place the image
PlayGame.prototype.getImageIds = function randomizeIndex() {
  const someArray1 = Array(this.numberOfCards)
    .fill(1)
    .map((x, y) => x + y);
  const someArray2 = Array(this.numberOfCards)
    .fill(1)
    .map((x, y) => x + y);
  return [...someArray1, ...someArray2].sort(() => Math.random() - 0.5);
};

// utility functions for getting player details from session storage "players" array

// takes player name of String type returns -1 when player does not exist in session storage players array
PlayGame.prototype.getPlayerHighscore = function () {
  const players = JSON.parse(sessionStorage.getItem("players"));
  let playerHighscore = -1;
  players.forEach(player => {
    if (player.name === this.playerName) playerHighscore = parseInt(player["highscore"]);
  });
  return playerHighscore;
};

// takes player name of String type returns false when player does not exist in session storage players array
PlayGame.prototype.checkIfPlayerExists = function () {
  const players = JSON.parse(sessionStorage.getItem("players"));
  let exists = false;
  players.forEach(player => {
    if (player.name === this.playerName) exists = true;
  });
  return exists;
};

// takes player name of String type and highscore value returns true when update successful
PlayGame.prototype.updatePlayerScore = function (score) {
  const score_ = parseInt(score);
  const players = JSON.parse(sessionStorage.getItem("players"));
  players.map(player => {
    if (player.name === this.playerName) {
      if (score > parseInt(player.highscore)) player["highscore"] = score_;
    }
  });
  sessionStorage.setItem("players", JSON.stringify(players));
};
// creates new player
PlayGame.prototype.createPlayer = function (score) {
  const score_ = parseInt(score);
  const players = JSON.parse(sessionStorage.getItem("players"));
  players.push({ name: this.playerName, highscore: score_ });
  sessionStorage.setItem("players", JSON.stringify(players));
};

PlayGame.prototype.getHighestScore = function () {
  const players = JSON.parse(sessionStorage.getItem("players"));
  let maxScore = 0;
  players.forEach(player => {
    if (parseInt(player.highscore) > 0) maxScore = parseInt(player.highscore);
  });
  return maxScore;
};

$(() => {
  //onClick action for playgames tab
  let game;
  
  $("#new_game").on("click", function setupGameGrid() {
    // confetty congrgulations
    $.confetti.start();
    setTimeout(() => {
      $.confetti.stop();
    }, 2000);
    $("#play_game").trigger("click");
    // reset correct to 0
    console.log("current player: ", sessionStorage.currentPlayerName);
    game = new PlayGame(sessionStorage.numberOfCards, sessionStorage.currentPlayerName);

    let parentDiv = $("#tabs-1");
    parentDiv.removeAttr("class");
    let cards = $("#cards");
    cards.empty();

    for (let imageId of game.getImageIds()) {
      let childDiv = document.createElement("div");
      childDiv.className = "klass";
      cards.append(childDiv);
      let imageInsideChildDiv = document.createElement("img");
      imageInsideChildDiv.src = game.backImage;
      imageInsideChildDiv.id = "picture";
      imageInsideChildDiv.className = "imageInTheDiv";
      $(imageInsideChildDiv).attr("index", `${imageId}`);
      childDiv.append(imageInsideChildDiv);
    }
  });

  //structure keep the track of state during the game
  let structure = {
    locked: false,
    counter: 0,
    indexStack: [2],
    elementStack: [2],
    correctSelections: 0,
    incorrectSelections: 0,

    imageMatched: () => {
      let highScore = localStorage.getItem("highScore");
      if (highScore == 0 || structure.currentScore < highScore) {
        localStorage.setItem("highScore", structure.currentScore);
      }
      currentScore = 0;
      previoustIndex = null;
      // alert(`Congrates you have won! Your score${structure.currentScore}. HighScore is ${highScore}!`);
      // //TODO decide if we need to clear the state
      // //and refresh the settings below...OR winner animation keep on playing
      structure.clearState(true, true);
      //
    },
    //
    clearState: (resetScore, really) => {
      structure.counter = 0;
      structure.indexStack.length = 0;

      if (resetScore) {
        structure.currentScore = 0;
      }
      if (really) {
        for (i in [0, 1]) {
          if (structure.elementStack[i]) structure.elementStack[i].css("visibility", "hidden");
          $(structure.elementStack[i])
            .promise()
            .done(function () {
              structure.locked = !structure.locked;
            });
        }
      }
      structure.elementStack.length = 0;
    },
  };

  //on click action for the image. this wil flip the image back and front based on the current state
  $(document).on("click", ".imageInTheDiv", function () {
    if (!structure.locked) {
      structure.locked = !structure.locked;
      if (structure.counter == 2) {
        structure.incorrectSelections++;
        console.log(structure.incorrectSelections);
        for (i in [0, 1]) {
          flipImage(structure.elementStack[i], structure.indexStack[i], true, false);
        }
        structure.clearState(false, false, true);
      }
      let image = $(this);
      let currentIndex = image.attr("index");

      flipImage(image, currentIndex, false, true);
    }
    //https://stackoverflow.com/questions/1065806/how-to-get-jquery-to-wait-until-an-effect-is-finished
  });

  //flipImage will flip the image based on the element passed and toggle flag
  const flipImage = (image, imageIndex, toggleBack, process) => {
    let imageSrc = toggleBack ? game.backImage : `./images/card_${imageIndex}.png`;
    //image.attr("src", imageSrc);
    image.fadeOut("fast", function () {
      image.attr("src", imageSrc);
      image.fadeIn("slow");
    });

    if (process) {
      $(image)
        .promise()
        .done(function () {
          if (structure.counter == 0) {
            structure.elementStack[0] = image;
            structure.indexStack[0] = imageIndex;
            structure.counter++;
            structure.currentScore++;
          } else if (structure.elementStack[0][0] !== image[0] && structure.counter == 1) {
            structure.elementStack[1] = image;
            structure.indexStack[1] = imageIndex;
            structure.counter++;
            structure.currentScore++;
            if (structure.indexStack[0] == structure.indexStack[1]) {
              //correctSelections ++
              structure.correctSelections++;
              console.log(structure.correctSelections);

              if (structure.correctSelections === game.numberOfCards) {
                console.log(structure.correctSelections);
                console.log(structure.incorrectSelections);
                const score =
                  (structure.correctSelections / (structure.correctSelections + structure.incorrectSelections)) * 100;

                $("#correct").text("Correct: " + parseInt(score));
                if (!game.checkIfPlayerExists()) {
                  game.createPlayer(score);
                } else {
                  game.updatePlayerScore(score);
                }
                $("#high_score").text("Highscore: " + game.getHighestScore());

                // reseting on game finish
                structure.correctSelections = 0;
                structure.incorrectSelections = 0;

                // confetty congrgulations
                $.confetti.start();
                setTimeout(() => {
                  $.confetti.stop();
                }, 5000);
              }
              structure.imageMatched();
            }
          }
          structure.locked = !structure.locked;
        });
    }
  };
});

