/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

function createTweetElement(tweetData) {
  return `
  <article class="tweet">
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
        </span>&nbsp;|&nbsp;
        <span class="footer-button retweet">
          <i class="fa fa-retweet" aria-hidden="true"></i>
        </span>&nbsp;|&nbsp; 
        <span class="footer-button like">
          <i class="fa fa-heart" aria-hidden="true"></i>
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
      message.text("You need to type something!")
      return;
    } else if (textLength > 140) {
      message.text("Too many characters! (Max is 140)")
      return;
    }
    $("#new-tweet-form .counter").text("140");


    const theForm = this;

    submitButton.attr("disabled", true);

    const data = $(this).serialize();
    
    console.log("Sending form data...");
    $.ajax({
      method: 'POST',
      url: '/tweets',
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




});
