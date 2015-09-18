var PUPPYSHELTER = PUPPYSHELTER || {};

PUPPYSHELTER.puppies = (function() {

  var $_breedSelect;
  var $_puppiesList;


  function init() {
    _getBreeds();
    _getList();
    $('.puppy-refresh').on('click', _getList);
    $('.puppies').on('click', _adoptPuppy);
    $('form').on('submit', _submitPuppy)
    $_breedSelect = $('select');
    $_puppiesList = $('.puppies');
  };


  function _getBreeds() {
    $.ajax( {
      url: "https://pacific-stream-9205.herokuapp.com/breeds.json",
      method: 'get',
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
      method: 'get',
      dataType: 'json',
      success: _list
    })
  };


  function _list(json) {
    $_puppiesList.empty();

    json.sort(function(a,b) {
      a = new Date(a.created_at);
      b = new Date(b.created_at);
      return a - b;
    });

    json.forEach( function(puppy, index) {
      _render(puppy);
    });
  };


  function _render(puppy, breedName) {
    var name = "<strong>" + puppy.name + "</strong> ";

    if (breedName) {
      var breed = "(" + breedName + "), ";
    } else {
      var breed = "(" + puppy.breed.name + "), ";
    };

    var timestamp = "created " + jQuery.timeago(puppy.created_at) + " -- ";
    var link = "<a href='" + puppy.url + "'>adopt</a>";

    var listItem = "<li>" + name + breed + timestamp + link + "</li>";
    $(listItem).prependTo($_puppiesList);
  };


  function _submitPuppy() {
    event.preventDefault();

    var $form = $('form');

    var newName = $form.find('#name').val();
    var selectedBreed = $form.find('#breed option:selected').val();
    var breedName = $form.find('#breed option:selected').text()

    var formData = {
      name: newName,
      breed_id: selectedBreed
    };

    $.ajax( {
      url: "https://pacific-stream-9205.herokuapp.com/puppies.json",
      data: JSON.stringify(formData),
      method: "post",
      contentType: "application/json",
      dataType: "json",

      success: function(response) {
        _render(response, breedName);
      },
      error: _renderError
    })

  }


  function _getPuppy(response, breedName) {
    // hit api with id
    response.breed.name = breedName;
    _render(response);
  }


  function _renderError(response, status, error) {
    var errors = response.responseJSON;

    for(var field in errors) {
      var labelText = field[0].toUpperCase() + field.slice(1)
      var $message = $("<p class='error'> " + errors[field] + "</p>")
      var $label = $("form label:contains('" + labelText + "')")

      $message.insertAfter($label);
      $label.addClass('error-label');
    };

  }


  function _adoptPuppy() {
    event.preventDefault();

    $.ajax( {
      url: event.target.href,
      method: 'delete'
    });

    event.target.parentElement.remove()
  }


  return {
    init: init
  }

})();

$(document).ready(function() {
  PUPPYSHELTER.puppies.init();
})