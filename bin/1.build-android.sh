#!/bin/bash
source ./env.sh
cd $APP_PATH

rm -rf .meteor/local
meteor build $BUILD_PATH \
  --mobile-settings $MOBILE_SETTINGS \
  --server $MOBILE_SERVER


cd $BUILD_PATH/android
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 \
  release-unsigned.apk $APP_NAME \
  -keystore $BIN_PATH/keystore \
  -storepass 123456

zipalign 4 release-unsigned.apk ${APP_NAME}.apk
  fir publish ${APP_NAME}.apk -T ${FIR_API_TOKEN} -V
