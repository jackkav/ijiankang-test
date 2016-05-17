#!/bin/bash
source ./env.sh
cd $APP_PATH

rm -rf .meteor/local
meteor build $BUILD_PATH \
  --mobile-settings $MOBILE_SETTINGS \
  --server $MOBILE_SERVER

cd $BUILD_PATH/ios/project
open .
#
# xcodebuild archive -scheme 爱健康 -archivePath 爱健康
# xcodebuild -exportArchive -archivePath 爱健康.xcarchive -exportPath 爱健康 -exportFormat ipa -exportProvisioningProfile "iJianKangPatient"
