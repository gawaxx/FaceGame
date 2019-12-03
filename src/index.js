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
