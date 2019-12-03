var video = document.querySelector("#videoElement");
window.addEventListener("click", () => {
  console.log(`${event.clientX},${event.clientY}`);
});
Promise.all([
  // faceapi.nets.tinyFaceDetector.loadFromUri("../src/models"),
  faceapi.nets.faceLandmark68TinyNet.loadFromUri("../src/models")
  // faceapi.nets.faceLandmark68Net.loadFromUri("../src/models")
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
    // const detections = await faceapi
    //   .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
    //   .withFaceLandmarks();
    // const resizedDetections = faceapi.resizeResults(detections, displaySize);
    // canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

    const landmarks = await faceapi.detectFaceLandmarksTiny(video);
    const mouth = landmarks.getMouth();
    let adj = mouthCoordinates(mouth);
    mouthIsOpen(adj);
  }, 500);
});

function mouthCoordinates(mouth) {
  adjMouth = [];
  mouth.forEach(landmark => {
    x = landmark.x + (window.innerWidth - video.width) / 2;
    y = landmark.y + (window.innerHeight - video.height) / 2;
    adjMouth.push({ x, y });
  });
  return adjMouth;
}

function mouthIsOpen(mouth) {
  // let outerLipTop = mouth[9];
  // let innerLipTop = mouth[18];
  // let innerLipBottom = mouth[14];
  // let outerLipBottom = mouth[3];

  const mouthHeight = faceapi.euclideanDistance(
    [mouth[14].x, mouth[14].y],
    [mouth[18].x, mouth[18].y]
  );
  const lipHeight = faceapi.euclideanDistance(
    [mouth[9].x, mouth[9].y],
    [mouth[3].x, mouth[3].y]
  );

  let mouthOpen = mouthHeight > 50;
  console.log(mouthOpen);
  return mouthOpen;
}
