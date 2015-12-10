// wait for full page to load before binding this handler
// the normal $(document).ready was getting beat by MDL (presumably) every time
// and overwriting the functionality
$(window).bind("load", function() {
  $('.mdl-layout__drawer-button').attr('title', 'Click here to choose an example!');
});
