const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config();
const mongoose = require('mongoose');
const type = require('mongoose/lib/schema/operators/type');





 mongoose.connect('mongodb+srv://matansdev:zn2u7D79tf3ABnCE@cluster0.0tn77wn.mongodb.net/?retryWrites=true&w=majority')

 const userSchema = mongoose.Schema(
  {
  username: {
    type: String, 
    unique: true,
   },
  },
  { versionKey : false }
 );
//  username: "fcc_test",
//   description: "test",
//   duration: 60,
//   date: "Mon Jan 01 1990",
//   _id: "5fb5853f734231456ccb3b05"
 const User = mongoose.model('User', userSchema)
 const exercisesSchem= mongoose.Schema({
  username: String,
  description: String,
  duration: Number,
  date: String,
  userid:String

 })
 const Exe=mongoose.model('Exe', exercisesSchem)

app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


app.get("/api/users", async (req, res)=>{
  const users = await User.find();
  res.send(users)
});

app.post("/api/users",async (req, res)=>{
  const username=req.body.username
  const foundUser= await User.findOne({username})
  
  if(foundUser){
    return res.json(foundUser)
  }
  const user = await User.create({
    username, 
    });
    
   res.json(user)
});
// app.get("/api/users/:_id/logs",async (req, res)=>{
//   const userId = req.params._id;
//   res.send(userId)
// })


app.post("/api/users/:_id/exercises",async (req, res)=>{

  let {description, duration, date} = req.body;
  const userId = req.body[":_id"]
  let foundUserId = await User.findById(userId);
  let foundUserName= foundUserId.username;
  console.log(foundUserName,foundUserId)
  


    if (!foundUserId) {
      res.json({error:"There is no user for this id"})
    }

    if (!date) {
      date = new Date();
    } else {
      date = new Date(date);
    } 

     await Exe.create({
      username: foundUserName,
      description,
      duration,
      date,
      userId,
    })
    
    res.send({
    username: foundUserName,
    description,
    duration,
    date: date.toDateString(),
    _id:userId,
    })

    })
    app.get("/api/users/:_id/logs",async (req, res)=>{
      res.json()
      
    })
    




    const listener = app.listen(process.env.PORT || 3000, () => {
      console.log('Your app is listening on port ' + listener.address().port)
    })
