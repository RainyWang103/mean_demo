# mean_demo
Toy project demonstration using MEAN Stack, developed by Rainy Wang

This project is following video: [MEAN Locally from Scratch](https://www.youtube.com/watch?v=AEE7DY2AYvI&list=RDAEE7DY2AYvI)
> 
> * The goal is to build the MEAN application from scratch, starting with Node.js
> * You can either keep this <b>README</b> as a guide to navigate the code or following the video

Goode reference & seed projects: [meanjs](http://meanjs.org/), [meanio](http://mean.io)

Other Tools: [GRUNT](http://gruntjs.com) a JS Task Runner, may need to do <b>minification</b>!

## MongoDB Introduction

Take a look at `MongoDB & Shell.md`, for why should we and how to begin using MongoDB 

## Notes on running the project locally

To start the server

```
node server.js
```

To run by keeping listening to port and code change all the time

```
nodemon server.js
```

### Installed npm packages
 
<b>nodemon</b>: listen to port and code change all the time, no need to stop the app and reboot each time

```
npm install -g nodemon
```

* add `-g` if you want use any package globally

## Get started from very basic Node
* `package.json`: manifest of project, to start, minimum include name & version; but we should add more info to describe the app better
* `server.js`: main program, entry point, can also called main.js. To run, just run `node server`, then we will get desired output from the console

## Make our web app with Express

### Cool things
express runs as the web server itself, different from stuff like php; load whole application in memory, respond to http request and never touch the file system again; which is super quick!

A useful tool: <b>express-generater</b>, which can generate the server-client structure automatically

```
npm install -g express-generator
```

However, in this project, we will build the application from scratch

### Essentials
> 
> * Web app framework for Node 
> * Can serve as a HTTP server, listen to HTTP request and generate response
> * Clear syntax for routing, handle different request in different ways
> * Has awesome Middleware, we can inject middleware to handle stuff during routes

* `npm install express --save` to install express for our project; the `save` will add dependencies to our `package.json`
* Do following codes in `server.js`: 


> "client" folder refers to jargon "server-client", some people also name it as "public", "app"

```javascript
var express = require('express');
    app = express();

// someone  make a get request to our root domain, then we send a file as a response
app.get('/', function(req, res) {
	res.sendfile(__dirname + '/client/views/index.html');
}); 

// tell express to stay up & listen to port 3000 & handle http requests
app.listen(3000, function() {
	console.log('I\'m listening');
});
```

## AngularJS
> Essentials:
> 
> * Client-side MVC framework
> * build dynamic web apps
> * seperate concerns for controllers, views, models...
> 
> Good stuff
> 
> * Declarative UI Bindings
> * Embeddable (use little or much, can use on small part of the application)
> * Dependency injection, Testable Frontend code (thicker client)

Now, we include [AngularJS file](https://ajax.googleapis.com/ajax/libs/angularjs/1.2.16/angular.js) script in out html body, then tell html that its an `ng-app`. Then we can create more interesting views in the body part

> `ng` is just a short name for `angular`

* now we can use controllers as `ng-controller`, create another folder `js` under `client` to store all `javascript` files 

> `$scope` is shared for view & controller to talk

* we also need to include the scripts we use in the html body. But now we actually can't include the scripts because there is no route for that. Before, we only routed our base URL

Therefore, we now add a route (in `server.js`) so our server can reply back with a javascript file. We can also do a shortcut to cut `/client` out:

```javascript
/* Routes for including javascript files
   short-cutting with a middleware, everytime request a file inside '/js', 
   reply with a static '/client/js'
*/
app.use('/js', express.static(__dirname + '/client/js')); 
```

After that, since we created a new route, we need to restart our server to get the updated page!

We can also show list & create forms, check out the `index.html` & `meetup-controller.js` for reference

* stuff after `ng-..` will have access to our controller at the scope
* `ng-submit` means angular will handle submission and return the value to the controller and call a function `createMeetup()`

However, when we refresh, we will find all info lost, the added meetups are just temporary. So here is when <b>MongoDB</b> comes!!!

## Make tha app real with REST & MongoDB
### RESTful APIs

> MongoDB wants to use `ng-resource` supported by angular, which is an add-on to angulat space framework: Add new script [angular-resource-js](https://ajax.googleapis.com/ajax/libs/angularjs/1.2.16/angular-resource.js)

To specify our angular app, we add `app.js` in `/js`. And add the script and update the app name(`ng-app='meetupApp'`) in the `index.html`
> Note this is the client-side app, we also have a server-side app in `server.js`

To use `$resource`:

```javascript
var Meetup = $recource('/api/meetups');
```
Then we can modify `createMeetup()`:

```javascript
$scope.createMeetup = function() {		
	var meetup = new Meetup();
	meetup.name = $scope.meetupName; 
	meetup.$save();
};
```
However, this will give us a post 404 error since we haven't define our REST service for  `'/api/meetups'`. So we need to add the service in our `server.js`, i.e. add the route. (check `app.post(..)` for reference)

To do better organization, we creater `server` folder to do exact same NBC like `client` folder

After the changes, we have to restart the server. To make Express understand JSON body:
> `npm install body-parser --save`
Then require it in `server.js` and use middleware

### Add MongoDB
> Essentials:
> 
> * One way to do it is just use local mongoDB
> * Here we can use `mongoose`, which can define schema in the application and comes with nice syntax around the driver
> 
> First, intall the moduel: `npm install mongoose --save` 
 
then <b>start our mongod!!</b> get the port number (27017)

* We want to be able to save the model, in server, create new folder `models` and inside a new file `meetup.js`, which is the meetup model for mongoose
* Then we update `server/controllers/meetups-controller` accordingly
* Additionally, we also need to connect to the MongoDB databse, do in `server.js`:

```javascript
var mongoose = require('mongoose');
...
mongoose.connect('mongodb://localhost:27017/mean-demo');
```

Then when starting the server again, we will be able to add info to the database directly

In server-side & client-side controller, we can also do something with the save result

<b>Note:</b> whenever send a request to server, must let server generate a response to client!

> since: mpromise (mongoose's default promise library) is deprecated
> 
> We use bluebird as the promise library: `npm install bluebird --save`
> and place `mongoose.Promise = require('bluebird');` in all places when requiring `mongoose`
> 

#### Now we do one more step to clear out what we hard coded for the meetups and get data only from the database

```javascript
var Meetup = $resource('/api/meetups');
Meetup.query(function (results) {			
	$scope.meetups = results;
});
```
To make the above work, we need to add a GET route for `'/api/meetups'`; So we do similar things again in `server.js` and the server-side controller

