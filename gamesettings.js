$(() => {
  const inputPlayerName = $("#player_name");
  const modalDialog = $("#dialog");
  const modalDialogText = $("#dialogText");
  const setPlayerName = $("#player");
  const inputNumberOfCards = $("#num_cards");
  const setHighscore = $("#high_score");
  $("#save_settings").on("click", () => {
    // when player name input field is invalid
    if (!inputPlayerName.val().trim()) {
      modalDialogText.text("Please enter player name");
      modalDialog.dialog("open");
    } else {
      // everytime settings (player name or number of cards) are changed highscore is reset
      sessionStorage.setItem("highScore", 0);
      setHighscore.text("Highscore: " + sessionStorage.highScore);

      sessionStorage.playerName = inputPlayerName.val();
      sessionStorage.numberOfCards = inputNumberOfCards.val() / 2;

      setPlayerName.text("Player: " + sessionStorage.playerName);
      inputPlayerName.val("");
      playgames(parseInt(sessionStorage.numberOfCards));
      modalDialogText.text(
        "Settings updated. You are now ready to play the game.",
      );
      modalDialog.dialog("open");
    }
  });
});
