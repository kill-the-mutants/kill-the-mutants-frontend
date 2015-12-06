var path = require('path');
var mkdirp = require('mkdirp');
var rmdir = require('rimraf');
var fs = require('fs');
var spawn = require('child_process').spawn;

function execute(user, testname, git_push, test_tool, code, callback) {
  var docker_arguments = create_arguments(user, testname, git_push, test_tool);

  // write to a temporary file
  write_to_file(docker_arguments.filepath, code, function(err) {
    if(err) {
      callback(docker_arguments, undefined, err);
    } else {

      // build the container
      run_cmd('docker', docker_arguments.build_arguments, function(stdout, stderr){
        if(stderr) {
          callback(docker_arguments, stdout, stderr);
        } else {

          // then run the container
          run_cmd('docker', docker_arguments.run_arguments, function(stdout, stderr){
            callback(docker_arguments, stdout, stderr);

            // finally delete some of the temporary directory (asyncronously)
            remove_last_dir(docker_arguments.filepath, function(err) {
              if(err) console.log(err);
            });
          });
        }
      });
    }
  });
}

function create_arguments(user, testname, git_push, test_tool, callback) {
  var docker_arguments = {};

  docker_arguments.timestamp = Math.floor(Date.now() / 1000);
  docker_arguments.path = user.login + '-' + testname + '-' + docker_arguments.timestamp;
  docker_arguments.tag = docker_arguments.path.toLowerCase(); // docker containers need to be lowercase

  // write to file arguments
  docker_arguments.filepath = path.join(__dirname, '../docker/tmp/' + docker_arguments.path + '/Tests.java');

  // docker build arguments
  docker_arguments.build_arguments = [
    'build',
    '--tag', docker_arguments.tag,
    '--build-arg', 'USERNAME=' + user.login,
    '--build-arg', 'NAME=' + user.firstname + ' ' + user.lastname,
    '--build-arg', 'EMAIL=' + user.email,
    '--build-arg', 'ACCESS_TOKEN=' + user.access_token,
    '--build-arg', 'TESTNAME=' + testname,
    '--build-arg', 'TIMESTAMP=' + docker_arguments.timestamp,
    'docker'
  ]

  // docker run arguments
  docker_arguments.run_arguments = [
    'run',
    '--env', 'GIT_PUSH=' + git_push,
    '--env', 'TEST_TOOL=' + test_tool,
    docker_arguments.tag
  ]

  return docker_arguments;
}

function write_to_file(filepath, contents, callback) {
  // first create the directory
  mkdirp(path.dirname(filepath), function (err) {
    if(err){
      callback(undefined, err);
    } else {
      fs.writeFile(filepath, contents, function(err) {
        if(err) {
          callback(undefined, err);
        } else {
          callback();
        }
      });
    }
  });
}

function remove_last_dir(filepath, callback) {
  var lastIndex = filepath.lastIndexOf("/");
  filepath = filepath.substring(0, lastIndex);
  rmdir(filepath, function(err) {
    callback(err);
  });
}

function run_cmd(cmd, args, callback ) {
  console.log('Command:', cmd);
  console.log('Arguments:', args);

  var child = spawn(cmd, args);
  var stdout = "";
  var stderr = "";

  child.stdout.on('data', function (buffer) { console.log('$ ' + (stdout += buffer.toString())); });
  child.stderr.on('data', function (buffer) { console.log('$ ' + (stderr += buffer.toString())); });

  child.on('exit', function() { callback (stdout, stderr) });
}

module.exports = {
  execute: execute
};
