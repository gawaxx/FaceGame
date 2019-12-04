// Variables

var video = document.querySelector("#videoElement");
var mouthPoints = [];

const body = document.querySelector("body");
const mainContainer = document.querySelector(".container");

const getScoreBoard = document.querySelector("#scoreboard");
let scoreBoard = 0;

const ApiURL = "http://localhost:3000/score_boards";

// API Stuff

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json"
};

const getApi = url => fetch(url).then(resp => resp.json());
const patchApi = (url, patchInfo) =>
  fetch(url, {
    method: "PATCH",
    headers: headers,
    body: JSON.stringify(patchInfo)
  }).then(resp => resp.json());
const postApi = (url, postInfo) =>
  fetch(url, {
    method: "PATCH",
    headers: headers,
    body: JSON.stringify(postInfo)
  }).then(resp => resp.json());

const API = { getApi, patchApi, postApi };

// Code

window.addEventListener("click", () => {
  console.log(`${event.clientX},${event.clientY}`);
});

Promise.all([
  faceapi.nets.faceLandmark68TinyNet.loadFromUri("../src/models"),
  faceapi.nets.tinyFaceDetector.loadFromUri("../src/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("../src/models"),
  faceapi.nets.ssdMobilenetv1.loadFromUri("../src/models")
]).then(start);

function start() {
  navigator.getUserMedia(
    { video: {} },
    stream => (video.srcObject = stream),
    err => console.error(err)
  );
}

video.addEventListener("play", () => {
  // const canvas = faceapi.createCanvasFromMedia(video);
  // document.body.append(canvas);
  // const displaySize = { width: video.width, height: video.height };
  // faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks();

    let box = detections.detection.box;
    let rect = video.getBoundingClientRect();

    // const resizedDetections = faceapi.resizeResults(detections, displaySize);
    // canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    // faceapi.draw.drawDetections(canvas, resizedDetections);
    // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

    let landmarks = await faceapi.detectFaceLandmarksTiny(video);
    mouthRelativePositions = landmarks.relativePositions.slice(-20);

    getMouthCoordinates(mouthRelativePositions, box, rect);
    // mouthIsOpen();
    // boxCoordinates(box, rect);
  }, 200);
  startGame();
});

// function boxCoordinates(box, rect) {
//   theBoxCoordinates = [];
//   x = box.x + 0.5 * box.width + rect.x;
//   y = box.y + 0.5 * box.height + rect.y + 100;

//   return (theBoxCoordinates = { x: x, y: y });
// }

function getMouthCoordinates(positions, box, rect) {
  mouthPoints = [];
  positions.forEach(point => {
    x = parseInt(rect.x + box.x + point.x * box.width);
    y = parseInt(rect.y + box.y + point.y * box.height);
    mouthPoints.push({ x, y });
  });
  return mouthPoints;
}

function mouthIsOpen() {
  let mouth = mouthPoints;
  // Get relevant y coordinates from mouthPoints
  let outerLipTopRight = mouth[8].y;
  let outerLipTopMid = mouth[9].y;
  let outerLipTopLeft = mouth[10].y;
  let innerLipTopRight = mouth[17].y;
  let innerLipTopMid = mouth[18].y;
  let innerLipTopLeft = mouth[19].y;
  let innerLipBottomLeft = mouth[13].y;
  let innerLipBottomMid = mouth[14].y;
  let innerLipBottomRight = mouth[15].y;
  let outerLipBottomLeft = mouth[2].y;
  let outerLipBottomMid = mouth[3].y;
  let outerLipBottomRight = mouth[4].y;

  // Average out the lip heights and mouth heights
  mouthHeightLeft = innerLipTopLeft - innerLipBottomLeft;
  mouthHeightMid = innerLipTopMid - innerLipBottomMid;
  mouthHeightRight = innerLipTopRight - innerLipBottomRight;
  mouthHeightAvg = (mouthHeightLeft + mouthHeightMid + mouthHeightRight) / 3;

  lipHeightLeft = outerLipTopLeft - outerLipBottomLeft;
  lipHeightMid = outerLipTopMid - outerLipBottomMid;
  lipHeightRight = outerLipTopRight - outerLipBottomRight;
  lipHeightAvg = (lipHeightLeft + lipHeightMid + lipHeightRight) / 3;

  // For object detection, we need a mouth middle point.
  let mouthMiddle = {
    x: mouth[14].x,
    y: parseInt((mouth[14].y + mouth[18].y) / 2)
  };
  mouthPoints.push(mouthMiddle);

  // If our mouth measurements is 50% of lip measurement, mouth is open
  opening = parseInt((100 * mouthHeightAvg) / lipHeightAvg);
  let mouthOpen = opening >= 50;
  // console.log(`${opening}% open, ${mouthOpen}`);
  // console.log(`${mouthMiddle.x}, ${mouthMiddle.y}`);
  return mouthOpen;
}

function startGame() {
  const pieces = [];
  const foodGenerator = setInterval(() => {
    pieces.push(new Food());
  }, 5000);

  const notFoodGenerator = setInterval(() => {
    pieces.push(new NotFood());
  }, 20000);

  const pieceUpdater = setInterval(() => {
    pieces.forEach(piece => {
      piece.updatePosition();
      piece.collisionCheck();
    });
  }, 20);
  const intervals = [foodGenerator, notFoodGenerator, pieceUpdater];
}

class MovingObject {
  constructor() {
    // Give it a random starting position, 'fenced' at 50px window border
    this.position = {
      x: parseInt(100 + Math.random() * (window.innerWidth - 100)),
      y: parseInt(100 + Math.random() * (window.innerHeight - 100))
    };

    // Give it a random starting velocity
    let velX = Math.random();
    let velY = Math.random();
    let x = 0;
    let y = 0;
    Math.random() < 0.5 ? (x = velX * -1 * 10) : (x = velX * 10);
    Math.random() < 0.5 ? (y = velY * -1 * 10) : (y = velY * 10);
    x = parseInt(x);
    y = parseInt(y);
    this.velocity = { x: x, y: y };

    // Build the object
    let newDiv = document.createElement("div");
    this.element = newDiv;
    this.element.style.left = `${this.position.x}px`;
    this.element.style.bottom = `${this.position.y}px`;
    body.append(newDiv);
  }

  updatePosition() {
    let bounceX =
      this.position.x <= 50 || this.position.x >= window.innerWidth - 60;
    let bounceY =
      this.position.y <= 50 || this.position.y >= window.innerHeight - 60;
    if (bounceX) this.velocity.x *= -1;
    if (bounceY) this.velocity.y *= -1;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.element.style.left = `${this.position.x}px`;
    this.element.style.bottom = `${this.position.y}px`;
  }

  // collisionHandler() {
  //   console.log("Collision");
  //   this.element.remove();
  //   scoreBoard++;
  //   getScoreBoard.innerHTML = scoreBoard;
  //   pieceHitbox = { x: 0, y: 0, width: 0, height: 0 };
  //   return scoreBoard;
  //   debugger;
  // }

  collisionCheck() {
    // let xPosition = parseInt(this.element.style.left.replace("px", ""), 10);
    // let yPosition =
    //   window.innerHeight -
    //   parseInt(this.element.style.bottom.replace("px", ""), 10);
    let pieceHitbox = {
      x: this.position.x,
      y: this.position.y,
      width: 60,
      height: 60
    };

    let mouthHitBox = {
      x: mouthPoints[3].x,
      y: mouthPoints[3].y,
      width: 60,
      height: 60
    };

    if (
      pieceHitbox.x < mouthHitBox.x + mouthHitBox.width &&
      pieceHitbox.x + pieceHitbox.width > mouthHitBox.x &&
      pieceHitbox.y < mouthHitBox.y + mouthHitBox.height &&
      pieceHitbox.y + pieceHitbox.height > mouthHitBox.y &&
      mouthIsOpen()
    ) {
      // collisionHandler();
      console.log("Collision");
      // this.element.remove();
      // scoreBoard++;
      // getScoreBoard.innerHTML = scoreBoard;
      // pieceHitbox = { x: 0, y: 0, width: 0, height: 0 };
      // return scoreBoard;
      // debugger;
      if (this.element.className === "not-food") {
        // GAME OVER
        console.log("GAME OVER");
        this.element.remove();
      } else {
        console.log("GNOM NOM NOM");
        this.element.remove();
        scoreBoard++;
        getScoreBoard.innerHTML = scoreBoard;
      }
    }
  }
}

// let functionStuff = point => {
//   let pieceHitbox = { x: xPosition, y: yPosition, width: 60, height: 60 };
//   let mouthHitBox = { x: point.x, y: point.y, width: 60, height: 60 };

//   if (
//     pieceHitbox.x < mouthHitBox.x + mouthHitBox.width &&
//     pieceHitbox.x + pieceHitbox.width > mouthHitBox.x &&
//     pieceHitbox.y < mouthHitBox.y + mouthHitBox.height &&
//     pieceHitbox.y + pieceHitbox.height > mouthHitBox.y
//   ) {
// API.getApi(ApiURL).then(data => data.forEach( scoreboard => function(scoreboard){
//   scoreBoard = scoreboard.count
// }))

// console.log("Collision");
// this.element.remove();
// scoreBoard++;
// getScoreBoard.innerHTML = scoreBoard;

// Post to API at the end of the game
// let postInfo = {
//   count: scoreBoard,
// }

//         // API.postApi(`$[ApiURL}`, postInfo)
//       }
//     };
//     // functionStuff(theBoxCoordinates);
//   }
// }

// Definition of objects

class Food extends MovingObject {
  constructor() {
    super();
    const food = [
      "🍏",
      "🍎",
      "🍐",
      "🍊",
      "🍋",
      "🍌",
      "🍉",
      "🍇",
      "🍓",
      "🍈",
      "🍒",
      "🍑",
      "🍍",
      "🥭",
      "🥥",
      "🥝",
      "🍅",
      "🍆",
      "🥑",
      "🥦",
      "🥒",
      "🥬",
      "🌶",
      "🌽",
      "🥕",
      "🥔",
      "🍠",
      "🥐",
      "🍞",
      "🥖",
      "🥨",
      "🥯",
      "🧀",
      "🥚",
      "🍳",
      "🥞",
      "🥓",
      "🥩",
      "🍗",
      "🍖",
      "🌭",
      "🍔",
      "🍟",
      "🍕",
      "🥪",
      "🥙",
      "🌮",
      "🌯",
      "🥗",
      "🥘",
      "🥫",
      "🍝",
      "🍜",
      "🍲",
      "🍛",
      "🍣",
      "🍱",
      "🥟",
      "🍤",
      "🍙",
      "🍚",
      "🍘",
      "🍥",
      "🥮",
      "🥠",
      "🍢",
      "🍡",
      "🍧",
      "🍨",
      "🍦",
      "🥧",
      "🍰",
      "🎂",
      "🍮",
      "🍭",
      "🍬",
      "🍫",
      "🍿",
      "🍩",
      "🍪",
      "🌰",
      "🥜",
      "🍯",
      "🍺",
      "🍻",
      "🥂",
      "🍷",
      "🥃",
      "🍸",
      "🍹",
      "🍾"
    ];
    const item = food[parseInt(Math.random() * food.length)];
    this.element.className = "food";
    this.element.innerHTML = `${item}`;
  }
}

class NotFood extends MovingObject {
  constructor() {
    super();
    const notFood = [
      "⚽️",
      "🎱",
      "🥌",
      "🥊",
      "🎲",
      "🎺",
      "🚲",
      "🚕",
      "🚨",
      "🛩",
      "🚀",
      "🗿",
      "🗽",
      "🛸",
      "⚓️",
      "⏰",
      "🔮",
      "📸",
      "💣",
      "💊",
      "💎",
      "🔫",
      "🔧",
      "📦",
      "🛒",
      "🧶",
      "🎁",
      "📌",
      "📫",
      "🧦",
      "😎",
      "💩",
      "🤖"
    ];
    const item = notFood[parseInt(Math.random() * notFood.length)];
    this.element.className = "not-food";
    this.element.innerHTML = `${item}`;
  }
}
