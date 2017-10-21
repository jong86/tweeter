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
      <footer>
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
            <span class="like-amount">${tweetData.likes}</span>
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
      console.log("item:", item);
      $("#tweets-container").prepend(createTweetElement(item));
    });
  }



  function getData() {
    $.ajax({
      method: 'GET',
      url: '/tweets',
    }).done(function(results) {
      renderTweets(results.tweets);

      console.log("After getData happened: ", results);
      if (results.session.user_id) {
        console.log("Client logged in.", results.session);
        guiLoggedIn();
      } else {
        console.log("Client not logged in.");
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
    console.log("Sending form data...");
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




  $(document).on("click", ".like", function() {
    const id = $(this).closest("article.tweet").data().tweet_id;
    const likeAmountSpan = $(this).children("span");
    const likeAmount = parseInt(likeAmountSpan.text());
    // add dataset attribute to determine if user is going to like/unlike it -- this status will be determined by database

    likeAmountSpan.text(likeAmount + 1);
    console.log("like clicked.");
    $.ajax({
      method: "POST",
      url: "/tweets/like/" + id
    }).done(function() {
      console.log("like post complete");
    })
  });




  $("#login-register-section #btn-login").on("click", function(event) {
    event.preventDefault();
    console.log("clicked login");
    const data = $(this).closest("form").serialize();
    console.log("data:", data);
    $.ajax({
      method: "POST",
      url: "users/login",
      data: data
    }).done(function(results) {

      console.log("After login clicked:", results);
      if (results.session.user_id) {
        console.log("Client logged in.", results.session);
        $("#login-register-section").fadeToggle(200);
        guiLoggedIn();

      } else {
        console.log("Client not logged in.");
      }

    })
  });




  $("#logout-btn").on("click", function() {
    $.ajax({
      method: "POST",
      url: "/users/logout",
    }).done(function(results) {
      
    if (!results) {
      console.log("Client logged out");
      guiLoggedOut();

    } else {
      console.error("Error logging out");
    }

  })
});

  


  $("#login-register-section #btn-register").on("click", function(event) {
    event.preventDefault();

    // TODO Conditional checks to make sure form was filled out correctly

    console.log("clicked register");
    const data = $(this).closest("form").serialize();
    console.log(data);
    $.ajax({
      method: "POST",
      url: "users/register",
      data: data
    }).done(function() {
      console.log("registration post request complete");
    })
  });
  


  const loginForm = $("#nav-button-box #login-register-form");
  $("#login-register-btn").on("click", function(event) { // to display login menu
    console.log("you clicked login/register button");
    $("#login-register-section").fadeToggle(200);
    guiClearLoginRegisterForm();

  });



  $("#login-register-section .close-button").on("click", function(event) { // to close login menu
    console.log("you clicked close button");
    $(this).closest("section").fadeToggle(200);
  });
  
  

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
    console.log(this.checked);
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
