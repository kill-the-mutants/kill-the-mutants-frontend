$(document).ready(function() {
  $('#btn-compile').click(function() {
    // Do we even want a compile button? What if either the #btn-run or #btn-kill-mutants
    // first attempts to compile and if there's an error, it just returns that output.
    console.log('Compiling code...');
    compile(getCode());
    console.log('Done!');
    return false;
  });
  $('#btn-run').click(function() {
    // TODO: If we keep the compile button, perhaps keep this disabled until a successful
    // compiilation has occured and no further changes to the tests have been made.
    console.log('Running tests...');
    runTests(getCode());
    console.log('Done!');
    return false;
  });
  $('#btn-kill-mutants').click(function() {
    // TODO: If we keep the compile button, perhaps keep this disabled until a successful
    // compiilation has occured and no further changes to the tests have been made.
    console.log('Killing mutants...');
    mutationTest(getCode());
    console.log('Done!');
    return false;
  });
});

function compile(testsCode) {
  $.ajax({
    url: '/game/compile',
    type: 'POST',
    data: { code: testsCode },
    success: function(data) {
      // TODO: do something meaningful with response
      // In this case, should probably place the compiler output into a new view
      console.log(data);
    }
  });
}

function runTests(testsCode) {
  $.ajax({
    url: '/game/run-tests',
    type: 'POST',
    data: { code: testsCode },
    success: function(data) {
      // TODO: do something meaningful with response
      // In this case, should probably place the test results into a new view
      console.log(data);
    }
  });
}

function mutationTest(testsCode) {
  $.ajax({
    url: '/game/mutation-test',
    type: 'POST',
    data: { code: testsCode },
    success: function(data) {
      // TODO: do something meaningful with response
      // In this case, should probably place the mutation test results into a new view
      console.log(data);
    }
  });
}

// Helper function
function getCode() {
  return ace.edit('editor').getValue();
}

// Helper function, not sure if we need it but may be useful if we wanted to do something cool like
// placing the compiler errors/warnings inline with the code the user edits
function setCode(replacementCode) {
  ace.edit('editor').setValue(replacementCode);
}
