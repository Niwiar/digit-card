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
                    "defaultContent": "<div class='text-center'><div class='sp-b' role='group' aria-label='Basic mixed styles example'><button type='button' class='btn btn-primary p-1' id='btnEditCompany' style='width: 2rem;'><i class='fa fa-pencil-square-o'></i></button><button type='button' style='width: 2rem;' class='btn btn-danger p-1 ' id='btnDelCompany'><i class='fa fa-remove'></i></button></div></div>"
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
})
