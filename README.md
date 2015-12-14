# kill-the-mutants
Mutation testing educational tool.

# Installation

Here are some commands that will help with installation. These commands are specific for running on an Amazon EC2 instance running Amazon Linux.

```

// install docker
curl -o /usr/bin/docker https://get.docker.com/builds/Linux/x86_64/docker-1.9.0
sudo service docker start
sudo usermod -a -G docker ec2-user

// need to logout for sudo privileges to take effect
<< logout and log back in >>

// install nvm in order to install node and npm
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.26.1/install.sh | bash

// need path reloaded for nvm
<< logout and log back in >>

// install node and npm; allow them to work with sudo
nvm install v4.2.3
sudo ln -s /usr/local/bin/node /usr/bin/node
sudo ln -s /usr/local/lib/node /usr/lib/node
sudo ln -s /usr/local/bin/npm /usr/bin/npm
sudo ln -s /usr/local/bin/node-waf /usr/bin/node-waf

// install git
sudo yum update -y
sudo yum install git -y

// clone kill-the-mutants-frontent
git clone https://github.com/kill-the-mutants/kill-the-mutants-frontend.git
cd kill-the-mutants-frontend

// install dependencies
npm install
npm install bower -g
bower install -n

// setup your GitHub Application
<<
Create lib/api.json using your credentials with the following format:
{
  "GITHUB_CLIENT_ID”:”YOUR_GITHUB_ID”,
  "GITHUB_CLIENT_SECRET”:”YOUR_GITHUB_SECRET”
}

make sure to set your callback path on the GitHub application page to:
http://YOUR_ADDRESS/oauth/callback
>>

// get forever so we can node in the background
sudo npm install -g forever

// run!
sudo PORT=80 nohup npm start &

```
