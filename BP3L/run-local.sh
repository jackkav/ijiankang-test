#!/usr/bin/env bash

#source ./env.sh

export MONGO_URL=mongodb://127.0.0.1:27017/device-load-test



last_commit=$(git rev-parse HEAD)

echo $last_commit

#meteor run  --port 9000
meteor run android-device --port 9000





#meteor run ios-device  #--mobile-server=http://120.131.8.229:9000
#meteor run android-device  #--mobile-server=http://120.131.8.229:9000