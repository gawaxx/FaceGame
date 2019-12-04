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
    mouthIsOpen(mouthPoints, box);
    boxCoordinates(box, rect);
  }, 500);
  startBaguetteThrow();
  setTimeout(startWineGlassThrow(), 30000);
  setTimeout(startBombThrow(), 1000);
});

function boxCoordinates(box, rect) {
  theBoxCoordinates = [];
  x = box.x + 0.5 * box.width + rect.x;
  y = box.y + 0.5 * box.height + rect.y + 100;

  return (theBoxCoordinates = { x: x, y: y });
}

function getMouthCoordinates(positions, box, rect) {
  mouthPoints = [];
  positions.forEach(point => {
    x = parseInt(rect.x + box.x + point.x * box.width);
    y = parseInt(rect.y + box.y + point.y * box.height);
    mouthPoints.push({ x, y });
  });
  return mouthPoints;
}

function mouthIsOpen(mouth, box) {
  // let outerLipTop = mouth[9].y;
  // let innerLipTop = mouth[18].y;
  // let innerLipBottom = mouth[14].y;
  // let outerLipBottom = mouth[3].y;
  // let headHeight = box.height;

  // const mouthHeight = faceapi.euclideanDistance(
  //   [mouth[14].x, mouth[14].y],
  //   [mouth[18].x, mouth[18].y]
  // );
  // const lipHeight = faceapi.euclideanDistance(
  //   [mouth[9].x, mouth[9].y],
  //   [mouth[3].x, mouth[3].y]
  // );
  // debugger;
  // console.log(`${parseInt((100 * mouthHeight) / box.height)}%`);
  // let mouthOpen = lipHeight > 0.13 * headHeight;
  // console.log(`${lipHeight},${mouthHeight}`);

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

  // If our mouth measurements is 50% of lip measurement, mouth is open
  opening = parseInt((100 * mouthHeightAvg) / lipHeightAvg);
  let mouthOpen = opening >= 50;
  console.log(`${opening}% open, ${mouthOpen}`);
  return mouthPoints;
}

class MovingObject {
  constructor() {
    // Give it a random starting position, 'fenced' at 50px window border
    this.position = {
      x: parseInt(50 + Math.random() * (window.innerWidth - 50)),
      y: parseInt(50 + Math.random() * (window.innerHeight - 50))
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
      this.position.x <= 50 || this.position.x >= window.innerWidth - 50;
    let bounceY =
      this.position.y <= 50 || this.position.y >= window.innerHeight - 50;
    if (bounceX) this.velocity.x *= -1;
    if (bounceY) this.velocity.y *= -1;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.element.style.left = `${this.position.x}px`;
    this.element.style.bottom = `${this.position.y}px`;
  }

  // moveDodgerRight() {
  //   let xPosition = this.element.style.left.replace("px", "");
  //   let x = parseInt(xPosition, 10);
  //   if (x > 1500) {
  //     this.element.remove();
  //   } else if (x >= 0) {
  //     this.element.style.left = `${x + 20}px`;
  //     this.x = x + 20;
  //   }
  // }

  // moveDodgerDown() {
  //   let yPosition = this.element.style.bottom.replace("px", "");
  //   let y = parseInt(yPosition, 10);

  //   if (y > 1200) {
  //     this.element.remove();
  //   } else if (y >= 0) {
  //     this.element.style.bottom = `${y + 20}px`;
  //     this.y = y + 20;
  //   }
  // }

  // moveDodgerSideWays() {
  //   let xPosition = this.element.style.left.replace("px", "");
  //   let x = parseInt(xPosition, 10);
  //   let yPosition = this.element.style.bottom.replace("px", "");
  //   let y = parseInt(yPosition, 10);

  //   if (y > 1200) {
  //     this.element.remove();
  //   }
  //   if (x > 1500) {
  //     this.element.remove();
  //   } else if (x >= 0) {
  //     this.element.style.left = `${x + 20}px`;
  //     this.x = x + 20;
  //     this.element.style.bottom = `${y - 20}px`;
  //     this.y = y - 20;
  //   }
  // }

  isCollide() {
    let xPosition = parseInt(this.element.style.left.replace("px", ""), 10);
    let yPosition =
      window.innerHeight -
      parseInt(this.element.style.bottom.replace("px", ""), 10);

    let functionStuff = point => {
      let rect1 = { x: xPosition, y: yPosition, width: 60, height: 60 };
      let rect2 = { x: point.x, y: point.y, width: 60, height: 60 };

      if (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
      ) {
        // API.getApi(ApiURL).then(data => data.forEach( scoreboard => function(scoreboard){
        //   scoreBoard = scoreboard.count
        // }))

        console.log("Collision");
        this.element.remove();
        scoreBoard++;
        getScoreBoard.innerHTML = scoreBoard;

        // Post to API at the end of the game
        // let postInfo = {
        //   count: scoreBoard,
        // }

        // API.postApi(`$[ApiURL}`, postInfo)
      }
    };
    functionStuff(theBoxCoordinates);
  }
}

// Definition of objects

class Baguette extends MovingObject {
  constructor() {
    super();
    this.element.className = "baguette";
    this.element.innerHTML = "🥖";
    // this.element.style.left = `${0}px`;
    // this.element.style.bottom = `${300}px`;
  }
}

class WineGlass extends MovingObject {
  constructor() {
    super();
    this.element.className = "WineGlass";
    this.element.innerHTML = "🍷";
    this.element.style.left = `${400}px`;
    this.element.style.bottom = `${0}px`;
  }
}

class Bomb extends MovingObject {
  constructor() {
    super();
    this.element.className = "bomb";
    this.element.innerHTML = "💣";
    this.element.style.left = `${0}px`;
    this.element.style.bottom = `${800}px`;
  }
}

// Objects being thrown

const baguettes = [];

function startBaguetteThrow() {
  setInterval(() => {
    baguettes.push(new Baguette());
  }, 5000);

  setInterval(() => {
    baguettes.forEach(object => object.updatePosition());
  }, 20);
  setInterval(() => {
    baguettes.forEach(object => object.isCollide());
  }, 10);
}

// const wineglasses = [];

// function startWineGlassThrow() {
//   setInterval(() => {
//     wineglasses.push(new WineGlass());
//   }, 8000);

//   setInterval(() => {
//     wineglasses.forEach(object => object.moveDodgerDown());
//   }, 200);
//   setInterval(() => {
//     wineglasses.forEach(object => object.isCollide());
//   }, 10);
// }

// const bombs = [];

// function startBombThrow() {
//   setInterval(() => {
//     bombs.push(new Bomb());
//   }, 15000);

//   setInterval(() => {
//     bombs.forEach(object => object.moveDodgerSideWays());
//   }, 100);
//   setInterval(() => {
//     bombs.forEach(object => object.isCollide());
//   }, 10);
// }
