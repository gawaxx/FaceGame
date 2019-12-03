var video = document.querySelector("#videoElement");
const mainContainer = document.querySelector('.container')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("../src/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("../src/models")
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
    const usefullPoints = []
    startThrow(mouth)
    // mouthCoordinates(mouth);
    // console.log(`X: ${mouth0._x}, Y: ${mouth0._y}`);
  }, 2);
});


function mouthCoordinates(mouth) {
  let innerLip = mouth.slice(-8);
  innerLip.forEach(landmark =>
    console.log(`X: ${landmark._x}, Y: ${landmark._y}`)
)};


class MovingObject {
  constructor(){
    let newDiv = document.createElement('div')
    newDiv.id = 'dodger'
    newDiv.className = "dodger"
    newDiv.innerHTML = "😎"
    this.x = 10;
    this.y = 10;
    mainContainer.append(newDiv)
    this.element = newDiv
    this.element.style.left = `${20}px`
  }
  
  moveDodgerRight() {
    let leftNumbers = this.element.style.left.replace("px", "");
    let left = parseInt(leftNumbers, 10);

    // let bottomNumbers = this.element.style.left.replace("px", "");
    // let bottom = parseInt(bottomNumbers, 10);
     
    if (left > 1500) {this.element.remove()}
    else if (left > 0) { this.element.style.left = `${left + 20}px`; this.x = left + 20 }
  }

  isCollide(mouth) {
    debugger
    let rect1 = {x: this.x, y: this.y, width: 60, height: 60}
    let rect2 = {x: mouth.x , y: mouth.y , width: mouth.width, height: mouth.height} 
    if (rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y) {
       console.log("Collision")
   }
  }
}

function startThrow(mouth){
  const objects = []
  setInterval(() => {
    objects.push(new MovingObject())
  }, 5000)
  setInterval( () => { objects.forEach(object => object.moveDodgerRight() )} , 300)
  setInterval( () => {objects.forEach(object => object.isCollide(mouth))}, 10 )
}



