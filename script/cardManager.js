$(document).ready(function () {


    // Table
    function fill_table() {
        table = $('#tableShow').DataTable({
            "bDestroy": true,
            "ajax": {
                "url": '/dashboard/cardlist',
                "dataSrc": ""
            },
            "columns": [
                {
                    "data": "index"
                },
                {
                    "data": "CardName"
                },
                {
                    "data": "Fname"
                },
                {
                    "data": "Lname"
                },
                {
                    "data": "Tel"
                },
                {
                    "data": "Email"
                },
                {
                    "data": "Facebook"
                },
                {
                    "data": "Line"
                },
                {
                    "defaultContent": "<div class='text-center'><div class='sp-b' role='group' aria-label='Basic mixed styles example'><button type='button' class='btn btn-primary p-1' id='btnEditTable' style='width: 2rem;'><i class='fa fa-pencil-square-o'></i></button><button type='button' class='btn btn-warning p-1' id='btnEditPass' style='width: 2rem;'><i class='fa fa-key text-light' aria-hidden='true'></i></button><button type='button' style='width: 2rem;' class='btn btn-danger p-1 ' id='btnDelTable'><i class='fa fa-remove'></i></button></div></div>"
                }
                ,
                {
                    "data": "CardId"
                }

            ], "columnDefs": [
                {
                    "targets": [9],
                    "visible": false
                },
            ],
        });
    }
    fill_table()

    //Edit Table Card
    $(document).on("click", "#btnEditTable", function () {
        $('#modalEditTable').modal('show');

        $("#formEditCard").trigger("reset");
        $(".modal-title").text("Edit Card");

        rows = $(this).closest("tr");
        let Fname = table.rows(rows).data()[0].Fname;
        let Lname = table.rows(rows).data()[0].Lname;
        let Tel = table.rows(rows).data()[0].Tel;
        let Email = table.rows(rows).data()[0].Email;
        let Facebook = table.rows(rows).data()[0].Facebook;
        let Line = table.rows(rows).data()[0].Line;

        let CardId = table.rows(rows).data()[0].CardId;
        
        // show old data 
        $('#IP-Fname').val(Fname);
        $('#IP-Lname').val(Lname);
        $('#IP-Tel').val(Tel);
        $('#IP-Email').val(Email);
        $('#IP-FacebookLink').val(Facebook);
        $('#IP-LineID').val(Line);

        // Click Edit
        $("#SaveEditCard").unbind();
        $("#SaveEditCard").click(function () {
            let fname = $.trim($('#IP-Fname').val());
            let lname = $.trim($('#IP-Lname').val());
            let Tel = $.trim($('#IP-Tel').val());
            // let Company = $.trim($('#IP-Company').val());
            let Email = $.trim($('#IP-Email').val());
            let FacebookLink = $.trim($('#IP-FacebookLink').val());
            let LineID = $.trim($('#IP-LineID').val());
            $.ajax({
                url: "/dashboard/card_edit/" + CardId,
                method: 'put',
                contentType: 'application/json',
                data: JSON.stringify({
                    Fname: fname,
                    Lname: lname,
                    Tel: Tel,
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
                    table.ajax.reload(null, false);
                    $('#modalEditTable').modal('hide');

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
        $(".close").click(function () {
            $('#modalEditTable').modal('hide');
        });
    });

    // Edit Pass
    $(document).on("click", "#btnEditPass", function () {
        $('#modalPassMaster').modal('show');
        $("#formPass").trigger("reset");
        $(".modal-title").text("Change Password");

        

        rows = $(this).closest("tr");
        let CardId = table.rows(rows).data()[0].CardId;

        $("#modalSaveEdit").unbind();
        $("#modalSaveEdit").click(function () {
            let CardPass = $.trim($('#modalInpEdEmployPassword').val());

            console.log(CardPass)

            $.ajax({
                url: "/dashboard/card_change_password/" + CardId,
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
                    $('#modalPassMaster').modal('hide');
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
            $('#modalPassMaster').modal('hide');
        })
    });
})
