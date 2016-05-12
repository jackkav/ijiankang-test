/**
 * Created on 5/11/16.
 */

/////////BP3L/////////

class BP3L extends EventEmitter {

}
this.BP3L = BP3L

BP3L.appsecret = "148779a50cf3c1c06634c996b54def5e"


BP3L.parseJSON = function (str, defaultValue) {
	try {
		var json = JSON.parse(str);
		return json;
	} catch (err) {
		console.warn('parseJSON' + err);
		return defaultValue || {}
	}
}