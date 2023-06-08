//Show Card
function ShowMyCard(CardName) {
  $.ajax({
    url: "/card/show/" + CardName,
    method: "get",
    cache: false,
    success: function (res) {
      console.log(res);
      var obj = JSON.parse(res);
      Link = obj.Link;

      // document.getElementById('Show-Img').src = obj.ImgPath;
      // document.getElementById('mobileImg').src = obj.ImgPath;
      document.getElementById("showmobileImg").src = obj.ImgPath;

      let Fname = obj.Fname;
      let Lname = obj.Lname;
      let Tel = obj.Tel;
      let Company = obj.Company;
      let Email = obj.Email;
      console.log(Email);
      let FacebookLink = obj.Facebook;
      let LineID = obj.Line;

      let BgColor = obj.BgColor;
      let Theme = obj.Theme;

      $(".image").css("background", obj.BgColor);
      $(".header").css("background", obj.BgColor);

      if (Theme == "dark") {
        $(".profile-card").css("background", "#555555");
        $(".profile-card .card-text").css("color", "#fff");
        $("#Day_Night,.main-content").removeClass("night");
        $(".fa-sun, .fa-moon ").addClass("d-none");
        $(".fa-moon ").removeClass("d-none");
      } else {
        $(".profile-card").css("background", "#fff");
        $(".profile-card .card-text").css("color", "#333");
        $("#Day_Night,.main-content").removeClass("night");
        $("#Day_Night,.main-content").addClass("night");
        $(".fa-sun, .fa-moon ").addClass("d-none");
        $(".fa-sun ").removeClass("d-none");
      }

      

      $("#Show-fname").text(Fname + " " + Lname);
      // $('#Show-lname').val(lname);
      $("#Show-Tel").val(Tel);
      $("#Show-Company").text(Company);
      $("#Show-Tel").val(Tel);
      $("#Show-Email-text").text(Email);

      document.getElementById("Show-FacebookLink").href = FacebookLink;
      document.getElementById("Show-LineID").href =
        "https://line.me/ti/p/~" + LineID;
      document.getElementById("Show-Tel").href = "tel://" + Tel;
      document.getElementById("Show-Email").href = "mailto:" + Email;
      $("#share-button").attr("data-a2a-url", Link);
    },
  });
}

$(document).ready(function () {
  $(".pre-title").hide();
  let hostname = window.location.hostname;

  const CardName = hostname.split(".");
  ShowMyCard(CardName[0]);

  $(document).on("click", "#Day_Night", function () {
    if (!$(".day-night").hasClass("night")) {
      $("#Day_Night,.main-content").toggleClass("night");
      $(".fa-sun, .fa-moon ").toggleClass("d-none");
    } else {
      $("#Day_Night,.main-content").toggleClass("night");
      $(".fa-sun, .fa-moon ").toggleClass("d-none");
    }
  });
});
