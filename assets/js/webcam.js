

function setCamera() {
    //set camera
Webcam.set({
    width: 320,
    height: 240,
    image_format: 'jpeg',
    jpeg_quality: 90
});
Webcam.attach( '#camera' );
document.getElementById('results').innerHTML = '';
}

function closeCamera() {
    Webcam.reset();
    document.getElementById('results').innerHTML = '';
    
}

function take_snapshot() {
    
    Webcam.snap( function(data_url) {
        document.getElementById('results').innerHTML = 
         '<img id="imageprev" class="cropped1" src="'+data_url+'"/>';
     } );
     
     Webcam.reset();
}

function saveSnap() {
    var URL = document.getElementById("imageprev").src;
    console.log(URL)
    setCamera();
}