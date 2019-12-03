var video = document.querySelector("#videoElement");
const mainContainer = document.querySelector('.container')

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


class MovingObject {
  constructor(){
    let newDiv = document.createElement('div')
    newDiv.id = 'dodger'
    newDiv.className = "dodger"
    newDiv.innerHTML = "😎"
    mainContainer.append(newDiv)
    this.element = newDiv
    this.element.style.left = `${20}px`
  }
  
  moveDodgerRight() {
    let leftNumbers = this.element.style.left.replace("px", "");
    let left = parseInt(leftNumbers, 10);
     
    if (left > 1500) {this.element.remove()}
    else if (left > 0) { this.element.style.left = `${left + 20}px`;}
  }

}
const objects = []
let object = new MovingObject(); 
setInterval(() => {
  objects.push(new MovingObject())
}, 5000)
setInterval( () => { objects.forEach(object => object.moveDodgerRight() )}, 300)
