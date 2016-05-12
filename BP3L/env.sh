
#export FRAMEWORK_LIB=~/Desktop/ihealth/framework-iHealth/library

export BUILD_ROOT=`pwd`


export MONGO_URL=mongodb://deviceLoadTestByiHealth:djsDfjweFHp33ew@120.131.8.26:27017,120.131.8.27:27017,120.131.8.46:27017/device-load-test?replicaSet=iHealthMongo
export MONGO_OPLOG_URL=mongodb://deviceLoadTestByiHealth:djsDfjweFHp33ew@120.131.8.26:27017,120.131.8.27:27017,120.131.8.46:27017/local?authSource=device-load-test

echo $PACKAGE_DIRS