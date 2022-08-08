const acceptAllCookie =  $("#acceptAllCookie, #acceptCookies");
// const acceptCookie =  $("#acceptCookie");
const withdrawCookie =  $("#withdrawCookie");
const cookiePopup = $("#cookiePopup");
const reconsentCookie = $("#reconsentCookie")
const acceptFunctional =  $("#IP-Functional");

acceptAllCookie.on("click", () => {
    $.ajax({
        url: "/cookie/consent/",
        method: 'get',
        cache: false,
        success: function (response) {
            cookiePopup.css('display', 'none')
            reconsentCookie.show();
        }
    })
});

withdrawCookie.on("click", () => {
    $.ajax({
        url: "/cookie/withdraw/",
        method: 'get',
        cache: false,
        success: function (response) {
            cookiePopup.css('display', 'block')
            reconsentCookie.hide();
        }
    })
});

const checkCookie = () => {
    $.ajax({
        url: "/cookie/get/",
        method: 'get',
        cache: false,
        success: function (response) {
            let cookie = response.message
            if(cookie==="consented"){
                cookiePopup.hide();
                reconsentCookie.show();
            }else{
                cookiePopup.show();
                reconsentCookie.hide();
            }

        }
    })
}

checkCookie();