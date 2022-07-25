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
            // $('#IP-CardPass').val(obj.CardPass);
            // $('#IP-Img').val(obj.ImgPath);
        }
    })

}


$(document).ready(function () {
    // Show Card
    ShowCard()
    // Edit Card
});