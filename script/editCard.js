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
            $('#IP-Email').val(obj.Email);
            $('#IP-FacebookLink').val(obj.Facebook);
            $('#IP-LineID').val(obj.Line);

            document.getElementById('Show-Img').src = obj.ImgPath;

            let fname = $.trim($('#IP-fname').val());
            let lname = $.trim($('#IP-lname').val());
            let Tel = $.trim($('#IP-Tel').val());
            let Company = $.trim($('#IP-Company').val());
            let Email = $.trim($('#IP-Email').val());
            let FacebookLink = $.trim($('#IP-FacebookLink').val());
            let LineID = $.trim($('#IP-LineID').val());

            $('#Show-fname').val(fname);
            $('#Show-lname').val(lname);
            $('#Show-Tel').val(Tel);
            $('#Show-Company').val(Company);
            $('#Show-EmailName').val(Email);

            document.getElementById('Show-FacebookLink').href = FacebookLink;
            document.getElementById('Show-LineID').href = "https://line.me/ti/p/~"+LineID;
            document.getElementById('Show-Tel').href = "tel://"+Tel;
            document.getElementById('Show-Email').href = "mailto:"+Email;

        }
    })

}

$(document).ready(function () {
    // Show Card
    ShowCard();

    // Show Pre-Card
    $('#IP-fname').on('input', () => $('#Show-fname').val($('#IP-fname').val()));
    $('#IP-lname').on('input', () => $('#Show-lname').val($('#IP-lname').val()));
    $('#IP-Company').on('input', () => $('#Show-Company').val($('#IP-Company').val()));
    $('#IP-Email').on('input', () => $('#Show-EmailName').val($('#IP-EmailName').val()));

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
                    tableEmploy.ajax.reload(null, false);
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
                console.log(suc)
                successText = suc.message;
                linkText = suc.link;
                Swal.fire({
                    position: 'center',
                    title: 'Publish',
                    icon: 'success',
                    html:
                        ''+successText+'<br>' +
                        'Your card link: <a href="'+linkText+'">'+linkText+'</a> ',
                    confirmButtonColor: '#007bff'
                    
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
        });

    });

    // Unpublish Card
    $(document).on("click", "#unpublish", function () {
        $.ajax({
            url: "/card/unpublish",
            method: 'get',
            cache: false,
            success: function (suc) {
                console.log(suc)
                successText = suc.message;
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Unpublish',
                    text: successText,
                    showConfirmButton: false,
                    timer: 1500
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
        });

    });

});