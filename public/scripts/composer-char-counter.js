
$(document).ready(function() {

  const maxChars = 140;
  let countValue;
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


  // Added the following event handler to prevent going over maximum allowable characters
  // Can more easily be done with maxlength attribute in HTML tag
  //
  // textarea.on("keydown", function(event) {
  //   if (event.which !== 46 && event.which !== 8 && $(this).val().length > maxChars - 1) {
  //     event.preventDefault();
  //     $(this).val($(this).val().slice(0, maxChars));
  //   }
  // })

});