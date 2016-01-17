jQuery(function($) {

  function selectRigthCurrenciesForSecondList() {
    var $currencyFromSelected = $('#currency_from').val();
    // get values from options
    var currenciesFrom = $.map($('#currency_from option'), function(option) {
        return option.value;
      });
    // remove the currency selected from the list
    var removeIndex = currenciesFrom.indexOf($currencyFromSelected);
    currenciesFrom.splice(removeIndex, 1);
    return currenciesFrom;
  }

  function createCurrencyToList(currencies) {
    $('#currency_to option').remove();
    for (var i = 0; i < currencies.length; i++) {
      $('#currency_to').append('<option>' + currencies[i] + '</option>');
    }
  }

  function generateCurrencyToList() {
    var currencyList = selectRigthCurrenciesForSecondList();
    createCurrencyToList(currencyList);
  }

  function sendRequest() {
    var date = $("#datepicker").datepicker("getDate");
    var $fromCode = $('#currency_from').val();
    var $toCode = $('#currency_to').val();
    var dateString = date.getFullYear() + "-" + date.getMonth() + 1 + "-" + date.getDate();
    var urlString = 'http://api.fixer.io/' + dateString + '?base=' + $fromCode;
    $.ajax({
      url: urlString,
      type: 'GET',
      success: function(json_response, status) {
        var answer = json_response.rates[$toCode];
        $('#answer').replaceWith('<p id="answer">The rate is: ' + answer + '</p>');
        console.log(answer);
      },
      error : function(response, status, error){
        alert("Failed with status: " + status + '\nError: ' + error)
      }
    });
  }

  // generate the list of targeted currencies
  generateCurrencyToList();

  // redefine the format of calendar dates
  $("#datepicker").datepicker({
   appendText:"(dd-mm-yy)",
   dateFormat:"dd-mm-yy"
  });

  // event on first list
  $('#currency_from').on('change', function() {
    generateCurrencyToList();
    sendRequest();
  });

  // event on second list
  $('#currency_to').on('change', function() {
    sendRequest();
  });

  // event on calendar
  $("#datepicker").datepicker();
  $("#datepicker").on('change', function() {
    sendRequest();
  });
});
