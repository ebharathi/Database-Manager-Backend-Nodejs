const Router=require('express').Router();
const {signup,login,createTable,dropTable,getUserData}=require('../sql')


Router.post('/signup',async(req,res)=>{
    try {
        await signup(req.body.name,req.body.email,req.body.password)
        .then((resp)=>{
             if(resp.error==false)
               res.json({
               error:false,
               message:"New user created",
               userId:resp.userId
            })
            else
              res.json({
                    error:true,
                    message:resp.message
            })
        })
    } catch (error) {
        console.log("erro in signup");
        res.json({
            error:true,
            message:error.message
        })
    }
})
Router.post('/login',async(req,res)=>{
     try {
         await login(req.body.email,req.body.password)
           .then((resp)=>{
              if(resp.error==false)
              {
                   res.json({
                    error:false,
                    message:"Login successfull",
                    userId:resp.userId
                   })
              }
              else
              {
                res.json({
                    error:true,
                    message:resp.message
                })
              }
           })
     } catch (error) {
          console.log("ERR IN LOGIN")
          res.json({
            error:true,
            messsage:error.message
          })
     }
})
Router.post('/table/create',async(req,res)=>{
    try {
        await createTable(req.body.creator,req.body.tableName,req.body.cols)
        .then((resp)=>{
             if(resp.error==false)
              res.json({
                    error:false,
                    message:resp.message
                })
              else
              res.json({
                error:true,
                message:resp.message
            })
        })
    } catch (error) {
         console.log("Error")
         res.json({
            error:true,
            message:error.message
         })
    }
})
Router.get('/api/user/:id/table/remove/:name',async(req,res)=>{
    try {
          await dropTable(req.params.id,req.params.name)
          .then((resp)=>{
             if(resp.error==false)
              res.json({
                    error:false,
                    messgae:"Table deleted successfully!"
                })
             else
               res.json({
                error:true,
                message:resp.message
             })
          })
    } catch (error) {
         res.json({
            error:true,
            message:error.message
         })
    } 
})
Router.get('/user/details/:id',async(req,res)=>{
    try {
         await getUserData(req.params.id)
         .then((resp)=>{
             if(resp.error==false)
              res.json({
                error:false,
                data:resp.data
            })
            else
              res.json({
               error:true,
               message:resp.message
            })
         })
    } catch (error) {
         console.log("err")
         res.json({
            error:true,
            message:error.message
         })
    }
})
module.exports={Router}