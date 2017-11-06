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

  var toggleSwitch = $("#toggleSwitch");

  // Initial styling/setup:
  $("#btn-register").css("background-color", clrDisabledBg);
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

  function isFormOkay(numFields) {
    for (let i = 0; i < numFields; i++) {
      if (inputChildren[i].value === "") {
        setLoginRegisterError("Fields can't be empty!");
        return false;
      }
    }
    return true;
  }

  $("#login-register-section #btn-login").on("click", function(event) {
    event.preventDefault();
    if (!isFormOkay(2)) { return; }
    var data = $(this).closest("form").serialize();
    $.ajax({
      method: "POST",
      url: "users/login",
      data: data,
    }).done(function(results) {
      if (results.user_id) {
        $("#login-register-section").fadeToggle(200);
        guiLoggedIn();
      } else {
        setLoginRegisterError(results.message);
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
          $("#login-register-section").fadeToggle(200);
          guiLoggedIn();
        }
    })
  });

  $("#logout-btn").on("click", function() {
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
    setLoginRegisterMessage(defaultLoginRegisterMessage);
    guiClearLoginRegisterForm();
  });

  $("#login-register-section .close-button").on("click", function(event) { // to close login menu
    $(this).closest("section").fadeToggle(200);
  });



  //------------------------
  // Initial load of tweets:
  //
  getTweets();

});
