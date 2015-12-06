FROM java:8

# install git
RUN apt-get update && apt-get install -y git

# copy over script
COPY run.sh .

# setup environment variables
ARG USERNAME
ARG TESTNAME
ARG TIMESTAMP
ARG NAME
ARG EMAIL
ARG ACCESS_TOKEN
ENV USERNAME $USERNAME
ENV TESTNAME $TESTNAME
ENV TIMESTAMP $TIMESTAMP
ENV NAME $NAME
ENV EMAIL $EMAIL
ENV ACCESS_TOKEN $ACCESS_TOKEN

# copy user's repo
RUN git clone https://github.com/${USERNAME}/kill-the-mutants
WORKDIR /kill-the-mutants

# copy over user's test suite
ENV TESTPATH ${TESTNAME}/${TIMESTAMP}
COPY tmp/${USERNAME}/${TESTPATH} ./${TESTPATH}

CMD ../run.sh
