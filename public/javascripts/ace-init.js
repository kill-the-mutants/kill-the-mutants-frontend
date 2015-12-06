var editor = ace.edit("editor");
editor.setTheme("ace/theme/cobalt");
editor.getSession().setMode("ace/mode/java");
editor.setOptions({
  maxLines: 35
});

var snippetView = ace.edit("code-snippet");
snippetView.setTheme("ace/theme/cobalt");
snippetView.getSession().setMode("ace/mode/java");
snippetView.setOptions({
    maxLines: 35,
    readOnly: true,
    highlightActiveLine: false,
    highlightGutterLine: false
});

snippetView.renderer.$cursorLayer.element.style.opacity=0;
