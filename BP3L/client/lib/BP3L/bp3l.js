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
	var platform = window.device && window.device.platform.toLowerCase()
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

//初始化验证字符串
Meteor.startup(function(){
	BP3L.initAppsecret()

	console.log('Meteor.startup: BP3L.appsecret ',BP3L.appsecret)

})