// this code does the following:
// 1- sets default settings variables and stores them in session storage upon inital page load
// 2= stores players array in session storage with "Guest" as player
// 3- new game settings taken from player input and updated in session storage
//

// session storage sample variables

// * "currentPlayerName": "Guest"
// * "numberOfCards": "48"

// * "players": "[{name: "Guest",highscore: 45}, {name: "Uzair",highscore: 45},{name: "Azeez",highscore: 56}]"
// players array stores history of player highscores
// usage:
// 1- read to show max highscore of all players
// 2- whenever a player wins update his personal highscore
// to read:
// players = JSON.parse(sessionStorage.getItem("players"))
// to write:
// players.push({name: "John", highscore: 34})
// sessionStorage.setItem("players", JSON.stringify(players))

$(() => {
  // initial default settings in session storage
  sessionStorage.setItem("players", JSON.stringify([{ name: "Guest", highscore: 0 }]));
  sessionStorage.setItem("numberOfCards", 48);
  sessionStorage.setItem("currentPlayerName", "Guest");

  const inputPlayerName = $("#player_name");
  const modalDialog = $("#dialog");
  const modalDialogText = $("#dialogText");
  const setPlayerName = $("#player");
  const inputNumberOfCards = $("#num_cards");
  const setNoOfCards = $("#noofcards");
  const setHighScore = $("#high_score");

  setNoOfCards.text("No of cards: " + sessionStorage.numberOfCards);
  setPlayerName.text("Player: " + sessionStorage.currentPlayerName);
  console.log(getPlayerHighscore("Guest"));
  setHighScore.text("Highscore: " + getPlayerHighscore("Guest"));
  inputPlayerName.val(sessionStorage.currentPlayerName);

  // on click event to update settings
  $("#save_settings").on("click", () => {
    // when player name input field is invalid
    if (!inputPlayerName.val().trim()) {
      modalDialogText.text("Please enter player name");
      modalDialog.dialog("open");
    } else {
      sessionStorage.setItem("currentPlayerName", inputPlayerName.val());
      sessionStorage.setItem("numberOfCards", inputNumberOfCards.val() / 2);

      setNoOfCards.text("No of cards: " + inputNumberOfCards.val());
      setPlayerName.text("Player: " + sessionStorage.currentPlayerName);
      inputPlayerName.val(sessionStorage.currentPlayerName);

      modalDialogText.text("Settings updated. You are now ready to play the game.");
      modalDialog.dialog("open");
      // inputPlayerName.val("");
    }
  });
});

// utility functions for getting player details from session storage "players" array

// takes player name of String type returns -1 when player does not exist in session storage players array
function getPlayerHighscore(playerName) {
  const players = JSON.parse(sessionStorage.getItem("players"));
  let playerHighscore = -1;
  players.forEach(player => {
    if (player.name === playerName) playerHighscore = player.highscore;
  });
  return playerHighscore;
}

// takes player name of String type returns false when player does not exist in session storage players array
function checkIfPlayerExists(playerName) {
  const players = JSON.parse(sessionStorage.getItem("players"));
  let exists = false;
  players.forEach(player => {
    if (player.name === playerName) exists = true;
  });
  return exists;
}

// takes player name of String type and highscore value returns true when update successful
function updatePlayerScore(playerName, score) {
  if (checkIfPlayerExists(playerName)) {
    const prevScore = getPlayerHighscore(playerName);
    if (prevScore < score) {
      const players = JSON.parse(sessionStorage.getItem("players"));
      players.map(player => {
        if (player.name === playerName) player.highscore = score;
      });
      sessionStorage.setItem("players", JSON.stringify(players));
    }
    return true;
  } else {
    return false;
  }
}
