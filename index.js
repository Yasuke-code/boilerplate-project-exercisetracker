const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config();
const mongoose=require('mongoose');




mongoose.connect(process.env.MONGO_URI, ()=>{
  
}).then(()=> console.log("connected to db"))
.catch((err)=>{console.error(err);})



app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const userNames=[]
const ids=[]

app.post("/api/users",(req, res)=>{
const userName=req.body.username
const isHere=userNames.indexOf(userName)

  if(isHere < 0 ){

      userNames.push(userName)
      ids.push(userNames.length)

      return res.json({
        userName : userName,
        id:ids[ids.length-1]
    })
  }
    return res.json({
      userName : userName,
      id : ids[isHere]
  })
})


app.post("/api/exe")
 




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
