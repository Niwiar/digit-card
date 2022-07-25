//Show Card
function ShowCard() {
    $.ajax({
        url: "/card/data",
        method: 'get',
        cache: false,
        success: function (response) {
            var obj = JSON.parse(response);
            $('#IP-fname').val(obj.Fname);
            $('#IP-lname').val(obj.Lname);
            $('#IP-Tel').val(obj.Tel);
            $('#IP-Company').val(obj.Company);
            $('#IP-EmailLink').val(obj.Email);
            $('#IP-FacebookLink').val(obj.Facebook);
            $('#IP-LineLink').val(obj.Line);

            document.getElementById('Show-Img').src = obj.ImgPath;

            let fname = $.trim($('#IP-fname').val());
            $('#Show-fname').val(fname);

            // console.log(fname)
            // $('#IP-Img').val(obj.ImgPath);
        }
    })

}

// Show Img
// function ShowImg() {
//     $.ajax({
//         url: "/card/data",
//         method: 'get',
//         cache: false,
//         success: function (response) {
//             var obj = JSON.parse(response);
//             document.getElementById('Show-Img').src = obj.ImgPath;
//         }
//     })
// }


$(document).ready(function () {
    // Show Card
    ShowCard();

    // Show Pre-Card
    
    let fname =  $('#IP-fname').val();
    console.log(fname)
   
    
    // Edit Card
});