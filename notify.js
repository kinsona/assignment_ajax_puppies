var PUPPYSHELTER = PUPPYSHELTER || {};


PUPPYSHELTER.notify = (function() {

  var $notify;
  var timeout;

  function init() {
    $notify = $('.notify');
    $(document).on('ajaxStart', _waiting);
    $(document).on('ajaxError', _error);
    $(document).on('ajaxSuccess', _success);
  };


  function _waiting() {
    $notify.show().css("background-color", "yellow").text("Waiting...");
    timeout = setTimeout(_delayed, 1000);
  };


  function _delayed() {
    $notify.text("Sorry this is taking so long...");
  };


  function _success() {
    clearTimeout(timeout);
    $notify.css("background-color", "lightgreen").text("Finished!")
    _fade();
  };


  function _error() {
    clearTimeout(timeout);
    var responseText = event.target.responseText;
    var message = _parseErrors(responseText);

    $notify.css("background-color", "red").text("Error- " + message + ".")
    _fade();
  };


  function _parseErrors(responseText) {
    var errors = JSON.parse(responseText);
    var message = [];

    for(var field in errors) {
      message.push(field + " " + errors[field]);
    }

    return message.join(", ");
  };


  function _fade() {
    setTimeout(function() {$notify.fadeOut(500)}, 2000);
  };


  return {
    init: init
  };

})();