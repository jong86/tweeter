/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */



$(function() {

  function createTweetElement(tweetData) {
    return `
    <article class="tweet" data-tweet_id="${tweetData._id}">
      <header>
        <img src="${tweetData.user.avatars.small}" />
        <h2>${escapeHtml(tweetData.user.name)}</h2>
        <span class="handle">${escapeHtml(tweetData.user.handle)}</span>
      </header>
      <p>
        ${escapeHtml(tweetData.content.text)}
      </p>
      <footer class="noselect">
        <span class="age">${moment(tweetData.created_at).fromNow()}</span>
        <span class="footer-buttons">
          <span class="footer-button flag">
            <i class="fa fa-flag" aria-hidden="true"></i>
            <span class="flag-amount"></span>
          </span>&nbsp;|&nbsp;
          <span class="footer-button retweet">
            <i class="fa fa-retweet" aria-hidden="true"></i>
            <span class="retweet-amount"></span>
          </span>&nbsp;|&nbsp; 
          <span class="footer-button like">
            <i class="fa fa-heart" aria-hidden="true"></i>
            <span class="like-amount">${tweetData.liked_by.length}</span>
          </span>
        </span>
      </footer>
    </article>
    `;
  }
  
  
  var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };
  function escapeHtml(string) {
    return String(string).replace(/[&<>"'`=\/]/g, function (s) {
      return entityMap[s];
    });
  }



  function renderTweets(tweetsArray) {
    $("#tweets-container").empty();
    tweetsArray.forEach((item) => {
      $("#tweets-container").prepend(createTweetElement(item));
    });
  }



  function getData() {
    $.ajax({
      method: 'GET',
      url: '/tweets',
    }).done(function(results) {
      renderTweets(results.tweets);
      if (results.session.user_id) {
        guiLoggedIn();
      } else {
        guiLoggedOut();        
      }
    });
  }
  getData();


  function guiLoggedOut() {
    $(".new-tweet textarea").attr("disabled", true);
    $(".new-tweet textarea").val("");
    $(".new-tweet .counter").text("140");
    $(".new-tweet .message").text("You must be logged in to tweet!");
    $(".new-tweet .message").css("display", "inline");
    $(".new-tweet input").attr("disabled", true);
    $("#logout-btn").css("display", "none")
    $("#login-register-btn").css("display", "inline")
  }
  
  function guiLoggedIn() {
    $(".new-tweet textarea").attr("disabled", false);
    $(".new-tweet textarea").val("");
    $(".new-tweet .counter").text("140");
    $(".new-tweet .message").css("display", "none");
    $(".new-tweet input").attr("disabled", false);
    $("#logout-btn").css("display", "inline")
    $("#login-register-btn").css("display", "none")
  }

  function guiClearLoginRegisterForm() {
    $("#login-register-form input").val("");
  }


  const submitButton = $(".new-tweet input");
  $("#new-tweet-form").on("submit", function(event) {
    event.preventDefault();
    const textLength = $("#new-tweet-form textarea").val().length;
    const message = $("#new-tweet-form .message");
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

    const theForm = this;
    const data = $(this).serialize();
    submitButton.attr("disabled", true);
    $.ajax({
      method: "POST",
      url: "/tweets",
      data: data
    }).done(function() {
      theForm.reset();
      getData();
      submitButton.removeAttr("disabled");
    });
  });



  const newTweetSection = $(".new-tweet");
  const newTweetTextarea = $("#new-tweet-form textarea");
  $("#compose").on("click", function() {
    newTweetSection.slideToggle(200);
    newTweetTextarea.focus();
  });



  //
  // [Like Button]
  //
  $(document).on("click", ".like", function() {
    const id = $(this).closest("article.tweet").data().tweet_id;
    const likeAmountSpan = $(this).children("span");
    const likeAmount = parseInt(likeAmountSpan.text());
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


  
  const inputChildren = $("#login-register-form").find(".input-field");
  const errorDiv = $("#login-register-section div.errorText");
  const iconError = "<i class='fa fa-exclamation-circle' aria-hidden='true'></i>";
  const iconRightArrow = '<i class="fa fa-angle-double-right" aria-hidden="true"></i>';
  const iconLeftArrow = '<i class="fa fa-angle-double-left" aria-hidden="true"></i>';
  const defaultLoginRegisterMessage = `${iconLeftArrow} Flip switch to login or register ${iconRightArrow}`;
  const clrLightGreen = "#abebc6";
  errorDiv.html(defaultLoginRegisterMessage);
  errorDiv.css("color", "black");
  errorDiv.css("background-color", clrLightGreen);

  function isFormOkay(n) {
    for (let i = 0; i < n; i++) {
      if (inputChildren[i].value === "") {  
        setLoginRegisterError("Fields can't be empty!");
        return false;
      }
    }
    return true;
  }

  function setLoginRegisterError(string) {
    errorDiv.html(`${iconError}&nbsp;${string}&nbsp;${iconError}`);
    errorDiv.css("color", "red");
    errorDiv.css("background-color", "pink");
  }

  function resetLoginRegisterMessage() {
    errorDiv.html(defaultLoginRegisterMessage);
    errorDiv.css("color", "black");
    errorDiv.css("background-color", clrLightGreen);
  }

  $("#login-register-section #btn-login").on("click", function(event) {
    event.preventDefault();
    if (!isFormOkay(2)) { return; }
    const data = $(this).closest("form").serialize();
    $.ajax({
      method: "POST",
      url: "users/login",
      data: data
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
    const data = $(this).closest("form").serialize();
    $.ajax({
        method: "POST",
        url: "users/register",
        data: data
      }).done(function(results) {
        setLoginRegisterError(results);
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
    resetLoginRegisterMessage();
  });
  


  const loginForm = $("#nav-button-box #login-register-form");
  $("#login-register-btn").on("click", function(event) { // to display login menu
    $("#login-register-section").fadeToggle(200);

    guiClearLoginRegisterForm();

  });



  $("#login-register-section .close-button").on("click", function(event) { // to close login menu
    $(this).closest("section").fadeToggle(200);
  });
  

  
  //
  // [Login/Register Switch]
  //
  const _clr_disabledBg = "#aaa";
  const _clr_enabledBg = "rgba(255, 255, 255, 0.75)";
  const _clr_defaultBtnTxt = "#00a08";
  $("#btn-register").css("background-color", _clr_disabledBg);
  $("#login-register-form #email").val("");
  $("#login-register-form #password").val("");
  $("#login-register-form #name").attr("disabled", true).val("");
  $("#login-register-form #handle").attr("disabled", true).val("");
  const toggleSwitch = $("#toggleSwitch");
  toggleSwitch.attr("checked", false); // sets default value on page load
  toggleSwitch.on("click", function(event) { // checked true = register; checked false = login
    if (this.checked === true) {
      $("#btn-register").attr("disabled", false);
      $("#btn-register").css("background-color", _clr_enabledBg);
      $("#btn-login").attr("disabled", true);
      $("#btn-login").css("background-color", _clr_disabledBg);
      $("#login-register-form #name").attr("disabled", false);
      $("#login-register-form #handle").attr("disabled", false);
    } else {
      $("#btn-register").attr("disabled", true);
      $("#btn-register").css("background-color", _clr_disabledBg);
      $("#btn-login").attr("disabled", false);
      $("#btn-login").css("background-color", _clr_enabledBg);
      $("#login-register-form #name").attr("disabled", true);
      $("#login-register-form #handle").attr("disabled", true);
    }
  });


});
