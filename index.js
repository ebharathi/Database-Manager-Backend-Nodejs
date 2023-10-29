const express=require('express')
const cors=require("cors")

//importing router
const {Router}=require('./Router/api')
const app=express()
app.use(cors())
app.use(express.json())


//using router
app.use('/',Router)

app.listen(9000,()=>{
    console.log("Database server runnin gon port 9000")
})