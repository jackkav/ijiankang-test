#!/bin/bash

BIN_PATH=$PWD
PORT=9000
DATE=`date +%Y-%m-%d:%H:%M:%S`
APP_NAME='爱健康'
SERVER_IP='120.131.8.229'
# FIR_API_TOKEN='024f71dbb04538edf47a4eff3f533dc5'
FIR_API_TOKEN='bbc06eb58f42d25da545149c0d7d21ca'

cd ../
ROOT_PATH=$PWD
APP_PATH=$ROOT_PATH/BP3L
BUILD_PATH=$ROOT_PATH/.tmp/build-$DATE
MOBILE_SETTINGS=$BIN_PATH/settings.json
MOBILE_SERVER=http://${SERVER_IP}:$PORT

rm -rf $APP_PATH/.meteor/local
