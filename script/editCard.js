//Show Card
function ShowCard() {
  $.ajax({
    url: "/card/data",
    method: "get",
    cache: false,
    success: function (res) {
      console.log(res);
      var obj = JSON.parse(res);
      console.log(obj);
      console.log(window.location.host);
      Link = obj.Link;
      Published = obj.Published;
      newPageTitle = obj.CardName;
      $("a.copyLink")
        .text(`${obj.CardName}.${window.location.host}`)
        .attr("href", `http://${obj.CardName}.${window.location.host}`);
      // $('a.copyLink').text(Link).attr('href',"http://"+Link)

      $("#IP-fname").val(obj.Fname);
      $("#IP-lname").val(obj.Lname);
      $("#IP-Tel").val(obj.Tel);
      $("#IP-Company").val(obj.Company);
      $("#IP-Email").val(obj.Email);
      $("#IP-FacebookLink").val(obj.Facebook);
      $("#IP-LineID").val(obj.Line);
      $("#IP-Bg").val(obj.BgColor);
      $("#IP-Theme").val(obj.Theme);

      $(".image").css("background", obj.BgColor);
      $(".header").css("background", obj.BgColor);

      if (obj.Theme == 'dark') {
        $(".profile-card").css("background", "#555555");
        $(".profile-card .card-text").css("color", "#fff");
      } else {
        $(".profile-card").css("background", "#fff");
        $(".profile-card .card-text").css("color", "#333");
      }

      document.title = newPageTitle;
      // document.getElementById('Show-Img').src = obj.ImgPath;
      document.getElementById("mobileImg").src = obj.ImgPath;
      document.getElementById("showmobileImg").src = obj.ImgPath;

      let fname = $.trim($("#IP-fname").val());
      let lname = $.trim($("#IP-lname").val());
      let Tel = $.trim($("#IP-Tel").val());
      let Company = $.trim($("#IP-Company").val());
      let Email = $.trim($("#IP-Email").val());
      let FacebookLink = $.trim($("#IP-FacebookLink").val());
      let LineID = $.trim($("#IP-LineID").val());

      $("#Show-fname").text(fname + "   " + lname);
      // $('#Show-lname').val(lname);
      $("#Show-Tel").val(Tel);
      $("#Show-Company").text(Company);
      $("#Show-Tel").val(Tel);
      $("#Show-EmailName").val(Email);

      document.getElementById("Show-FacebookLink").href = FacebookLink;
      document.getElementById("Show-LineID").href =
        "https://line.me/ti/p/~" + LineID;
      document.getElementById("Show-Tel").href = "tel://" + Tel;
      document.getElementById("Show-Email").href = "mailto:" + Email;
      $("#share-button").attr("data-a2a-url", Link);

      // checkWidth()

      if (Published == 1) {
        $("#share_button").attr("data-a2a-url", Link);
        $("#share-group").removeClass("hide");

        $("#publish").addClass("hide");
        $("#unpublish").removeClass("hide");
      } else {
        $("#share-group").removeClass("hide");
        $("#share-group").toggleClass("hide");

        $("#unpublish").addClass("hide");
        $("#publish").removeClass("hide");
      }
    },
  });
}

function checkWidth() {
  if (screen.width <= 768) {
    alert("Mobile");
  } else {
    alert("PC");
  }
}

//copy to clipbord
function copyToclip() {
  /* Get the text field */
  var copyText = document.getElementById("copyLink");
  console.log(copyText);

  /* Select the text field */
  copyText.select();
  copyText.setSelectionRange(0, 99999); /* For mobile devices */

  /* Copy the text inside the text field */
  navigator.clipboard.writeText(copyText.value);

  /* Alert the copied text */
  alert("คัลลอกลิงก์ " + copyText.value + " ลงคลิปบอร์ดสำเร็จ");
}

$(document).ready(function () {
  // alert(screen.width)
  // Show Card

  ShowCard();
  // Show Pre-Card (on change)
  $("#IP-fname").on("input", () =>
    $("#Show-fname").text($("#IP-fname").val() + " " + $("#IP-lname").val())
  );
  // $('#IP-lname').on('input', () => $('#Show-lname').val($('#IP-lname').val()));
  $("#IP-Company").on("input", () =>
    $("#Show-Company").text($("#IP-Company").val())
  );
  $("#IP-Tel").on("input", () => $("#Show-Tel").val($("#IP-Tel").val()));

  $("#IP-FacebookLink").on("input", () =>
    $("#Show-FacebookLink").href($("#IP-FacebookLink").val())
  );
  $("#IP-LineID").on("input", () =>
    $("#Show-LineID").href("https://line.me/ti/p/~" + $("#IP-LineID").val())
  );
  $("#IP-Tel").on("input", () =>
    $("#Show-Tel").href("tel://" + $("#IP-Tel").val())
  );
  $("#IP-Email").on("input", () => {
    $("#Show-Email-text").text($("#IP-Email").val());
    $("#Show-Email").href("mailto:" + $("#IP-Email").val());
  });
  // design
  $("#IP-Bg").on("input", (e) => {
    console.log(e.target.value);
    $(".image").css("background", e.target.value);
    $(".header").css("background", e.target.value);
  });

  $("#IP-Theme").on("input", (e) => {
    console.log(e.target.value);
    let Theme = e.target.value;
    
    if (Theme == 'dark') {
        $(".profile-card").css("background", "#555555");
        $(".profile-card .card-text").css("color", "#fff");
      } else {
        $(".profile-card").css("background", "#fff");
        $(".profile-card .card-text").css("color", "#333");
      }
  });

  // Edit Card
  $(document).on("click", "#EditCard", function () {
    let fname = $.trim($("#IP-fname").val());
    let lname = $.trim($("#IP-lname").val());
    let Tel = $.trim($("#IP-Tel").val());
    let Company = $.trim($("#IP-Company").val());
    let Email = $.trim($("#IP-Email").val());
    let FacebookLink = $.trim($("#IP-FacebookLink").val());
    let LineID = $.trim($("#IP-LineID").val());
    let BgColor = $.trim($("#IP-Bg").val());
    let Theme = $.trim($("#IP-Theme").val());

    $.ajax({
      url: "/card/edit",
      method: "put",
      contentType: "application/json",
      data: JSON.stringify({
        Fname: fname,
        Lname: lname,
        Tel: Tel,
        Company: Company,
        Email: Email,
        Facebook: FacebookLink,
        Line: LineID,
        BgColor: BgColor,
        Theme: Theme,
      }),
      success: function (suc) {
        successText = suc.message;
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Edit",
          text: successText,
          showConfirmButton: false,
          timer: 1500,
        });
        ShowCard();
      },
      error: function (err) {
        errorText = err.responseJSON.message;
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "Warning",
          text: errorText,
          showConfirmButton: true,
          confirmButtonText: "OK",
          confirmButtonColor: "#FF5733",
        });
      },
    });
  });

  // Change Password
  $(document).on("click", "#ChangePass", function () {
    $("#modalChangePass").modal("show");

    $("#btnChangePass").unbind();
    $("#btnChangePass").click(function () {
      let CardPass = $.trim($("#IP-CardPass").val());

      $.ajax({
        url: "/card/change_password/",
        method: "put",
        contentType: "application/json",
        data: JSON.stringify({
          CardPass: CardPass,
        }),
        success: function (succ) {
          successText = succ.message;
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Change Success",
            text: successText,
            showConfirmButton: false,
            timer: 1500,
          });
          ShowCard();
          $("#modalChangePass").modal("hide");
        },
        error: function (err) {
          errorText = err.responseJSON.message;
          Swal.fire({
            position: "center",
            icon: "warning",
            title: "Warning",
            text: errorText,
            showConfirmButton: true,
            confirmButtonText: "OK",
            confirmButtonColor: "#FF5733",
          });
        },
      });
    });
    $(".close,.no").click(function () {
      $("#modalChangePass").modal("hide");
    });
  });

  // Publish Card
  $(document).on("click", "#publish", function () {
    $.ajax({
      url: "/card/publish",
      method: "get",
      cache: false,
      success: function (suc) {
        successText = suc.message;
        linkText = suc.link;
        $("#share_button").attr("data-a2a-url", linkText);
        Swal.fire({
          position: "center",
          title: "การเผยแพร่",
          icon: "success",
          html:
            "" +
            successText +
            "<br>" +
            "link ของการ์ด: " +
            '<input type="text" id="copyLink" class="copyLink" value="' +
            linkText +
            '" disabled></input>' +
            '<button onclick="copyToclip()" class = "btn btn-primary"><i class="fa fa-clipboard" aria-hidden="true"></i></button>',
          confirmButtonColor: "#007bff",
        });
        console.log("object", linkText);
        $("a.copyLink")
          .text(linkText)
          .attr("href", "http://" + linkText);
        ShowCard();
      },
      error: function (err) {
        errorText = err.responseJSON.message;
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "Warning",
          text: errorText,
          showConfirmButton: true,
          confirmButtonText: "OK",
          confirmButtonColor: "#FF5733",
        });
      },
    });
  });

  // Unpublish Card
  $(document).on("click", "#unpublish", function () {
    $.ajax({
      url: "/card/unpublish",
      method: "get",
      cache: false,
      success: function (suc) {
        successText = suc.message;
        Swal.fire({
          position: "center",
          icon: "success",
          title: "ยกเลิกการเผยแพร่",
          text: successText,
          showConfirmButton: false,
          timer: 2000,
        });
        ShowCard();
      },
      error: function (err) {
        errorText = err.responseJSON.message;
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "Warning",
          text: errorText,
          showConfirmButton: true,
          confirmButtonText: "OK",
          confirmButtonColor: "#FF5733",
        });
      },
    });
  });
});
