var AccountModel = require("../models/accountmodel");
var SessionModel = require("../models/sessionmodel");
var StateModel = require("../models/statemodel");

var appRouter = function(app) {

    /*
     * This is an API driven application.  Don't allow traffic to the root index
     * endpoint
     */
    app.get("/", function(req, res) {
        res.status(403).send("Not a valid endpoint");
    });

    /*
     * Create a new user document in the database if one doesn't already exist
     */
    app.post("/api/user", function(req, res) {
        if(!req.body.name) {
            return res.status(400).send({"status": "error", "message": "A name is required"});
        } else if(!req.body.username) {
            return res.status(400).send({"status": "error", "message": "A username is required"});
        } else if(!req.body.password) {
            return res.status(400).send({"status": "error", "message": "A password is required"});
        }
        AccountModel.create(req.body, function(error, result) {
            if(error) {
                return res.status(400).send(error);
            }
            res.send(result);
        });
    });

    /*
     * Get an existing user document based on username if it exists
     */
    app.get("/api/user", function(req, res) {
        if(!req.query.username) {
            return res.status(400).send({"status": "error", "message": "A username is required"});
        }
        AccountModel.getByUsername(req.query, function(error, result) {
            if(error) {
                return res.status(400).send(error);
            }
            res.send(result);
        });
    });

    /*
     * Get information about the currently signed in user
     */
    app.get("/api/user/me", SessionModel.authenticate, function(req, res, next) {
        if(!req.uid) {
            return next(JSON.stringify({"status": "error", "message": "A uid must be provided"}));
        }
        AccountModel.get(req.uid, function(error, result) {
            if(error) {
                return res.status(400).send(error);
            }
            res.send(result);
        });
    });

    /*
     * Validate the sign in attempt and return a session if successful for accessing
     * secure API endpoints
     */
    app.get("/api/auth", function(req, res, next) {
        if(!req.query.username) {
            return next(JSON.stringify({"status": "error", "message": "A username must be provided"}));
        }
        if(!req.query.password) {
            return next(JSON.stringify({"status": "error", "message": "A password must be provided"}));
        }
        AccountModel.getByUsername(req.query, function(error, user) {
            if(error) {
                return res.status(400).send(error);
            }
            if(!AccountModel.validatePassword(req.query.password, user[0].password)) {
                return res.send({"status": "error", "message": "The password entered is invalid"});
            }
            SessionModel.create(user[0].uid, function(error, result) {
                if(error) {
                    return res.status(400).send(error);
                }
                res.setHeader("Authorization", "Bearer " + result);
                res.send(user);
            });
        });
    });

    /*
     * Get the state for a particular save name
     */
    app.get("/api/state/:name", SessionModel.authenticate, function(req, res, next) {
        if(!req.uid) {
            return next(JSON.stringify({"status": "error", "message": "A uid must be provided"}));
        }
        StateModel.getByUserIdAndName(req.uid, req.params.name, function(error, result) {
            if(error) {
                return res.send(error);
            }
            res.send(result);
        });
    });

    /*
     * Create or update a save state for a particular name
     */
    app.put("/api/state/:name", SessionModel.authenticate, function(req, res, next) {
        StateModel.save(req.uid, req.params.name, parseInt(req.query.preVer, 10), req.body, function(error, result) {
            if(error) {
                return res.send(error);
            }
            res.send(result);
        });
    });

    /*
     * Get all game states for the currently signed in user
     */
    app.get("/api/states", SessionModel.authenticate, function(req, res, next) {
        if(!req.uid) {
            return next(JSON.stringify({"status": "error", "message": "A uid must be provided"}));
        }
        StateModel.getByUserId(req.uid, function(error, result) {
            if(error) {
                return res.send(error);
            }
            res.send(result);
        });
    });

};

module.exports = appRouter;
