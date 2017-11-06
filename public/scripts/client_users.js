$(function() {

  //----------------------------------------------
  // Login/register form message helper functions:
  //

  window.inputChildren = $("#login-register-form").find(".input-field");
  window.iconError = "<i class='fa fa-exclamation-circle' aria-hidden='true'></i>";
  window.iconRightArrow = '<i class="fa fa-angle-double-right" aria-hidden="true"></i>';
  window.iconLeftArrow = '<i class="fa fa-angle-double-left" aria-hidden="true"></i>';
  window.defaultLoginRegisterMessage = `${iconLeftArrow} Flip switch to login or register ${iconRightArrow}`;
  window.clrLightGreen = "#abebc6";

  window.errorDiv = $("#login-register-section div.errorText");
  errorDiv.html(defaultLoginRegisterMessage);
  errorDiv.css("color", "black");
  errorDiv.css("background-color", clrLightGreen);

  window.setLoginRegisterError = function(string) {
    errorDiv.html(`${iconError}&nbsp;${string}&nbsp;${iconError}`);
    errorDiv.css("color", "red");
    errorDiv.css("background-color", "pink");
  }

  window.setLoginRegisterMessage = function(string) {
    errorDiv.html(string);
    errorDiv.css("color", "black");
    errorDiv.css("background-color", clrLightGreen);
  }



  //-----------------------------------------------------------------
  // Helper functions for changing GUI based on logged in/out status:
  //

  window.guiLoggedOut = function() {
    $(".new-tweet textarea").attr("disabled", true);
    $(".new-tweet textarea").val("");
    $(".new-tweet .counter").text("140");
    $(".new-tweet .message").text("You must be logged in to tweet!");
    $(".new-tweet .message").css("display", "inline");
    $(".new-tweet input").attr("disabled", true);
    $("#logout-btn").css("display", "none")
    $("#login-register-btn").css("display", "inline")
  }

  window.guiLoggedIn = function() {
    $(".new-tweet textarea").attr("disabled", false);
    $(".new-tweet textarea").val("");
    $(".new-tweet .counter").text("140");
    $(".new-tweet .message").css("display", "none");
    $(".new-tweet input").attr("disabled", false);
    $("#logout-btn").css("display", "inline")
    $("#login-register-btn").css("display", "none")
  }

  window.guiClearLoginRegisterForm = function() {
    $("#login-register-form input").val("");
  }



  //---------------------------------------
  // Toggle switch for login/register form:
  //

  window.clrDisabledBg = "#aaa";
  window.clrEnabledBg = "rgba(255, 255, 255, 0.75)";

  window.flipToRegister = function() {
    $("#btn-register").attr("disabled", false);
    $("#btn-register").css("background-color", clrEnabledBg);
    $("#btn-login").attr("disabled", true);
    $("#btn-login").css("background-color", clrDisabledBg);
    $("#login-register-form #name").attr("disabled", false);
    $("#login-register-form #handle").attr("disabled", false);
  }

  window.flipToLogin = function() {
    $("#btn-register").attr("disabled", true);
    $("#btn-register").css("background-color", clrDisabledBg);
    $("#btn-login").attr("disabled", false);
    $("#btn-login").css("background-color", clrEnabledBg);
    $("#login-register-form #name").attr("disabled", true);
    $("#login-register-form #handle").attr("disabled", true);
  }

});



