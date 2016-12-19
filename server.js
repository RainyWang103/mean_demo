var express 		 = require('express');
    app 			 = express();
    bodyParser		 = require('body-parser');
    mongoose         = require('mongoose');
    meetupsController = require('./server/controllers/meetups-controller'); 
    // actually, we can also just require the folder, and use "." to specify each controller
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/mean-demo');

app.use(bodyParser()); //use middleware to inject

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/client/views/index.html');
});

/* Routes for including javascript files
   short-cutting with a middleware, everytime request a file inside '/js', 
   reply with a static '/client/js'
*/
app.use('/js', express.static(__dirname + '/client/js')); 

// REST API
app.get('/api/meetups', meetupsController.list);
app.post('/api/meetups', meetupsController.create); //function(req, res) {});



/* always listen to port 3000, 
	update html real time when running `node server`,
	just refresh the page to update

	but if we updated our routes, we need to restart the server!
*/
app.listen(3000, function() {	
	console.log('I\'m listening');
});
