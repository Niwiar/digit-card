//Show Card
function ShowCard(cardName) {
    $.ajax({
        url: "/card/data/" + cardName,
        method: 'get',
        cache: false,
        success: function (response) {
            var obj = JSON.parse(response);
            $('#ProNo').text(obj.QuotationNo_Revised);
            $('#CusName').val(obj.CustomerName);
            $('#QDate').val(obj.QuotationDate);
            $('#CusEmail').val(obj.CustomerEmail);
            $('#ComName').val(obj.CompanyName);
            $('#Adress').val(obj.CompanyAddress);

            $('#PJ_Name').val(obj.QuotationSubject);
            $('#PJ_Discount').val(obj.QuotationDiscount);
            $('#PJ_Validity').val(obj.QuotationValidityDate);
            $('#PJ_Payment1').val(obj.QuotationPayTerm.QuotationPayTerm1);
            $('#PJ_Payment2').val(obj.QuotationPayTerm.QuotationPayTerm2);
            $('#PJ_Payment3').val(obj.QuotationPayTerm.QuotationPayTerm3);
            $('#PJ_Delivery').val(obj.QuotationDelivery);
            $('#PJ_Remark').val(obj.QuotationRemark);
            $('#PJ_End_Customer').val(obj.EndCustomer);
            $('#PJ_Approve').val(obj.EmployeeApproveId);

            $('#TotalPrice').val(obj.QuotationTotalPrice);
            $('#PriceAfter').val(obj.QuotationNet);
            $('#Vat').val(obj.QuotationVat);
            $('#NetTotal').val(obj.QuotationNetVat);

        }
    })

}


$(document).ready(function () {
    // Show Card

    // Edit Card
});