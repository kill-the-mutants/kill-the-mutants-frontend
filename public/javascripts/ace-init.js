// NOTE: Next two functions are super hacky functions to make ace more responsive.
// Assumes line height in
// editor is 16px

// fractionalHeight: fraction to multiply the height of the workspace container
// in order to get desired number of lines for an editor
// [padding]: extra padding (or margins, or... whatever) to include that you
// wish to subtract from the height of the workspace container height
function determineMaxLines(fractionalHeight, padding) {
  if (fractionalHeight < 0 || fractionalHeight > 1) { return 35; } // return 35 by default if invalid
  var snippetHeight = parseInt($('#workspace').height()) * fractionalHeight;
  if (padding) {
    snippetHeight -= padding;
  }
  var lines = Math.floor(snippetHeight / 16);
  return lines;
}

// take in the number of lines per editor and resize their corresponding cards
// assumes line height is 16px
function resizeCards(editorLines, snippetLines, consoleLines) {
  $('#editor-card').height(editorLines * 16);
  $('#snippet-card').height(snippetLines * 16);
  $('#console-card').height(consoleLines * 16);
}

var editor = ace.edit("editor");
editor.setTheme("ace/theme/cobalt");
editor.getSession().setMode("ace/mode/java");
editor.setOptions({
  maxLines: determineMaxLines(1),
  showPrintMargin: false
});

var snippetView = ace.edit("code-snippet");
snippetView.setTheme("ace/theme/cobalt");
snippetView.getSession().setMode("ace/mode/java");
snippetView.setOptions({
    maxLines: determineMaxLines(0.5),
    readOnly: true,
    highlightActiveLine: false,
    highlightGutterLine: false,
    showPrintMargin: false
});

snippetView.renderer.$cursorLayer.element.style.opacity=0;

var consoleView = ace.edit("console");
consoleView.setTheme("ace/theme/cobalt");
consoleView.getSession().setMode("ace/mode/text");
consoleView.setOptions({
    maxLines: determineMaxLines(0.5, 16),
    readOnly: true,
    highlightActiveLine: false,
    highlightGutterLine: false,
    showPrintMargin: false
});

consoleView.renderer.$cursorLayer.element.style.opacity=0;

$(window).resize(function() {
  editor.setOptions({
    maxLines: determineMaxLines(1)
  });
  snippetView.setOptions({
    maxLines: determineMaxLines(0.5)
  });
  consoleView.setOptions({
    maxLines: determineMaxLines(0.5, 16)
  });
  resizeCards(determineMaxLines(1), determineMaxLines(0.5), determineMaxLines(0.5, 16));
});

$(document).ready(function() {
  resizeCards(determineMaxLines(1), determineMaxLines(0.5), determineMaxLines(0.5, 16));
  editor.resize();
  snippetView.resize();
  consoleView.resize();
});
