
$(document).ready(function() {
  
  const maxChars = 140;

  let countValue;
  const textarea = $("form textarea");

  textarea.on("input", function(event) {
    const message = $(this).next().next();
    message.empty();

    textLength = $(this).val().length;
    const counter = $(this).next().next().next();
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