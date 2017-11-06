//-----------------------------------------------------------------------------------
// Loops through tweets array from DB and calls function to create elements for them:
//

function renderTweets(tweetsArray) {
  $("#tweets-container").empty();
  tweetsArray.forEach((item) => {
    $("#tweets-container").prepend(createTweetElement(item));
  });
}



//------------------------------------
// Used to avoid cross-site scripting:
//

function escapeHtml(string) {
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
  return String(string).replace(/[&<>"'`=\/]/g, function (s) {
    return entityMap[s];
  });
}



//---------------------------------------
// Template/function for creating tweets:
//

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



//-------------------------------
// Retrieve tweets from database:
//

function getTweets() {
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
