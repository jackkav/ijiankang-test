/**
 * Created by fanjinhui on 6/13/16.
 */
//http://stackoverflow.com/questions/29295143/how-to-do-mongo-group-on-meteor-server-side


wrapAsync = (Meteor.wrapAsync)? Meteor.wrapAsync : Meteor._wrapAsync;
Mongo.Collection.prototype.group = function() {
    var coll;
    if (this.rawCollection) {
        // >= Meteor 1.0.4
        coll = this.rawCollection();
    } else {
        // < Meteor 1.0.4
        coll = this._getCollection();
    }

    var args = _.toArray(arguments);
    return wrapAsync(function (callback) {
        coll.group.apply(coll, args.concat([callback]));
    })();
}