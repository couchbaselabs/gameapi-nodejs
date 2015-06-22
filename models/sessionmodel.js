var uuid = require("uuid");
var forge = require("node-forge");
var db = require("../app").bucket;

function SessionModel() { };

SessionModel.authenticate = function(req, res, next) {
    if(!req.headers.authorization) {
        next("Must be authorized to use");
    }
    var authInfo = req.headers.authorization.split(" ");
    if(authInfo[0] === "Bearer") {
        var sid = authInfo[1];
        console.log(sid);
        SessionModel.get(sid, function(error, result) {
            if(error) {
                return next(error);
            }
            req.uid = result.value.uid;
            next();
        });
    }
};

SessionModel.create = function(uid, callback) {
    var sessionDoc = {
        type: "session",
        sid: uuid.v4(),
        uid: uid
    };
    db.insert("session::" + sessionDoc.sid, sessionDoc, {"expiry": 3600}, function(error, result) {
        if(error) {
            callback(error, null);
            return;
        }
        callback(null, sessionDoc.sid);
    });
};

SessionModel.get = function(sid, callback) {
    db.get("session::" + sid, function(error, result) {
        if(error) {
            callback(error, null);
            return;
        }
        callback(null, result);
    });
};

module.exports = SessionModel;
