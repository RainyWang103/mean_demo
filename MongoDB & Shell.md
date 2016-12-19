# MongoDB & Mongo Shell

## Key Points
1. Using documents, syntax BSON (similar to JSON), both key&value have quotation marks surrounding
2. NoSQL (non-relational), cannot use `Join` to link tables, but can use <b>references</b> to link various documents
3. To start, check official website to install; then run `mongod` & `mongo` in differnt sessions of console
4. [MongoDB GUI, key fetaures & run on AWS](https://www.youtube.com/watch?v=DwdSRt9gfrU), [MongoDB with EC2](https://docs.mongodb.com/ecosystem/platforms/amazon-ec2/), [MongoDB EC2 Deployment](https://docs.mongodb.com/ecosystem/platforms/amazon-ec2/#deployment-notes)

## MongoDB v.s. Traditional SQL
* Quick & easy to iterate on schema
* Scalable & better performance
* OO, similar to JS code
* Accomodates large volume of rapidly changing structured, semi-structures & unstructured data (<b>we can update the schema when need a change!</b>)
* More on [SQL vs NoSQL](http://www.mongodb.com/nosql-explained), [Good & Bad of MongoDB](https://www.youtube.com/watch?v=hWxnRi_WXtg)

Key advantage of MongoDB
> scales horizontally (sharding), schemaless, use of JSON, NoSQL(good & bad), performant

Key disadvantages of MongoDB
> Can't SQL JOINS, data design needs well thought since it's not relational,  no good for ACID(Atomicity, Consistency, Isolation, Durability) transactions (can have a messed up database!), reported to have lost info (need to backup often!)
 

## Documents v.s. Collections
### Documents
A record in a MongoDB collection & <b>the basic unit of data</b>. Looks like a JSON object but exist as BSON (key-value pairs seperated by comma)
### Collection
A grouping of MongoDB documents. Typically, all documents in a collection have a <b>similar or related purpose</b> (looks like multiple JSON objects) 

## Useful commands in MongoDB shell

### DB, collection & document
`show dbs`: show databases created

`use`: select db to use or create a new one

`show collections`: show collections created within current selected database. created within the shell or by schema (representation of the collection)

`db.things.find()`: display all the documents in collection things of current db; 

`db.things.find().pretty()`: display the documents in a prettier format

<b>Note: </b>

<b>'_id'</b>: this field is generated automatically every time when a new document is created. The fields are called <b>objects</b> (written in JSON then converted to BSON).

<b>db</b>: default notation refer to current db. All operations have to be done within a particulat db scope

### Add, Modify, Find
Full guides:
 
[Work with MongoDB shell](https://docs.mongodb.com/manual/mongo/#working-with-the-mongo-shell)

[Mongo Shell Methods] (https://docs.mongodb.com/manual/reference/method/)

Here we only introduce most common commands

``` java
show dbs	
local  0.000GB
> use example
switched to db example
> db.createCollection("cars")  // here we create the collection "cars" (and the db "example" if the db doesn't exist before)
{ "ok" : 1 }
> show collections
cars
> show dbs
example  0.000GB
local    0.000GB
```
#### Inserting documents

1. ";" at the end is optinal
2. use "" or '' is also optional
3. use "" around the key is also optinal

Because: everything we submit is in form of JSON, then converted to BSON in MongoDB

``` java
> db.cars.insert({
... name: 'honda',
... make: 'accord',
... year: '2010'
... })
WriteResult({ "nInserted" : 1 })
> db.cars.find().pretty()
{
	"_id" : ObjectId("58369e22fa811ede7c00ab3a"),
	"name" : "honda",
	"make" : "accord",
	"year" : "2010"
}
```
#### Updating documents
* update value

```java
> db.cars.update({
... 'name': 'honda'	// specify which document to search for
... },
... {$set:{
... name : 'ford'	// update a particulat field
... }
})
WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })
> db.cars.find().pretty()
{
	"_id" : ObjectId("58369e22fa811ede7c00ab3a"),
	"name" : "ford",
	"make" : "accord",
	"year" : "2010"
}
```
* add new key value pair

``` java
db.cars.update({
... 'name': 'ford'
... },
... {$set:{
... transmission: 'automatic'
... }},
... {$upsert: true}	// set to true: means we are adding
... )
WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })
> db.cars.find().pretty()
{
	"_id" : ObjectId("58369e22fa811ede7c00ab3a"),
	"name" : "ford",
	"make" : "accord",
	"year" : "2010",
	"transmission" : "automatic"
}
```

* remove documents

`db.cars.remove({})`: remove all documents from the collection

to remove a particular document:

```java
> db.cars.remove({name:'ford'})
WriteResult({ "nRemoved" : 1 })
```

### JavaScript
> Mongo shell is also a JS interpreter

```javascript
> for(var i=0; i<10; i++){db.things.insert({"x": i})}
WriteResult({ "nInserted" : 1 })
> db.things.find().pretty()
{ "_id" : ObjectId("5836a324fa811ede7c00ab3b"), "x" : 0 }
{ "_id" : ObjectId("5836a324fa811ede7c00ab3c"), "x" : 1 }
{ "_id" : ObjectId("5836a324fa811ede7c00ab3d"), "x" : 2 }
{ "_id" : ObjectId("5836a324fa811ede7c00ab3e"), "x" : 3 }
{ "_id" : ObjectId("5836a324fa811ede7c00ab3f"), "x" : 4 }
{ "_id" : ObjectId("5836a324fa811ede7c00ab40"), "x" : 5 }
{ "_id" : ObjectId("5836a324fa811ede7c00ab41"), "x" : 6 }
{ "_id" : ObjectId("5836a324fa811ede7c00ab42"), "x" : 7 }
{ "_id" : ObjectId("5836a324fa811ede7c00ab43"), "x" : 8 }
{ "_id" : ObjectId("5836a324fa811ede7c00ab44"), "x" : 9 }
```

## Data Types

schema = collection, schema is prepresentation, model, code of our data stored in the collection

We can store 4 types of data
> String, number, date, array, boolean, ObjectId

ObjectId can refer to other collection (schema)

Other data types
> Buffer: for Video Images Audio

> Mixed: combines different types

## Query Data
> #### Overview
> find(), passing parameters to retrieve data
> 
> sort() the items we got and limit() the results 
> 
> Other Reference: [Query document](https://docs.mongodb.com/manual/tutorial/query-documents/), [Delete Document](https://docs.mongodb.com/manual/tutorial/remove-documents/)

Data we use:

```java
> db.createCollection("students")

// query demonstration
db.students.insert({
	name: 'Joe',
	undergrad: true,
	units: 9,
	classes: ['geography','math','journalism']
})

db.students.insert({
	name: 'Jane',
	undergrad: false,
	units: 12,
	classes: ['geography','science','journalism','history']
})

db.students.insert({
	name: 'Kevin',
	undergrad: true,
	units: 3,
	classes: ['geography']
})

db.students.insert({
	name: 'Rachel',
	undergrad: false,
	units: 6,
	classes: ['geography','history']
})
```
#### find()
`db.students.find({})`: show all documents

`db.students.find({name:'Rachel'})`: find specific document, to make it prettier, chain with `.pretty()`

`db.students.find({units: {$gt:6}})`: <b>filter</b> by units > 6 (`$lt` for < )

`db.students.find({classes: {$in:['history']}})`: search in the array, students enrolled in history, if we use `{classes: {$in:['history','math']}}`, it means enrolled in history <b>OR</b> math

#### sort() & limit()
Sort with 1 & -1

> sorting numerically

``` java
db.students.find({classes: {$in:['history']}}).sort({units: 1}) //ascending
db.students.find({classes: {$in:['history']}}).sort({units: -1}) //descending
```
> sorting alphabetically

``` java
db.students.find({}).sort({name: 1}) //a->z
db.students.find({}).sort({name: -1}) //z->a
```

Limit the results we get back

> give only the first 2 results returned

``` java
db.students.find({}).sort({name: 1}).limit(2)
```