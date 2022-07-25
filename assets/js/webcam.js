

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

    closeCamera()

}
function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);
  
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  
    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
  
    // create a view into the buffer
    var ia = new Uint8Array(ab);
  
    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
  
    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], {type: mimeString});
    return blob;
  
  }

$(document).ready(function () {
    $('#btnSave').on('click',() => {
        var dataUrl = document.getElementById("imageprev").src;
        let blob = dataURItoBlob(dataUrl)
        let data = new FormData();
        data.append('image', blob, 'profile');
        console.log(data)
        $.ajax({
            url: '/card/upload/',
            type: 'post',
            data: data,
            processData: false,
            contentType: false,
            success: function (data) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Uploded',
                    text: 'Successfully uploaded.',
                    showConfirmButton: true,
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#dc3545',
                    allowOutsideClick: false
                })
            }
        })
        setCamera();
    })
})

