//Show Img
function ShowImg() {
    $.ajax({
        url: "/card/data",
        method: 'get',
        cache: false,
        success: function (response) {
            var obj = JSON.parse(response);
            console.log(obj)
            document.getElementById('Show-Img').src = obj.ImgPath;
        }
    })
}

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

function dataURItoBlob(dataURI) {
    console.log(dataURI)
    var byteString = atob(dataURI.split(',')[1]);  
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
  
    var blob = new Blob([ab], {type: mimeString});
    return blob;
}

// $(document).ready(function () {
//     $('#btnSave').on('click',() => {
//         var dataUrl = $("#imageprev").attr('src');
//         let blob = dataURItoBlob(dataUrl)
//         document.getElementById('Show-Img').src = dataUrl;
//         let data = new FormData();
//         data.append('profile', blob, 'profile');
//         $.ajax({
//             url: '/card/upload/',
//             type: 'post',
//             data: data,
//             processData: false,
//             contentType: false,
//             success: function (data) {
//                 Swal.fire({
//                     position: 'center',
//                     icon: 'success',
//                     title: 'Uploded',
//                     text: 'Successfully uploaded.',
//                     showConfirmButton: true,
//                     confirmButtonText: 'OK',
//                     confirmButtonColor: '#dc3545',
//                     allowOutsideClick: false
//                 })
//             },
//             error: function (err) {
//                 errorText = err.responseJSON.message;
//                 Swal.fire({
//                     position: 'center',
//                     icon: 'warning',
//                     title: 'Warning',
//                     text: errorText,
//                     showConfirmButton: true,
//                     confirmButtonText: 'OK',
//                     confirmButtonColor: '#FF5733'
//                 });
//             }
//         })
//         closeCamera();
        
//     })

    
// })

$(document).ready(function () {
    $('#btnConfirmImg').on('click',() => {
        var dataUrl = $("#mobileImg").attr('src');
        let blob = dataURItoBlob(dataUrl)
        document.getElementById('showmobileImg').src = dataUrl;
        let data = new FormData();
        data.append('profile', blob, 'profile');
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
                    confirmButtonColor: '#007bff',
                    allowOutsideClick: false
                })
            },
            error: function (err) {
                errorText = err.responseJSON.message;
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Warning',
                    text: errorText,
                    showConfirmButton: true,
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#FF5733'
                });
            }
        })
        closeCamera();
        
    })

    
})






