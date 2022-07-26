let width = 320;    
let height = 0;     // This will be computed based on the input stream

let streaming = false;

let video = null;
let canvas = null;
let photo = null;
let startbutton = null;

function showViewLiveResultButton() {
    if (window.self !== window.top) {

        document.querySelector(".contentarea").remove();
        const button = document.createElementById("btnTake");
        button.textContent = "View live result of the example code above";
        document.body.append(button);
        button.addEventListener('click', () => window.open(location.href));
        return true;
    }
    return false;
}
function stop() {
    const data = '';
    photo.setAttribute('src', data);
    video = document.getElementById('video');
    const mediaStream = video.srcObject;
    const tracks = mediaStream.getVideoTracks();
    tracks[0].stop();

    tracks.forEach(track => track.stop())
    video.srcObject = null;

    $("#video").removeClass('hidden');
    $("#video").toggleClass('hidden');
}

function startup() {
    $("#video").removeClass('hidden');

    if (showViewLiveResultButton()) { return; }
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    photo = document.getElementById('imageprev');
    startbutton = document.getElementById('btnTake');


    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(function (stream) {
            video.srcObject = stream;
            video.play();
        })
        .catch(function (err) {
            console.log("An error occurred: " + err);
        });

    video.addEventListener('canplay', function (ev) {
        if (!streaming) {
            height = video.videoHeight / (video.videoWidth / width);

            if (isNaN(height)) {
                height = width / (4 / 3);
            }

            video.setAttribute('width', width);
            video.setAttribute('height', height);
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
            streaming = true;
        }
    }, false);

    startbutton.addEventListener('click', function (ev) {
        takepicture();
        ev.preventDefault();
    }, false);

}



function setCamera() {
    //set camera
    startup();
    const data = '';
    photo.setAttribute('src', data);
}

function takepicture() {
    const context = canvas.getContext('2d');

    if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);

        const data = canvas.toDataURL('image/png');
        // console.log(data)
        photo.setAttribute('src', data);
    } else {
        setCamera();
    }
    $("#video").removeClass('hidden');
    $("#video").toggleClass('hidden');
}

function dataURItoBlob(dataURI) {
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

$(document).ready(function () {
    $('#btnSave').on('click',() => {
        var dataUrl = $("#imageprev").attr('src');
        let blob = dataURItoBlob(dataUrl)
        document.getElementById('Show-Img').src = dataUrl;
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
                    confirmButtonColor: '#dc3545',
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
        // stop();
        
    })

    window.addEventListener('load', startup, false);
})


