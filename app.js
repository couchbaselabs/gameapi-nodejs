var express = require("express");
var bodyParser = require("body-parser");
var couchbase = require("couchbase");
var N1qlQuery = require('couchbase').N1qlQuery;
var config = require("./config");
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Global declaration of the Couchbase server and bucket to be used
//var mainBucket = (new couchbase.Cluster(config.couchbase.server)).openBucket(config.couchbase.bucket)
//mainBucket.enableN1ql(["http://localhost:8093/"]);
//module.exports.bucket = mainBucket;
module.exports.bucket = (new couchbase.Cluster(config.couchbase.server)).openBucket(config.couchbase.bucket);

// All endpoints to be used in this application
var routes = require("./routes/routes.js")(app);

var server = app.listen(3000, function () {
    console.log("Listening on port %s...", server.address().port);
});
