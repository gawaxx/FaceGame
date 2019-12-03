var video = document.querySelector("#videoElement");
window.addEventListener("click", () => {
  console.log(event.clientY);
});
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
    // mouthCoordinates(mouth);
    mouthIsOpen(mouth);
    // console.log(mouthIsOpen(mouth));
    // console.log(`X: ${mouth0._x}, Y: ${mouth0._y}`);
  }, 1000);
});

function mouthCoordinates(mouth) {
  // let innerLip = mouth.slice(-8);
  // innerLip.forEach(landmark =>
  //   console.log(`X: ${landmark._x}, Y: ${landmark._y}`)
  // );
  console.log(mouth);
}

function mouthIsOpen(mouth) {
  console.log(mouth);
  let outerLipTop = mouth[9].y;
  let innerLipTop = mouth[18].y;
  let innerLipBottom = mouth[14].y;
  let outerLipBottom = mouth[3].y;
  // console.log(`outerLipTop: ${outerLipTop}`);
  // console.log(`innerLipTop: ${innerLipTop}`);
  // console.log(`innerLipBottom: ${innerLipBottom}`);
  // console.log(`outerLipBottom: ${outerLipBottom}`);
  // console.log("---------------------------");

  // let topLipHeight = outerLipTop - innerLipTop;
  // let bottomLipHeight = innerLipBottom - outerLipBottom;
  // let totalLipHeight = topLipHeight + bottomLipHeight;

  let lipHeight = outerLipTop - outerLipBottom;
  let mouthHeight = innerLipTop - innerLipBottom;
  // let lipSize = lipHeight - mouthHeight;
  let mouthToLipRatio = mouthHeight / lipHeight; // produces % of height which is lip
  let mouthOpen = mouthToLipRatio > 0.8;
  // let mouthOpen = mouthHeight > totalLipHeight;
  console.log(`lipHeight: ${lipHeight} // mouthHeight: ${mouthHeight}`);
  console.log(`ratio: ${mouthToLipRatio} // mouthOpen: ${mouthOpen}`);
  if (mouthOpen) {
    return true;
  } else {
    return false;
  }
}

// Example closed:
// outerLipTop: 298.1619358062744
// innerLipTop: 282.05471992492676
// innerLipBottom: 236.75374031066895
// outerLipBottom: 223.34667205810547
// lipHeight: 75
// mouthHeight: 46
//
//
// Example open:
// outerLipTop: 317.14799880981445
// innerLipTop: 314.7025966644287
// innerLipBottom: 238.69019508361816
// outerLipBottom: 231.71459197998047
// lipHeight: 86
// mouthHeight: 76
