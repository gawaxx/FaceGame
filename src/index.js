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
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    // faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
  }, 100);
});

class MovingObject {

  constructor(startingPos){
    this.width = "40px";
    this.height = "40px";
    this.x = startingPos.x;
    this.y = startingPos.y;
    console.log("Object has been created")
  }

  getPosition(){
    return { x: this.x, y: this.y }
  }

  update() {
    this.x += 1;
  }

}
document.addEventListener('keypress', myEventHandler)

function myEventHandler(e){
  // debugger
  const keyCode = e.keyCode;
  if (keyCode === 115) {
      console.log("STOP tOUCHING THE KEYBOARD");
  }
};