const { MongoClient, ObjectID } = require("mongodb");
const assert = require("assert");

const id = new ObjectID();
console.log("my custom id: ", id);

// Connection URL
const url = "mongodb://127.0.0.1:27017";

// Database Name
const dbName = "my-database";

// Use connect method to connect to the server
MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  //   insertDocument(db, function (err, result) {
  //     if (err) throw new Error("something went wrong !!");
  //     console.log(result.ops);
  //     client.close();
  //   });

  //   insertDocuments(db, function (err, result) {
  //     if (err) throw new Error("somehing went wrong");
  //     console.log(result.ops);
  //     client.close();
  //   });

//   updateDocument(db, function (err, result) {
//     if (err) throw new Error(err);
//     console.log("updated successfully :)");
//     client.close();
//   });

  findDocument(db, function (err, result) {
    if (err) throw new Error(err);
    console.log(result);
    client.close();
  });

  findDocuments(db).then( _ => {
      console.log(_);
  }).catch( error => console.log(error));

  //   insertDocuments(db, function (err, result) {
  //     if (err) throw new Error("somehing went wrong");
  //     console.log(result.ops);
  //     client.close();
  //   });
});

// inssert a single document
function insertDocument(db, callback) {
  const collection = db.collection("users");
  collection.insertOne({ name: "Abhishek Raj", age: 24 }, function (
    err,
    result
  ) {
    if (err) callback(err, undefined);
    else callback(undefined, result);
  });
}

// insert multiple documents
function insertDocuments(db, callback) {
  db.collection("users").insertMany(
    [
      { name: "Arushi", age: 23 },
      { name: "sam", age: 23 },
      { name: "Shail", age: 29 },
    ],
    (err, result) => {
      if (err) callback(err, undefined);
      else callback(undefined, result);
    }
  );
}

// update single document
function updateDocument(db, callback) {
  db.collection("users").updateOne(
    { _id: new ObjectID("5ef6360daa98a17a03cb6757") },
    { $set: { name: "Tony stark", age: 50 } },
    { upsert: true },
    (err, result) => {
      if (err) callback(err, undefined);
      else callback(undefined, result);
    }
  );
}

function findDocument(db, callback) {
    db.collection("users").findOne(
      { _id: new ObjectID("5ef6360daa98a17a03cb6757") },
      (err, result) => {
        if (err) callback(err, undefined);
        else callback(undefined, result);
      }
    );
  }

function findDocuments(db) {
    return db.collection('users').find({ name : 'Abhishek Raj'}).toArray() // this actually returns the data;
}

// update multiple documents
