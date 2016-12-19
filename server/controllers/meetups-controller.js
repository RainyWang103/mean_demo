var Meetup = require('../models/meetup'); // same use like $resource

// if want somebody outside to access it, we need to export it

// here we just try to make server.js looks like just routes, move the function details here!
module.exports.create = function(req, res) {
	//console.log(req.body);
	var meetup = new Meetup(req.body);
	meetup.save(function (err, result) {
		res.json(result);
	}); // save to Mongo database
};

module.exports.list = function(req, res) {
	Meetup.find({}, function (err, results) { // find() is a method in mongoose
		res.json(results);
	});
};