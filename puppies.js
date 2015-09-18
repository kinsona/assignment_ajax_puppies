var PUPPYSHELTER = PUPPYSHELTER || {};

PUPPYSHELTER.puppies = (function() {

  var $_breedSelect;
  var $_puppiesList;


  function init() {
    _getBreeds();
    _getList();
    $('.puppy-list a').on('click', _getList);
    $('form').on('submit', _submitPuppy)
    $_breedSelect = $('select');
    $_puppiesList = $('.puppies');
  };


  function _getBreeds() {
    $.ajax( {
      url: "https://pacific-stream-9205.herokuapp.com/breeds.json",
      type: 'get',
      dataType: 'json',
      success: _addBreedsToSelect
    })
  };


  function _addBreedsToSelect(json) {
    json.forEach (function(breed, index) {
      var option = "<option value='" + breed.id + "'>" + breed.name + "</option>";
      $(option).appendTo($_breedSelect);
    });
  };


  function _getList() {
    event.preventDefault();

    $.ajax( {
      url: "https://pacific-stream-9205.herokuapp.com/puppies.json",
      type: 'get',
      dataType: 'json',
      success: _list
    })
  };


  function _list(json) {
    json.forEach( function(puppy, index) {
      _render(puppy);
    });
  };


  function _render(puppy) {
    var name = "<strong>" + puppy.name + "</strong> ";
    var breed = "(" + puppy.breed.name + "), ";
    var timestamp = "created " + jQuery.timeago(puppy.created_at) + " -- ";
    var link = "<a href='" + puppy.url + "'>adopt</a>";

    var listItem = "<li>" + name + breed + timestamp + link + "</li>";
    $(listItem).appendTo($_puppiesList);
  };


  function _submitPuppy() {

    var $form = $('form');
    var formData = $form.serialize();
    //var newName = $form.find('#name').val();
    //var selectedBreed = $form.find('#breed option:selected').val();

    $.ajax( {
      url: "https://pacific-stream-9205.herokuapp.com/puppies.json",
      data: formData,
      type: "post",
      contentType: "application/json",
      dataType: "json",
      success: _getList
    })

    event.preventDefault();
  }


  return {
    init: init
    //list: list
  }

})();

$(document).ready(function() {
  PUPPYSHELTER.puppies.init();
})