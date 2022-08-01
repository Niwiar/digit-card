const webcamElement = document.getElementById('webcam');
const canvasElement = document.getElementById('canvas');
const snapSoundElement = document.getElementById('snapSound');
const webcam = new Webcam(webcamElement, 'user', canvasElement, snapSoundElement);



function startWebcam() {
    webcam.start()
   .then(result =>{
      console.log("webcam started");
   })
   .catch(err => {
       console.log(err);
   });
}

function stopWebcam() {
    webcam.stop();
}

function snapWebcam() {
    let picture = webcam.snap();
    document.querySelector('#download-photo').href = picture;
}

$('#cameraFlip').click(function() {
    webcam.flip();
    webcam.start();  
});

navigator.mediaDevices.getUserMedia(this.getMediaConstraints())
  .then(stream => {
      this._webcamElement.srcObject = stream;
      this._webcamElement.play();
  })
  .catch(error => {
     //...
  });