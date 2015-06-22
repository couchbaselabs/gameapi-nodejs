var uuid = require("uuid");
var forge = require("node-forge");
var db = require("../app").bucket;

function AccountModel() { };

/*
 * Create a new user account provided it doesn't already exist
 */
AccountModel.create = function(params, callback) {
    var userDoc = {
        type: "user",
        uid: uuid.v4(),
        name: params.name,
        username: params.username,
        password: forge.md.sha1.create().update(params.password).digest().toHex()
    };
    var referenceDoc = {
        type: "username",
        uid: userDoc.uid
    };
    db.insert("username::" + userDoc.username, referenceDoc, function(error) {
        if(error) {
            callback(error, null);
            return;
        }
        db.insert("user::" + userDoc.uid, userDoc, function(error, result) {
            if(error) {
                callback(error, null);
                return;
            }
            callback(null, {message: "success", data: result});
        });
    });
};

/*
 * Get the reference to an already existing user account
 */
AccountModel.getByUsername = function(params, callback) {
    db.get("username::" + params.username, function(error, result) {
        if(error) {
            callback(error, null);
            return;
        }
        AccountModel.get(result.value.uid, function(error, result) {
            if(error) {
                callback(error, null);
                return;
            }
            callback(null, result);
        });
    });
};

/*
 * Get the user account that maps to the provided uid user reference
 */
AccountModel.get = function(uid, callback) {
    db.get("user::" + uid, function(error, result) {
        if(error) {
            callback(error, null);
            return;
        }
        callback(null, result);
    });
};

/*
 * Compare a raw password with a SHA1 hashed password to check to see if they equal
 */
AccountModel.validatePassword = function(rawPassword, hashedPassword) {
    return forge.md.sha1.create().update(rawPassword).digest().toHex() === hashedPassword ? true : false;
};

module.exports = AccountModel;
