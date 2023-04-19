//Show Card
function ShowMyCard(CardName) {
  $.ajax({
    url: "/card/show/" + CardName,
    method: "get",
    cache: false,
    success: function (response) {
      var obj = JSON.parse(response);
      Link = obj.Link;

      // document.getElementById('Show-Img').src = obj.ImgPath;
      // document.getElementById('mobileImg').src = obj.ImgPath;
      document.getElementById("showmobileImg").src = obj.ImgPath;

      let Fname = obj.Fname;
      let Lname = obj.Lname;
      let Tel = obj.Tel;
      let Company = obj.Company;
      let Email = obj.Email;
      let FacebookLink = obj.Facebook;
      let LineID = obj.Line;

      $("#Show-fname").val(Fname + " " + Lname);
      // $('#Show-lname').val(lname);
      $("#Show-Tel").val(Tel);
      $("#Show-Company").val(Company);
      $("#Show-Tel").val(Tel);
      $("#Show-EmailName").val(Email);

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
  $('.pre-title').hide();
  let hostname = window.location.hostname;
  
  const CardName = hostname.split(".");
  console.log(CardName[0]);
  ShowMyCard(CardName[0]);
});
