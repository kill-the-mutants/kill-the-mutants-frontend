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
  $('#progress-indicator').slideDown();
  $.ajax({
    url: '/game/run-tests',
    type: 'POST',
    data: {
      code: testsCode,
      testName: testName
    },
    success: function(data) {
      $('#progress-indicator').slideUp();
      setContent('console', data.output);
    }
  });
}

function mutationTest(testsCode, testName) {
  $('#progress-indicator').slideDown();
  $.ajax({
    url: '/game/mutation-test',
    type: 'POST',
    data: { code: testsCode },
    success: function(data) {
      $('#progress-indicator').slideUp();
      setContent('console', data.output);
      if(data.score !== undefined && data.score !== NaN && data.score !== null){
        console.log(data.score);
        ig.game.startGame(data.score);
      }
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
