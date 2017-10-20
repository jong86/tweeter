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

  });

  $("#login-register").on("click", function(event) {
    event.preventDefault();
    $(this).attr("disabled", true);
    if ($(this).data("status") === "off") {
      $(this).children("#icon-down").css("display", "none");
      $(this).children("#icon-left").css("display", "initial");
      $(this).data("status", "on");
    } else {
      $(this).children("#icon-down").css("display", "initial");
      $(this).children("#icon-left").css("display", "none");
      $(this).data("status", "off");
    }
    console.log($(this).data("status"));
    $("#nav-bar form").toggle("slide", { "direction": "right" }, 100, function() {
      $("#login-register").attr("disabled", false);
    });
  });



});
