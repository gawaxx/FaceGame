var video = document.querySelector("#videoElement");

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("../src/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("../src/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("../src/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("../src/models")
  // faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  // faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  // faceapi.nets.ssdMobilenetv1.loadFromUri("/models")
]).then(start);

function start() {
  navigator.getUserMedia(
    { video: {} },
    stream => (video.srcObject = stream),
    err => console.error(err)
  );
}

video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);
  setInterval(async () => {
    const detections = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    const landmarks = await faceapi.detectFaceLandmarks(video);
    const mouth = landmarks.getMouth();
    // mouthCoordinates(mouth);
    // mouthIsOpen(mouth);
    // console.log(mouthIsOpen(mouth));
    // console.log(`X: ${mouth0._x}, Y: ${mouth0._y}`);
  }, 500);
});
// class MovingObject {

//   constructor(){
//     // this.width = "40px";
//     // this.height = "40px";
//     // this.x = startingPos.x;
//     // this.y = startingPos.y;
//     this.setUpKeyHandlers();
//     console.log("Object has been created")
//     let newDiv = document.createElement('div')
//     newDiv.className = "Element"
//     otherDiv.append(newDiv)
//   }

//   getPosition(){
//     return { x: this.x, y: this.y }
//   }

//   setUpKeyHandlers() {
//       window.addEventListener("keypress", e => {
//         const keyCode = e.keyCode
//         if (keyCode === 115) {
//           this.newDiv.x++;
//           console.log(player)
//         }
//       });
//     };
  
// }
// // document.addEventListener('keypress', myEventHandler)

// const player = new MovingObject()


let dodger = document.getElementById("dodger");

function moveDodgerLeft() {
    let leftNumbers = dodger.style.left.replace("px", "");
    let left = parseInt(leftNumbers, 10);
   
    if (left > 0) { dodger.style.left = `${left - 1}px`;}
}

function moveDodgerRight() {
    let leftNumbers = dodger.style.left.replace("px", "");
    let left = parseInt(leftNumbers, 10);
   
    if (left > 0) { dodger.style.left = `${left + 1}px`;}
}

function moveDodgerUp() {
  let bottomNumbers = dodger.style.bottom.replace("px", "");
    let bottom = parseInt(bottomNumbers, 10);
   
    if (bottom > 0) { dodger.style.bottom = `${bottom + 1}px`;}
}

function moveDodgerDown() {
  let bottomNumbers = dodger.style.bottom.replace("px", "");
    let bottom = parseInt(bottomNumbers, 10);
   
    if (bottom > 0) { dodger.style.bottom = `${bottom - 1}px`; }
}
  

document.addEventListener("keydown", function(e) {
    if (e.key === "ArrowLeft") {
      moveDodgerLeft();
    }
    else if (e.key === "ArrowRight") {
        moveDodgerRight();
    }
    else if (e.key === "ArrowUp") {
      moveDodgerUp();
    }
    else if (e.key === "ArrowDown") {
      moveDodgerDown();
    }
});
