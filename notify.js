var PUPPYSHELTER = PUPPYSHELTER || {};


PUPPYSHELTER.notify = (function() {

  function init() {
    var $notify = $('.notify');

    // when any ajax request is initiated readyState === 1
    $notify.on('ajaxStart', function() {
      $notify.css("background-color", "yellow").text("Waiting...");
    });

    // when any request completes readyState === 4
    $notify.on('ajaxStop', function() {
      $notify.css("background-color", "green").text("Finished!");
    });
  };


  return {
    init: init
  };

})();