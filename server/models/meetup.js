var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

// example to define model schema & export the whole model
module.exports = mongoose.model('Meetup', {
	name: String
});