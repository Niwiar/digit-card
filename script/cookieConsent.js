const acceptAllCookie =  $("#acceptAllCookie, #acceptCookies");
const acceptCookie =  $("#acceptCokie");
const cookiePopup = $("#cookiePopup");

const cookieName = "PrivaCookie";
const cookieValue = "Consent";
const cookieExpireDays = 1;


acceptAllCookie.on("click", () => {
    console.log('all click')
    createCookie(cookieName, cookieValue, cookieExpireDays);
});

acceptCookie.on("click", () => {
    console.log('some click')
    createCookie(cookieName, cookieValue, cookieExpireDays);
});

const createCookie = (cookieName, cookieValue, cookieExpireDays) => {
    let currentDate = new Date();
    currentDate.setTime(currentDate.getTime() + (cookieExpireDays*60*1000))
    let expires = `expires=${currentDate.toGMTString()}`;
    document.cookie = `${cookieName}=${cookieValue};${expires};path=/`;
    if(document.cookie){
        cookiePopup.css('display', 'none')
    } else{
        alert("ไม่สามารถตั้งค่าคุกกี้ได้ โปรดอนุญาตการใช้งานคุกกี้ทั้งหมดจากการตั้งค่าคุ้กกี้บนบราวเซอร์ของคุณ")
    }
}

const getCookie = (cookieName) => {
    let name = `${cookieName}=`;
    let decodedCookie = decodeURIComponent(document.cookie);
    console.log(decodedCookie)
    let ca = decodedCookie.split(';');
    for(let c of ca){
        c = c.trim();
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length)
        }
    }
    return "";
}

const checkCookie = () => {
    let check = getCookie(cookieName);
    console.log(check)
    if(check===""){
        cookiePopup.css('display', 'block')
    } else{
        cookiePopup.css('display', 'none')
    }
}

checkCookie();