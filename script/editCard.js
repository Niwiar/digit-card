
//Show Card
function ShowCard() {
    $.ajax({
        url: "/card/data",
        method: 'get',
        cache: false,
        success: function (response) {
            var obj = JSON.parse(response);
            Link = obj.Link
            Published = obj.Published
            $('#IP-fname').val(obj.Fname);
            $('#IP-lname').val(obj.Lname);
            $('#IP-Tel').val(obj.Tel);
            $('#IP-Company').val(obj.Company);
            $('#IP-Email').val(obj.Email);
            $('#IP-FacebookLink').val(obj.Facebook);
            $('#IP-LineID').val(obj.Line);

            // document.getElementById('Show-Img').src = obj.ImgPath;
            document.getElementById('mobileImg').src = obj.ImgPath;
            document.getElementById('showmobileImg').src = obj.ImgPath;

            let fname = $.trim($('#IP-fname').val());
            let lname = $.trim($('#IP-lname').val());
            let Tel = $.trim($('#IP-Tel').val());
            let Company = $.trim($('#IP-Company').val());
            let Email = $.trim($('#IP-Email').val());
            let FacebookLink = $.trim($('#IP-FacebookLink').val());
            let LineID = $.trim($('#IP-LineID').val());

            $('#Show-fname').val(fname+" "+lname);
            // $('#Show-lname').val(lname);
            $('#Show-Tel').val(Tel);
            $('#Show-Company').val(Company);
            $('#Show-EmailName').val(Email);

            

            document.getElementById('Show-FacebookLink').href = FacebookLink;
            document.getElementById('Show-LineID').href = "https://line.me/ti/p/~"+LineID;
            document.getElementById('Show-Tel').href = "tel://"+Tel;
            document.getElementById('Show-Email').href = "mailto:"+Email;
            $("#share-button").attr("data-a2a-url", Link);

            
            if ( Published == 1) {
                $("#share_button").attr("data-a2a-url", Link);
                $("#share-group").removeClass('hide');
            } else {
                $("#share-group").removeClass('hide');
                $("#share-group").toggleClass('hide');
            }
        }
    })

}

//copy to clipbord
function copyToclip() {
    /* Get the text field */
    var copyText = document.getElementById("copyLink");
  
    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */
  
    /* Copy the text inside the text field */
    navigator.clipboard.writeText(copyText.value);
    
    /* Alert the copied text */
    alert("คัลลอกลิงก์ " + copyText.value + " ลงคลิปบอร์ดสำเร็จ");
  }

$(document).ready(function () {
    // Show Card
    ShowCard();
    // Show Pre-Card
    $('#IP-fname').on('input', () => $('#Show-fname').val($('#IP-fname').val()+" "+$('#IP-lname').val()));
    // $('#IP-lname').on('input', () => $('#Show-lname').val($('#IP-lname').val()));
    $('#IP-Company').on('input', () => $('#Show-Company').val($('#IP-Company').val()));
    $('#IP-Email').on('input', () => $('#Show-EmailName').val($('#IP-Email').val()));

    $('#IP-FacebookLink').on('input', () => $('#Show-FacebookLink').href($('#IP-FacebookLink').val()));
    $('#IP-LineID').on('input', () => $('#Show-LineID').href("https://line.me/ti/p/~"+$('#IP-LineID').val()));
    $('#IP-Tel').on('input', () => $('#Show-Tel').href("tel://"+$('#IP-Tel').val()));
    $('#IP-Email').on('input', () => $('#Show-Email').href("mailto:"+$('#IP-Email').val()));


    // Edit Card
    $(document).on("click", "#EditCard", function () {

        let fname = $.trim($('#IP-fname').val());
        let lname = $.trim($('#IP-lname').val());
        let Tel = $.trim($('#IP-Tel').val());
        let Company = $.trim($('#IP-Company').val());
        let Email = $.trim($('#IP-Email').val());
        let FacebookLink = $.trim($('#IP-FacebookLink').val());
        let LineID = $.trim($('#IP-LineID').val());
        //camera
        // let MobileCamera = $.trim($('#IP-MobileCamera').val());
        // console.log(MobileCamera)
        // document.getElementById('pre-mobilePic').src = MobileCamera;


        $.ajax({
            url: "/card/edit",
            method: 'put',
            contentType: 'application/json',
            data: JSON.stringify({
                Fname: fname,
                Lname: lname,
                Tel: Tel,
                Company: Company,
                Email: Email,
                Facebook: FacebookLink,
                Line: LineID
            }),
            success: function (suc) {
                successText = suc.message;
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Edit',
                    text: successText,
                    showConfirmButton: false,
                    timer: 1500
                })
                ShowCard();
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
        });

    });

    // Change Password
    $(document).on("click", "#ChangePass", function () {
        $('#modalChangePass').modal('show');


        $("#btnChangePass").unbind();
        $("#btnChangePass").click(function () {
            let CardPass = $.trim($('#IP-CardPass').val());


            $.ajax({
                url: "/card/change_password/",
                method: 'put',
                contentType: 'application/json',
                data: JSON.stringify({
                    CardPass: CardPass
                }),
                success: function (succ) {
                    successText = succ.message;
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Change Success',
                        text: successText,
                        showConfirmButton: false,
                        timer: 1500
                    })
                    ShowCard();
                    $('#modalChangePass').modal('hide');
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
            });
        })
        $(".close,.no").click(function () {
            $('#modalChangePass').modal('hide');
        })
    });

    // Publish Card
    $(document).on("click", "#publish", function () {
        $.ajax({
            url: "/card/publish",
            method: 'get',
            cache: false,
            success: function (suc) {
                successText = suc.message;
                linkText = suc.link;
                $("#share_button").attr("data-a2a-url", linkText);
                Swal.fire({
                    position: 'center',
                    title: 'การเผยแพร่',
                    icon: 'success',
                    html:
                        ''+successText+'<br>' +
                        'link ของการ์ด: '+
                        '<input type="text" id="copyLink" class="box-w" value="'+linkText+'" disabled></input>'+
                        '<button onclick="copyToclip()" class = "btn btn-secondary"><i class="fa fa-clipboard" aria-hidden="true"></i></button>',
                    confirmButtonColor: '#007bff'
                });
                
                ShowCard();
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
        });

    });

    // Unpublish Card
    $(document).on("click", "#unpublish", function () {
        $.ajax({
            url: "/card/unpublish",
            method: 'get',
            cache: false,
            success: function (suc) {
                successText = suc.message;
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'การเผยแพร่',
                    text: successText,
                    showConfirmButton: false,
                    timer: 1500
                })
                ShowCard();
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
        });

    });

});