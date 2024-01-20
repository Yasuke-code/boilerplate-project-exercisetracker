const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
require('dotenv').config();


app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to DB!");
  })
  .catch(err => {
    console.log("ERROR:", err.message);
  });
const LogSchema = new mongoose.Schema({
  description: String,
  duration: Number,
  date: String,
})
const UserSchema = new mongoose.Schema(
  {
    username: String,
    count: Number,
    log: [LogSchema]
  }
);

//  username: "fcc_test",
//   description: "test",
//   duration: 60,
//   date: "Mon Jan 01 1990",
//   _id: "5fb5853f734231456ccb3b05"
const User = mongoose.model('User', UserSchema)

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.get("/api/users", async (req, res) => {
  const usersList = await User.find(null, {
    username: 1,
    _id: 1,
  }).exec();
  res.json(usersList)
});

app.post("/api/users", async (req, res) => {
  const foundUser = await User.findOne({
    username: req.body.username
  }).exec();
  if (foundUser == null) {
    await User.create({
      username: req.body.username,
      count: 0,
    });
  }
  const user = await User.findOne(
    {
      username: req.body.username,
    },
    {
      username: 1,
      _id: 1,
    },
  ).exec();
  res.json(user)
});


app.post("/api/users/:_id/exercises", async (req, res) => {
  const doc = await User.findById(req.params._id).exec();
  let date = new Date();
  if (req.body.date !== "" && req.body.date !== undefined) {
    date = new Date(req.body.date);
  }
  doc.log.push({
    description: req.body.description,
    duration: req.body.duration,
    date: date.toDateString(),
  });
  doc.count = doc.count + 1;
  let result = {
    description: req.body.description,
    duration: req.body.duration,
    date: date.toDateString(),
  };
  await doc.save();
  let recoveredDoc = await User.findById(req.params._id)
    .select("-__v -log -count")
    .exec();
  let newResult = {
    _id: recoveredDoc._id,
    username: recoveredDoc.username,
    date: date.toDateString(),
    duration: parseInt(req.body.duration),
    description: req.body.description,
  };

  res.json(
    newResult
  );

})
app.get("/api/users/:_id/logs", async (req, res) => {

  const doc = await User.findById(req.params._id)
    .select("-__v -log._id")
    .exec();

  let finalReturnedObject = {
    _id: req.params._id,
    username: doc.username,
    count: doc.count,
    log: doc.log.map(obj => ({
      description: obj.description,
      duration: parseInt(obj.duration),
      date: obj.date,
    })),
  };

  if (req.query.from !== undefined || req.query.from !== undefined) {
    let fromDate = new Date(0).getTime();
    let toDate = new Date().getTime();

    if (req.query.from !== undefined) fromDate = new Date(req.query.from).getTime();
    if (req.query.to !== undefined) toDate = new Date(req.query.to).getTime();

    finalReturnedObject.log = finalReturnedObject.log.filter(obj => {
      let currDate = new Date(obj.date).getTime();
      return currDate >= fromDate && currDate <= toDate;
    });
  }

  if (req.query.limit !== undefined && parseInt(req.query.limit) > 0) {
    finalReturnedObject.log.splice(0, Object.keys(finalReturnedObject.log).length - parseInt(req.query.limit));
  }

  res.json(finalReturnedObject);
})





// const listener = app.listen(process.env.PORT || 3000, () => {
//   console.log('Your app is listening on port ' + listener.address().port)
// })
