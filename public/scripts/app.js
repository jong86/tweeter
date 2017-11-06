$(function() {


  //---------------------------------------------------------
  // Compose button event handler for showing new tweet form:
  //
  var newTweetSection = $(".new-tweet");
  var newTweetTextarea = $("#new-tweet-form textarea");
  $("#compose").on("click", function() {
    newTweetSection.slideToggle(200);
    newTweetTextarea.focus();
  });


  //-------------------------------------
  // Tweet submission form event handler:
  //
  var submitButton = $(".new-tweet input");
  $("#new-tweet-form").on("submit", function(event) {
    event.preventDefault();
    var textLength = $("#new-tweet-form textarea").val().length;
    var message = $("#new-tweet-form .message");
    if (textLength === 0) {
      message.css("display", "inline");
      message.text("You need to type something!")
      return;
    } else if (textLength > 140) {
      message.css("display", "inline");
      message.text("Too many characters! (Max is 140)")
      return;
    }
    $("#new-tweet-form .counter").text("140");

    var theForm = this;
    var data = $(this).serialize();
    submitButton.attr("disabled", true);
    $.ajax({
      method: "POST",
      url: "/tweets",
      data: data
    }).done(function() {
      theForm.reset();
      getTweets();
      submitButton.removeAttr("disabled");
    });
  });


  //---------------------------
  // Like button event handler:
  //
  $(document).on("click", ".like", function() {
    var id = $(this).closest("article.tweet").data().tweet_id;
    var likeAmountSpan = $(this).children("span");
    var likeAmount = parseInt(likeAmountSpan.text());
    $.ajax({
      method: "POST",
      url: "/tweets/like/" + id
    }).done(function(userLikesThisTweet) {
      if (userLikesThisTweet) {
        likeAmountSpan.text(likeAmount + 1);
      } else {
        likeAmountSpan.text(likeAmount - 1);
      }
    })
  });


  //---------------------------------------------------------------
  // Login/register form toggle-switch variables and event handler:
  //

  // JQuery object storage into variables:
  var toggleSwitch = $("#toggleSwitch");

  // Initial styling/setup:
  $("#btn-register").css("background-color", _clr_disabledBg);
  $("#login-register-form #email").val("");
  $("#login-register-form #password").val("");
  $("#login-register-form #name").attr("disabled", true).val("");
  $("#login-register-form #handle").attr("disabled", true).val("");

  toggleSwitch.attr("checked", false); // sets default value on page load
  toggleSwitch.on("click", function(event) { // checked true = register; checked false = login
    if (this.checked === true) {
      flipToRegister();
    } else {
      flipToLogin();
    }
  });



  //---------------------------
  // Login form event handlers:
  //

    // Can split this function to follow "single responsibility rule":
  function isFormOkay(numFields) {
    for (let i = 0; i < numFields; i++) {
      if (inputChildren[i].value === "") {
        setLoginRegisterError("Fields can't be empty!");
        return false;
      }
    }
    return true;
  }
  // ^^ Need to do this error handling on server side too

  $("#login-register-section #btn-login").on("click", function(event) {
    console.log("clicked login");
    event.preventDefault();
    if (!isFormOkay(2)) { return; }
    var data = $(this).closest("form").serialize();
    $.ajax({
      method: "POST",
      url: "users/login",
      data: data,
      error: function(err) {
        console.log(err)
      }
    }).done(function(results) {
      if (results.session.user_id) {
        $("#login-register-section").fadeToggle(200);
        guiLoggedIn();
      }
    });
  });

  $("#login-register-section #btn-register").on("click", function(event) {
    event.preventDefault();
    if (!isFormOkay(inputChildren.length)) { return; }
    var data = $(this).closest("form").serialize();
    $.ajax({
        method: "POST",
        url: "users/register",
        data: data
      }).done(function(results) {
        if (results.error === true) {
          setLoginRegisterError(results.message);
        } else {
          toggleSwitch.trigger("click");
          guiClearLoginRegisterForm();
          // setLoginRegisterMessage(results.message);
          console.log(results);
          $("#login-register-section").fadeToggle(200);
          guiLoggedIn();
        }
    })
  });

  $("#logout-btn").on("click", function() {
    console.log("logging out");
    $.ajax({
      method: "POST",
      url: "/users/logout",
    }).done(function(results) {
      if (!results) {
        guiLoggedOut();
      }
    })
  });

  $("#login-register-form").on("input", function() {
    setLoginRegisterMessage(defaultLoginRegisterMessage);
  });

  var loginForm = $("#nav-button-box #login-register-form");
  $("#login-register-btn").on("click", function(event) { // to display login menu
    $("#login-register-section").fadeToggle(200);
    guiClearLoginRegisterForm();
  });

  $("#login-register-section .close-button").on("click", function(event) { // to close login menu
    $(this).closest("section").fadeToggle(200);
  });


  //-----------------------------------
  // Set up of GUI error display stuff:
  //
  var inputChildren = $("#login-register-form").find(".input-field");
  var iconError = "<i class='fa fa-exclamation-circle' aria-hidden='true'></i>";
  var iconRightArrow = '<i class="fa fa-angle-double-right" aria-hidden="true"></i>';
  var iconLeftArrow = '<i class="fa fa-angle-double-left" aria-hidden="true"></i>';
  var defaultLoginRegisterMessage = `${iconLeftArrow} Flip switch to login or register ${iconRightArrow}`;
  var clrLightGreen = "#abebc6";

  var errorDiv = $("#login-register-section div.errorText");
  errorDiv.html(defaultLoginRegisterMessage);
  errorDiv.css("color", "black");
  errorDiv.css("background-color", clrLightGreen);

  //----------------------------------------
  // Initial getting of tweets on page load:
  //
  getTweets();

});
