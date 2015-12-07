$(document).ready(function() {
  $('#run-tests').click(function() {
    runTests(getContent('editor'));
    return false;
  });
  $('#mutation-test').click(function() {
    mutationTest(getContent('editor'));
    return false;
  });
});

function runTests(testsCode, testName) {
  $.ajax({
    url: '/game/run-tests',
    type: 'POST',
    data: {
      code: testsCode,
      testName: testName
    },
    success: function(data) {
      setContent('console', data.output);
    }
  });
}

function mutationTest(testsCode, testName) {
  $.ajax({
    url: '/game/mutation-test',
    type: 'POST',
    data: { code: testsCode },
    success: function(data) {
      setContent('console', data.output);
      ig.game.startGame(); //TODO pass success rate
    }
  });
}

// Helper function
function getContent(editorId) {
  return ace.edit(editorId).getValue();
}

// Helper function
function setContent(editorId, replacementContent) {
  ace.edit(editorId).setValue(replacementContent);
}
