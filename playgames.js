$(() => {

  var numberOfCards = 24//default
  var playerName = "Guest"
  var staticImages
  var imageIds

  let refreshSetting = () => {
    numberOfCards = parseInt(sessionStorage.getItem("numberOfCards"))
    playerName = $('#player_name').val()
    staticImages = populateImagesMap()// delete if not used 
    imageIds = randomizeIndex()// get the randomize imagesIds to place the image
  }

  localStorage.setItem("highScore", 0)// this will store the highscore on all tabs
  let backImage = "./images/back.png" // address for card back side image

  //Delete if not used 
  const populateImagesMap = () => {
    var map = new Map()
    for (let i = 0; i < numberOfCards; i++) {
      map[i] = `./images/card_${i + 1}.png`
    }
    return map
  }
  //randomizeIndex randomize the indices of images so that images are not displayed at the same place every time
  const randomizeIndex = () => {
    const someArray1 = Array(numberOfCards).fill(1).map((x, y) => x + y)
    someArray1.sort(() => Math.random() - 0.5)
    const someArray2 = Array(numberOfCards).fill(1).map((x, y) => x + y)
    someArray2.sort(() => Math.random() - 0.5)
    return [...someArray1, ...someArray2]
  }


  //onClick action for playgames tab
  $("#new_game").on('click', () => {
    refreshSetting()
    let parentDiv = $("#tabs-1")
    parentDiv.removeAttr('class')
    let cards = $('#cards')
    cards.empty()

    for (let imageId of imageIds) {
      let childDiv = document.createElement('div')
      childDiv.className = "klass"
      cards.append(childDiv)
      let imageInsideChildDiv = document.createElement("img")
      imageInsideChildDiv.src = backImage
      imageInsideChildDiv.id = "picture"
      imageInsideChildDiv.className = "imageInTheDiv"
      $(imageInsideChildDiv).attr("index", `${imageId}`)
      childDiv.append(imageInsideChildDiv)
    }
  })

  //structure keep the track of state during the game
  let structure = {
    counter: 0,
    indexStack: [2],
    elementStack: [2],
    currentScore: 0,

    //won method checks if use has won, and set the high score in localStorage if score is higher that last highscore
    won: () => {
      let highScore = localStorage.getItem("highScore")
      if (highScore == 0 || structure.currentScore < highScore) {
        localStorage.setItem("highScore", structure.currentScore)
      }
      currentScore = 0
      previoustIndex = null
      alert(`Congrates you have won! Your score${structure.currentScore}. HighScore is ${highScore}!`)
      //TODO decide if we need to clear the state 
      //and refresh the settings below...OR winner animation keep on playing 
      structure.clearState(true, true)
      refreshSetting()
      //
    },
    //
    clearState: (resetScore, really) => {
      structure.counter = 0
      structure.indexStack.length = 0

      if (resetScore) {
        structure.currentScore = 0
      }
      if (really) {
        for (i in [0, 1]) {
          if (structure.elementStack[i])
            flipImage(structure.elementStack[i], structure.indexStack[i], true)
        }
      }
      structure.elementStack.length = 0

    }
  }

  //on click action for the image. this wil flip the image back and front based on the current state
  $(document).on('click', '.imageInTheDiv', function () {
    if (structure.counter == 2) {
      for (i in [0, 1]) {
        flipImage(structure.elementStack[i], structure.indexStack[i], true)
      }
      structure.clearState(false, false)
    }
    let image = $(this)
    let currentIndex = image.attr("index")

    flipImage(image, currentIndex, false)
    if (structure.counter == 0) {

      structure.elementStack[0] = image
      structure.indexStack[0] = currentIndex
      structure.counter++
      structure.currentScore++

    }
    else if (structure.elementStack[0][0] !== image[0] && structure.counter == 1) {
      structure.elementStack[1] = image
      structure.indexStack[1] = currentIndex
      structure.counter++
      structure.currentScore++
      if (structure.indexStack[0] == structure.indexStack[1]) {
        setTimeout(function () {
          structure.won()
        }, 2000);
        confetti()

      }
    }
  });

  //flipImage will flip the image based on the element passed and toggle flag
  const flipImage = (image, imageIndex, toggleBack) => {
    let imageSrc = toggleBack ? backImage : `./images/card_${imageIndex}.png`
    image.fadeOut('fast', function () {
      image.attr('src', imageSrc);
      image.fadeIn('slow');
    });
  }
function  confetti(){
  //TODO
}

})
