$(document).ready(function() {
  const maxChars = 140;
  const textarea = $(".new-tweet form textarea");
  const counter = $(".new-tweet form .counter");

  if (textarea.val()) {
    counter.text(maxChars - textarea.val().length);
    if (textarea.val().length >  maxChars) {
      counter.addClass("red-counter");
    }
  } else {
    counter.text(maxChars);
  }

  textarea.on("input", function(event) {
    const message = $(this).next().next();
    message.css("display", "none");
    textLength = $(this).val().length;
    if (textLength >  maxChars) {
      counter.addClass("red-counter");
    } else {
      counter.removeClass("red-counter");
    }
    counter.text(maxChars - textLength);
  })
});