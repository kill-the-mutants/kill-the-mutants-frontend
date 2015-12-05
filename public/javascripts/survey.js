$(document).ready(function() {
  $('.learning-source').change(function () {
    var textarea_id = $(this).attr('id') + '-textarea';
    //check if its checked. If checked move inside and check for others value
    if (this.checked) {
        //show a text box
        $('#' + textarea_id).slideDown(function() {
          $('#' + textarea_id).css('display','block'); // makes the animation a little smoother
        });
    } else {
        //hide the text box
        $('#' + textarea_id).slideUp();
    }
  });
});
