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
  const inputPlayerName = $("#player_name");
  const modalDialog = $("#dialog");
  const modalDialogText = $("#dialogText");
  const setPlayerName = $("#player");
  const inputNumberOfCards = $("#num_cards");
  const setNoOfCards = $("#noofcards");
  const setHighScore = $("#high_score");

  setNoOfCards.text("No of cards: " + sessionStorage.numberOfCards * 2);
  setPlayerName.text("Player: " + sessionStorage.currentPlayerName);
  setHighScore.text("Highscore: " + 0);
  inputPlayerName.val(sessionStorage.currentPlayerName);

  // on click event to update settings
  $("#save_settings").on("click", () => {
    // when player name input field is invalid
    if (!inputPlayerName.val().trim()) {
      modalDialogText.text("Please enter player name");
      modalDialog.dialog("open");
    } else {
      sessionStorage.setItem("currentPlayerName", inputPlayerName.val().trim());
      sessionStorage.setItem("numberOfCards", inputNumberOfCards.val() / 2);

      setNoOfCards.text("No of cards: " + inputNumberOfCards.val());
      setPlayerName.text("Player: " + sessionStorage.currentPlayerName);
      setHighScore.text("Highscore: " + game.getPlayerHighscore(sessionStorage.currentPlayerName));
      // reset correct
      $("#correct").text("Correct: ");
      // inputPlayerName.val(sessionStorage.currentPlayerName);

      modalDialogText.text("Settings updated. Start new game to apply settings.");
      modalDialog.dialog("open");
      // inputPlayerName.val("");
    }
  });
});



