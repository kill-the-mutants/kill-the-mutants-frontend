# Push and test with docker

This directory is used to push a user's code to their fork of the [kill-the-mutants repo on github](https://github.com/kill-the-mutants-kill-the-mutants). It uses docker for containment to prevent anyone's Java code from accidentally deleting system32.

## Structure

The Tests.java file that will be used in the container is added to the temporary directory 'tmp'. After a successful run, it is deleted. Here is a look at the file structure:

```
docker
│   README.md
│   Dockerfile              // build a docker container for the script
|   run.sh                  // script to push and test code
│
└───tmp
    ├───USERNAME-TESTNAME-TIMESTAMP1      // deleted after successful run
    │   │   Tests.java                    // file to upload
    │
    ├───USERNAME-TESTNAME-TIMESTAMP2
    │   │   Tests.java
    │
    │ ...
```

## How to run

To push any code or run any test suite, you need to install Docker to your machine. Follow instructions to install Docker [here](https://docs.docker.com/installation/).

*Mac and Windows Users:*  
If you are using Mac OS X or Windows, make sure to run the Docker Quickstart Terminal. Your docker machine must have more than 500MB of memory as the JVM we run uses 500MB. We found that 1GB of memory and 2 processors worked best.

All that's left is to build and run your container. Make sure you define the following build arguments and environment variables:

###### Build Arguments

```
Required:

USERNAME      Your Github username
NAME          Your Github name
ACCESS_TOKEN  Your Github access token (or password)
TESTNAME      The example name you would like to push/run
TIMESTAMP     The timestamp of the test suite you want to push/run

// Example build argument usage:
$ docker build --tag container_name --build-arg VAR=value
```

###### Environment Variables
```
Optional:

GIT_PUSH    Should this code be pushed to github?
  true    :  Push it away!
  false   :  Nope. (default)

TEST_TOOL   The command you want to execute on your code.
            Passing none will only compile your code.
  junit   :  Vanilla JUnit testing
  pit     :  PIT mutation testing tool
  jumble  :  Jumble mutation testing tool

// Example environment variable usage:
$ docker run container_name --env VAR=value
```

Here are some common commands to help you along:

```
// Build your current directory into an image
$ docker build --tag kill-the-mutants --build-arg USERNAME=kill-the-mutants --build-arg TESTNAME=example1 --build-arg TIMESTAMP=0000000001 --build-arg NAME="Kill the Mutants" --build-arg EMAIL=kill-the-mutants@gmail.com --build-arg ACCESS_TOKEN=[ACCESS TOKEN GOES HERE] docker

// Run a new docker container using an image
$ docker run --env GIT_PUSH=true --env TEST_TOOL=pit kill-the-mutants

// Run an existing docker container and then open it (~ ssh)
$ docker run -t -i kill-the-mutants bash

// List all containers
$ docker ps

// Stop a running container
$ docker stop kill-the-mutants

// Remove a container
$ docker rm kill-the-mutants
```

More commands can be found [here](https://github.com/wsargent/docker-cheat-sheet)!

##### Troubleshooting

###### "Help! My docker container hangs!"

This is a problem that we used to run into before we increased the memory of the JVM in the docker container. Our original idea was to increase the docker machine's memory, which while it helped, did not solve the actual problem. We wanted to keep these commands here for future reference. Note that these are only relevant on Mac OS X or Windows, as docker simply runs on your machine by itself if you are running Linux.

```
docker-machine rm default
docker-machine create -d virtualbox --virtualbox-memory 4096 --virtualbox-cpu-count 2 default
```

You can check your docker-machine's settings here if you are a mac user:

```
~/.docker/machine/machines/default/config.json
```

###### "Help! My docker container can't connect to the internet!"

If you docker machine is open when you switch internet connections, it may lose it's connection with the outside world. All you have to do is restart your docker-machine and it will take care of itself.

```
docker-machine restart default
```
