/**
 * Created on 5/11/16.
 */

/////////BP3L/////////

class BP3L extends EventEmitter {

}
this.BP3L = BP3L




BP3L.parseJSON = function (str, defaultValue) {
	try {
		var json = JSON.parse(str);
		return json;
	} catch (err) {
		console.warn('parseJSON' + err);
		return defaultValue || {}
	}
}

BP3L.isIOS = function(){
	var platform = window.device && window.device.platform && window.device.platform.toLowerCase()
	return  platform==='ios' ||  /iPhone|iPad|iPod/.test(navigator.platform)
}

BP3L.measureSecret= {
	"ios":"ffd5a4a408e902acac70d7a8956f833c",
	"android":"c8b6d55c7ac1e1eecfc1787bd244a214"
}
//BP3L.appsecret = "148779a50cf3c1c06634c996b54def5e"



BP3L.initAppsecret = function(){

	let appsecret
	if(BP3L.isIOS()){
		appsecret = BP3L.measureSecret.ios
	}else{ //android
		appsecret = BP3L.measureSecret.android
	}

	//expose
	BP3L.appsecret = appsecret
}

BP3L.say=function(str){

	var success = function(message){
		console.log(message);
	}

	var failure = function(message){
		console.log(message);
	}

	console.log('startSpeaker '+ str)
	SSManagerCordova.startSpeaker(success, failure, str );

}

//初始化验证字符串
Meteor.startup(function(){
	BP3L.initAppsecret()

	console.log('Meteor.startup: BP3L.appsecret ',BP3L.appsecret)

})

////////////////////////////////
BP3L.discover = function(deviceID, successCallback , failureCallback) {

	let self = this

	let discoverySuccess = false
	BpManagerCordova.startDiscovery((res)=> {
		let device = BP3L.parseJSON(res)

		console.log('startDiscovery',res)

		if (device.msg == "Discovery") {

			if (device.address==deviceID && device.name === "BP3L" ) {

				discoverySuccess = true

				console.log("Discovery device success "+ device.address)

				BpManagerCordova.stopDiscovery((res)=> {

				})

			}

		} else if (device.msg == "DiscoveryDone") {

			console.log("DiscoveryDone")


			if (discoverySuccess) {

				successCallback && successCallback(device)


			}else{//发现设备

				//failure
				failureCallback && failureCallback('discover_failure', device)

			}

		}else{
				failureCallback && failureCallback('discover_failure', device)

		}

	}, (res)=> {

		failureCallback && failureCallback('discover_error', BP3L.parseJSON(res,{info:res}))

	}, BP3L.appsecret)

}

BP3L.connect =function(deviceID, successCallback , failureCallback){

	//连接的25s 超时
	let connectTimer = setTimeout(function(){
		//timeout
		failureCallback && failureCallback('connect_timeout')


	},25000)

	BpManagerCordova.connectDevice((res)=> {
		clearTimeout(connectTimer)

		let dataJSON = BP3L.parseJSON(res)


		if (dataJSON.msg == "Connected") {
			//success
			successCallback && successCallback(dataJSON)

		} else if (dataJSON.msg == "ConnectionFail" || dataJSON.msg == "Error") {

			//failure
			failureCallback && failureCallback('connect_failure',dataJSON)

		}
	}, (res)=> {
		clearTimeout(connectTimer)

		//error
		failureCallback && failureCallback('connect_error',BP3L.parseJSON(res,{info:res}))


	}, BP3L.appsecret, deviceID)

}

BP3L.measure=function(deviceID, successCallback , failureCallback, processCallback) {

	let self = this


	BpManagerCordova.startMeasure(function (res) {
		var json = BP3L.parseJSON(res);

		if (json.msg == 'ZeroDoing') {
			processCallback && processCallback('ZeroDoing')

		}else if(json.msg == 'ZeroDone'){
			processCallback && processCallback('ZeroDone')


		} else if (json && json.msg == 'MeasureDone') {

			successCallback && successCallback(json)

		} else if (json && json.msg == 'MeasureDoing') {

			processCallback && processCallback('MeasureDoing')


		} else if (json && json.msg == 'Error') {
			console.log('ErrorID '+json.errorid)

			failureCallback && failureCallback('measure_failure',json)

		}


	},function (res) {

		failureCallback && failureCallback('measure_error',BP3L.parseJSON(res,{info:res}))

	},BP3L.appsecret, deviceID)
}

BP3L.disconnectDevice = function(deviceID){
	BpManagerCordova.disConnectDevice((res)=> {
		console.log('disConnectDevice 1 callback '+ res)

	}, (res)=> {
		console.log('disConnectDevice 2 callback error'+ res)

	}, BP3L.appsecret, deviceID);
}

BP3L.detectDisconnect= function(deviceID,successCallback, failureCallback) {

	console.log("add setDisconnectCallback "+ deviceID)
	BpManagerCordova.setDisconnectCallback((res)=> {
		console.log(" in setDisconnectCallback 1st callback "+ res)
		var json = BP3L.parseJSON(res);

		if(json.msg == 'Disconnect' && json.address== deviceID){

			successCallback && successCallback(json)

		}else{
			failureCallback && failureCallback('disconnectCallback_failure',json)
		}

	}, (res)=> {
		console.log("in setDisconnectCallback 2st callback  error "+ res)
		failureCallback && failureCallback('disconnectCallback_error',BP3L.parseJSON(res,{info:res}))


	}, BP3L.appsecret, deviceID);


}



BP3L.discoverAndConnect = function(deviceID, successCallback , failureCallback){

	BP3L.discover(deviceID,function(device){
		BP3L.connect(device.address,successCallback,failureCallback)

	},failureCallback)

}
