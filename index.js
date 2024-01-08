const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config();
const mongoose = require('mongoose');
const type = require('mongoose/lib/schema/operators/type');




// mongoose.connect('mongodb+srv://matansdev:zn2u7D79tf3ABnCE@cluster0.0tn77wn.mongodb.net/?retryWrites=true&w=majority', ()=>{
//   console.log("connected to db")
// })
 mongoose.connect('mongodb+srv://matansdev:zn2u7D79tf3ABnCE@cluster0.0tn77wn.mongodb.net/?retryWrites=true&w=majority')

 mongoose.Schema({
  username: {
    type: String, 
    unique: true,
  },
 });

app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});



app.post("/api/users",async (req, res)=>{
const username=req.body.username
  const user = await User.create({
    username, 

  });
  res.json({
    user
  })
});


app.post("/api/exe")
 




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
