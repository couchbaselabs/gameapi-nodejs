var uuid = require("uuid");
var couchbase = require("couchbase");
var N1qlQuery = require('couchbase').N1qlQuery;
var db = require("../app").bucket;

function StateModel() { };

StateModel.save = function(uid, name, preVer, data, callback) {
    db.get("user::" + uid + "::state", function(error, result) {
        if(error && error.code !== couchbase.errors.keyNotFound) {
            callback(error, null);
            return;
        }
        var stateDoc = {
            type: "state",
            uid: uid,
            states: {}
        };
        if(result != null && result.value) {
            stateDoc = result.value;
        }
        var stateBlock = {
            version: 0,
            data: null
        };
        if(stateDoc.states[name]) {
            stateBlock = stateDoc.states[name];
        } else {
            stateDoc.states[name] = stateBlock;
        }
        if(stateBlock.version !== preVer) {
            return callback({"status": "error", "message": "Your version does not match the server version"});
        } else {
            stateBlock.version++;
            stateBlock.data = data;
        }
        var stateOptions = {};
        if(result != null && result.value) {
            stateOptions.cas = result.cas;
        }
        db.upsert("user::" + uid + "::state", stateDoc, stateOptions, function(error, result) {
            if(error) {
                return callback(error, null);
            }
            callback(null, stateBlock);
        });
    });
};

StateModel.getByUserId = function(uid, callback) {
    db.get("user::" + uid + "::state", function(error, result) {
        if(error) {
            if(error.code !== couchbase.errors.keyNotFound) {
                return callback(null, {});
            } else {
                return callback(error, null);
            }
        }
        callback(null, result.value.states);
    });
};

StateModel.getByUserIdAndName = function(uid, name, callback) {
    db.get("user::" + uid + "::state", function(error, result) {
        if(error) {
            if(error.code !== couchbase.errors.keyNotFound) {
                return callback(null, {});
            } else {
                return callback(error, null);
            }
        }
        if(!result.value.states[name]) {
            return callback({"status": "error", "message": "State does not exist"}, null);
        }
        callback(null, result.value.states[name]);
    });
};

module.exports = StateModel;
