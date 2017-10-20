/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

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

$(function() {

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
    }).done(function(results, err) {
      renderTweets(results);
    });
  }
  getData();


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

  const newTweetSection = $("section.new-tweet");
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
      // $(this).text($(this).text() + "hi");
    })
  });


  $("#nav-bar form #btn-login").on("click", function(event) {
    event.preventDefault();
    console.log("clicked login");
    const data = $(this).parent().serialize();
    console.log(data);
    $.ajax({
      method: "POST",
      url: "users/login",
      data: data
    }).done(function() {
      console.log("login post request complete");
    })
  });
  
  $("#nav-bar form #btn-register").on("click", function(event) {
    event.preventDefault();
    console.log("clicked register");
    const data = $(this).parent().serialize();
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
  $("#login-register").on("click", function(event) { // to display login menu
    event.preventDefault();
    $(this).attr("disabled", true);
    if ($(this).data("status") === "off") {
      $(this).children(".fa-caret-square-o-down").css("display", "none");
      $(this).children(".fa-caret-square-o-left").css("display", "initial");
      $(this).data("status", "on");
      // loginForm.css("display", "flex");
    } else {
      $(this).children(".fa-caret-square-o-down").css("display", "initial");
      $(this).children(".fa-caret-square-o-left").css("display", "none");
      $(this).data("status", "off");
      // loginForm.css("display", "none");
    }
    console.log($(this).data("status"));
    $("#nav-bar #login-register-form").toggle("slide", { "direction": "right" }, 100, function() {
      $("#login-register").attr("disabled", false);
    });
  });
  
  console.log(req.session);

  
  const _clr_disabledBg = "#aaa";
  const _clr_enabledBg = "rgba(255, 255, 255, 0.75)";
  const _clr_defaultBtnTxt = "#00a08";
  $("#btn-register").css("background-color", _clr_disabledBg);

  const toggleSwitch = $("#toggleSwitch");
  toggleSwitch.attr("checked", false); // sets default value on page load
  toggleSwitch.on("click", function(event) { // checked true = register; checked false = login
    console.log(this.checked);
    if (this.checked === true) {
      $("#btn-register").attr("disabled", false);
      $("#btn-register").css("background-color", _clr_enabledBg);
      
      $("#btn-login").attr("disabled", true);
      $("#btn-login").css("background-color", _clr_disabledBg);

      $("#nav-bar form #name").attr("disabled", false);
      $("#nav-bar form #handle").attr("disabled", false);
      
    } else {
      $("#btn-register").attr("disabled", true);
      $("#btn-register").css("background-color", _clr_disabledBg);
      
      $("#btn-login").attr("disabled", false);
      $("#btn-login").css("background-color", _clr_enabledBg);
      
      $("#nav-bar form #name").attr("disabled", true);
      $("#nav-bar form #handle").attr("disabled", true);

    }
  });




});
