/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Test / driver code (temporary). Eventually will get this from the server.
var tweetData = {
  "user": {
    "name": "Newton",
    "avatars": {
      "small":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
      "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
      "large":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
    },
    "handle": "@SirIsaac"
  },
  "content": {
    "text": "If I have seen further it is by standing on the shoulders of giants"
  },  
  "created_at": 1461116232227
}  

var data = [
  {
    "user": {
      "name": "Newton",
      "avatars": {
        "small":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
        "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
        "large":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
      },
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1461116232227
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": {
        "small":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_50.png",
        "regular": "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc.png",
        "large":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_200.png"
      },
      "handle": "@rd" },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1461113959088
  },
  {
    "user": {
      "name": "Johann von Goethe",
      "avatars": {
        "small":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_50.png",
        "regular": "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1.png",
        "large":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_200.png"
      },
      "handle": "@johann49"
    },
    "content": {
      "text": "Es ist nichts schrecklicher als eine tätige Unwissenheit."
    },
    "created_at": 1461113796368
  }
];


function createTweetElement(tweetData) {
  // let tweet = $("<article>")
  //   .addClass("tweet")
  //   .append($("<header>")
  //     .append($("<img>")
  //       .attr("src", tweetData.user.avatars.small))
  //     .append($("<h2>")
  //       .text(tweetData.user.name))
  //     .append($("<span>")
  //       .addClass("handle")
  //       .text(tweetData.user.handle)))
  //   .append($("<p>")
  //     .text(tweetData.content.text))
  //   .append($("<footer>")
  //     .append($("<span>")
  //       .addClass("age")
  //       .text(tweetData.created_at))
  //     .append($("<span>")
  //       .addClass("buttons")
  //       .append($("<span>")
  //         .addClass("footer-button")
  //         .text("flag"))
  //       .append($("<span>")
  //         .addClass("footer-button")
  //         .text("retweet"))
  //       .append($("<span>")
  //         .addClass("footer-button")
  //         .text("like"))));
  let tweet =
    `<article class="tweet">
      <header>
        <img src="${tweetData.user.avatars.small}" />
        <h2>Tweeter Name</h2>
        <span class="handle">${tweetData.user.handle}</span>
      </header>
      <p>
        ${tweetData.content.text}
      </p>
      <footer>
        <span class="age">${tweetData.created_at}</span>
        <span class="buttons">
          <span class="footer-button">
            <i class="fa fa-flag" aria-hidden="true"></i>
          </span>&nbsp;|&nbsp;
          <span class="footer-button">
            <i class="fa fa-retweet" aria-hidden="true"></i>
          </span>&nbsp;|&nbsp; 
          <span class="footer-button">
            <i class="fa fa-heart" aria-hidden="true"></i>
          </span>
        </span>
      </footer>
    </article>`;

  return tweet;
}





// var $tweet = createTweetElement(tweetData);

$(function() {
  // Test / driver code (temporary)
  // console.log($tweet[0]); // to see what it looks like
  // $('#tweets-container').append($tweet); // to add it to the page so we can make sure it's got all the right elements, classes, etc.
  function renderTweets(tweetsArray) {
    for (let i = 0; i < tweetsArray.length; i++) {
      $("#tweets-container").append(createTweetElement(tweetsArray[i]));
    }
  }

  renderTweets(data);
    


});
