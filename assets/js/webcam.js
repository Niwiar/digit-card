

function setCamera() {
    //set camera
Webcam.set({
    width: 350,
    height: 350,
    image_format: 'jpeg',
    jpeg_quality: 90
});
Webcam.attach( '#camera' );
}

// setCamera();

// function take_snapshot() {
    
//     Webcam.snap( function(data_url) {
//         document.getElementById('results').innerHTML = 
//          '<img id="imageprev" class="img-circle" src="'+data_url+'"/>';
//      } );
     
//      Webcam.reset();
// }

// function saveSnap() {
//     var URL = document.getElementById("imageprev").src;
//     console.log(URL)

//     setCamera();
// }