document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.datepicker');
    var instances = M.Datepicker.init(elems, '');
    M.Datepicker.getInstance(document.querySelector('.datepicker')).pickadate({
        selectMonths: true,
        format: 'mmmm',
        selectYears: false,
        buttonImageOnly: false,
        disable: [true],
        onOpen: function() {
          $(".picker__nav--prev, .picker__nav--next").remove();
        },
        onSet: function( arg ){
      var selectedMonth = parseInt(arg.highlight[1]);
      var selectedYear = arg.highlight[0];
      var selectedDate = arg.highlight[2];
      this.close();
      this.set('select', [selectedYear, selectedMonth, selectedDate,{ format: 'yyyy/mm/dd' }]);
      }
    });
  }); 
  