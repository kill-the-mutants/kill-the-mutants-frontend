$(document).ready(function() {
  $('#run-tests').click(function() {
    // TODO: If we keep the compile button, perhaps keep this disabled until a successful
    // compiilation has occured and no further changes to the tests have been made.
    runTests(getContent('editor'));
    return false;
  });
  $('#mutation-test').click(function() {
    // TODO: If we keep the compile button, perhaps keep this disabled until a successful
    // compiilation has occured and no further changes to the tests have been made.
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
      // TODO this isn't outputting correctly
      console.log(data);
      //setContent('console', data.stdout.stringify());
    }
  });
}

function mutationTest(testsCode, testName) {
  $.ajax({
    url: '/game/mutation-test',
    type: 'POST',
    data: { code: testsCode },
    success: function(data) {
      // TODO: do something meaningful with response
      // In this case, should probably place the mutation test results into a new view
      console.log(data);
      setContent('console', data.stderr || data.stdout);
    }
  });
}

// function getExampleName() {
//   var pathElts = location.pathname.split('/');
//   console.log(pathElts[pathElts.length - 1]);
// }

// Helper function
function getContent(editorId) {
  return ace.edit(editorId).getValue();
}

// Helper function, not sure if we need it but may be useful if we wanted to do something cool like
// placing the compiler errors/warnings inline with the code the user edits
function setContent(editorId, replacementContent) {
  ace.edit(editorId).setValue(replacementContent);
}
