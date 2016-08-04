# ionic-app

# Instractions for ubuntu

## install nodejs and npm

sudo apt-get install nodejs

sudo apt-get install npm

sudo ln -s /usr/bin/nodejs /usr/bin/node


## install ionic2

npm install -g ionic@beta

## go to app folder
cd ionic-app

## install packages 
npm install

## launch in browser 
ionic serve

# For build on android device

## install cordova
npm install -g cordova

## add android platform
ionic platform add android

## install openjdk
sudo apt-get install openjdk-7-jdk

## download android sdk
wget http://dl.google.com/android/android-sdk_r24.2-linux.tgz
tar -xvf android-sdk_r24.2-linux.tgz
cd android-sdk-linux/tools

## install all sdk packages
./android update sdk --no-ui

## set path
vi ~/.zshrc << EOT

export PATH=${PATH}:$HOME/sdk/android-sdk-linux/platform-tools:$HOME/sdk/android-sdk-linux/tools:$HOME/sdk/android-sdk-linux/build-tools/22.0.1/

EOT

source ~/.zshrc

## adb
sudo apt-get install libc6:i386 libstdc++6:i386
## aapt
sudo apt-get install zlib1g:i386


## run on android device
ionic run android
