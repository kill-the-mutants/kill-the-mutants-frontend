#!/bin/sh

# check required environment variables
if [ -z ${USERNAME+x} ] ||
   [ -z ${TESTNAME+x} ] ||
   [ -z ${TIMESTAMP+x} ]; then
  echo "Requires the following environment variables to be set:"
  echo "USERNAME TESTNAME TIMESTAMP"
  exit 0
fi

# set variables
GIT_PUSH=${1:-$GIT_PUSH}
TEST_TOOL=${2:-$TEST_TOOL}

# git push if specified
if [ "$GIT_PUSH" = true ]; then

  # check required environment variables
  if [ -z ${NAME+x} ] ||
     [ -z ${EMAIL+x} ] ||
     [ -z ${ACCESS_TOKEN+x} ]; then
    echo "Requires the following environment variables to be set:"
    echo "NAME EMAIL ACCESS_TOKEN"
    exit 0
  fi

  # setup git configuration
  git config --global push.default simple
  git config --global user.name ${NAME}
  git config --global user.email ${EMAIL}

  git add .
  git commit -m "Automatically committed using Kill the Mutants"
  git push "https://${USERNAME}:${ACCESS_TOKEN}@github.com/${USERNAME}/kill-the-mutants"
fi

# exit if we do not want to run any tests or compile
if [ -z "$TEST_TOOL" ]; then
  exit 0
fi

# setup for a given test suite
mv ${TESTNAME}/${TIMESTAMP}/* ${TESTNAME}

# compile
DEPENDENCIES_DIR=dependencies
CLASSPATH=${DEPENDENCIES_DIR}/*
javac -cp "${CLASSPATH}" ${TESTNAME}/*.java
CLASSPATH=${CLASSPATH}:.

# run tests
case $TEST_TOOL in

  # vanilla JUnit
  junit)  java -cp $CLASSPATH $TESTNAME.TestSuite
          ;;

  # PIT mutation testing
  pit)    java -cp $CLASSPATH \
              org.pitest.mutationtest.commandline.MutationCoverageReport \
              --reportDir ./reports \
              --sourceDirs . \
              --targetClasses $TESTNAME.Snippet \
              --targetTests $TESTNAME.TestSuite
          ;;

  # Jumble mutation testing
  jumble) java -jar $DEPENDENCIES_DIR/jumble_binary_1.3.0.jar \
              --classpath $CLASSPATH \
              $TESTNAME.Snippet \
              $TESTNAME.Tests
          ;;

esac
