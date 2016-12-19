/* angular will look for a function named meetupController & inject the scope 
   the $scope is used to talk between the view and the controller
*/

app.controller('meetupsController', ['$scope','$resource', function ($scope, $resource) {

	// use REST services from $resource
	var Meetup = $resource('/api/meetups');

	Meetup.query(function (results) {	// this will just do a query from the api defined above
		$scope.meetups = results;
	});
	$scope.meetups =[];
	// $scope.meetups =[
	// 	{ name: "MEAN HK Developers" },
	// 	{ name: "Some other meetups"}
	// ];

	$scope.createMeetup = function() { // we already have meetupName
		// $scope.meetups.push({ name: $scope.meetupName }); 
		// $scope.meetupName = ""; //set to nothing we finish adding

		// change above two lines to following to call the RESTful service & save:
		var meetup = new Meetup();
		meetup.name = $scope.meetupName; // create new attribute and assign
		meetup.$save(function (result) { // result is the JSON send back by server-side controller
			$scope.meetups.push(result);
			$scope.meetupName = ""; //clear out when we finish adding
		});
	};

}]); 
// then the controller will have access to ngRescource, the [] defines dependencies
// angular will inject '$scope','$recource' to the above function as parameters
// then we can put the function below to above to avoid it just floating there

// function meetupsController($scope) {	
// 	//$scope.meetupsCount = 10;	
// 	 //the meetupsCount is from the meetupsController, 
// 	 //from index.html angular will lookfor the meetupsCount 
// 	 //from the meetupsController
// 	 //we can remove the hard coded meetupsCount and use code meetups.length in html! 
	

// 	$scope.meetups =[
// 		{ name: "MEAN HK Developers" },
// 		{ name: "Some other meetups"}
// 	];

// 	$scope.createMeetup = function() { // we already have meetupName
// 		$scope.meetups.push({ name: $scope.meetupName }); 
// 		$scope.meetupName = ""; //set to nothing we finish adding
// 	};
// }