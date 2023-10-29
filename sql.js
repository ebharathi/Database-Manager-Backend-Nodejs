const { query } = require('express');
const {Pool}=require('pg')

const pool=new Pool(
        {
        host:'127.0.0.1',
        user:'postgres',
        database:'Database_Manager',
        password:'elaya55555',
        port:5432
    }
)

const signup=async(name,email,pass)=>{
    const client=await pool.connect();
    console.log("CONNECTED") 
    try {
          const result=await client.query('INSERT INTO users(name,email,password) VALUES($1,$2,$3) RETURNING id',[name,email,pass])
          return {
            error:false,
            userId:result.rows[0].id
          }
     } catch (error) {
          return {
            error:true,
            message:error.message
          }
     }
     finally{
        await client.release();
        console.log("DISCONNECTED");
     }
}
const login=async(email,pass)=>{
    const client=await pool.connect();
    console.log("CONNECTED")
    try {
        const result=await client.query('SELECT * FROM users WHERE email=$1 AND password=$2',[email,pass])
        return {
            error:false,
            userId:result.rows[0].id
        }
    } catch (error) {
         return {
            error:true,
            message:error.message
         } 
    }
    finally{
      await client.release();
      console.log("DISCONNECTED")
    }
}
const createTable=async(creator,name,cols)=>{
    const client=await pool.connect();
    try {
        let userText=`user_id INT REFERENCES users(id) DEFAULT ${creator}`
        let colsText=''
        cols.map((s,index)=>{
           if(index!=cols.length-1) 
            colsText+= `${s} VARCHAR(100),`
           else
            colsText+=`${s} VARCHAR(256)`
        })
        let text=`CREATE TABLE ${name}(${userText},${colsText})`
        console.log(text)
        const result=await client.query(text)
        return {
            error:false,
            message:`${name} table created`
        }
    } catch (error) {
         console.log("Error in creating table");
         console.log(error);
         return {
            error:true,
            message:error.message
         }
    }finally{

    }
}
module.exports={signup,login,createTable}