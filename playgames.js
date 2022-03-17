$(() => {
  // default value for number of cards/"numberOfCards" is 48
  sessionStorage.setItem("numberOfCards", 8 / 2);
  playgames(parseInt(sessionStorage.numberOfCards));
});

const populateImagesMap = numberOfCards => {
  var map = new Array(numberOfCards);
  for (let i = 0; i < numberOfCards; i++) {
    map[i] = `./images/card_${i + 1}.png`;
  }
  return map;
};

//randomizeIndex randomize the indices of images so that images are not displayed at the same place every time
const randomizeIndex = numberOfCards => {
  const someArray1 = Array(numberOfCards)
    .fill(1)
    .map((x, y) => x + y);
  const someArray2 = Array(numberOfCards)
    .fill(1)
    .map((x, y) => x + y);
  return [...someArray1, ...someArray2].sort(() => Math.random() - 0.5);
};

// called everytime session storage "numberOfCards" value is set/updated
// if 48 images need to be displayed then call playgames(48 / 2)
function playgames(numOfCards) {
  var numberOfCards = numOfCards; // initializing the number of cards
  let backImage = "./images/back.png"; // address for card back side image
  //Delete if not used

  var staticImages = populateImagesMap(numberOfCards); // delete if not used

  // gets executed everytime playgames function is called with card number value
  // $("#new_game").click(() => {
  let cards = $("#cards");
  cards.empty();

  var imageIds = randomizeIndex(numberOfCards); // get the randomize imagesIds to place the image
  console.log(imageIds);

  for (let imageId of imageIds) {
    let childDiv = document.createElement("div");
    childDiv.className = "klass";
    cards.append(childDiv);
    let imageInsideChildDiv = document.createElement("img");
    imageInsideChildDiv.src = staticImages[imageId];
    imageInsideChildDiv.id = "picture";
    imageInsideChildDiv.className = "imageInTheDiv";
    $(imageInsideChildDiv).attr("index", `${imageId}`);
    childDiv.append(imageInsideChildDiv);
  }
  // });

  //structure keep the track of state during the game
  let structure = {
    counter: 0,
    indexStack: [2],
    elementStack: [2],
    currentScore: 0,

    //won method checks if use has won, and set the high score in sessionStorage if score is higher that last highscore
    won: () => {
      let highScore = sessionStorage.getItem("highScore");
      if (highScore == 0 || structure.currentScore < highScore) {
        sessionStorage.setItem("highScore", structure.currentScore);
      }
      currentScore = 0;
      previoustIndex = null;
      alert(
        `Congrates you have won! Your score${structure.currentScore}. HighScore is ${highScore}!`,
      );
      structure.clearState(true, true);
    },

    clearState: (resetScore, really) => {
      structure.counter = 0;
      structure.indexStack.length = 0;

      if (resetScore) {
        structure.currentScore = 0;
      }
      if (really) {
        for (i in [0, 1]) {
          if (structure.elementStack[i])
            flipImage(structure.elementStack[i], structure.indexStack[i], true);
        }
      }
      structure.elementStack.length = 0;
    },
  };

  //on click action for the image. this wil flip the image back and front based on the current state
  $(document).on("click", ".imageInTheDiv", function () {
    if (structure.counter == 2) {
      console.log("structure counter is 2");
      for (i in [0, 1]) {
        flipImage(structure.elementStack[i], structure.indexStack[i], true);
      }
      structure.clearState(false, false);
    }
    let image = $(this);
    let currentIndex = image.attr("index");

    flipImage(image, currentIndex, false);
    if (structure.counter == 0) {
      structure.elementStack[0] = image;
      structure.indexStack[0] = currentIndex;
      structure.counter++;
      structure.currentScore++;
    } else if (
      structure.elementStack[0][0] !== image[0] &&
      structure.counter == 1
    ) {
      console.log(structure.elementStack);
      console.log(structure.indexStack);
      console.log(structure.counter);
      console.log(structure.currentScore);
      structure.elementStack[1] = image;
      structure.indexStack[1] = currentIndex;
      structure.counter++;
      structure.currentScore++;
      if (structure.indexStack[0] == structure.indexStack[1]) {
        structure.won();
      }
    }
  });

  //flipImage will flip the image based on the element passed and toggle flag
  const flipImage = (image, imageIndex, toggleBack) => {
    let imageSrc = toggleBack ? backImage : `./images/card_${imageIndex}.png`;
    image.fadeOut("fast", function () {
      image.attr("src", imageSrc);
      image.fadeIn("slow");
    });
  };
}
