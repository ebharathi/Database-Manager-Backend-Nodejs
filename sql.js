const { query } = require('express');
const {Pool}=require('pg')

// const pool=new Pool(
//         {
//         host:'127.0.0.1',
//         user:'postgres',
//         database:'Database_Manager',
//         password:'elaya55555',
//         port:5432
//     }
// )
const pool=new Pool(
    {
      connectionString:process.env.DB_URL
    //   connectionString:'postgresql://postgres:5LE9WXSNEElkJLkyNonT@containers-us-west-37.railway.app:7969/railway'
    }
  )

const signup=async(name,email,pass)=>{
    const client=await pool.connect();
    console.log("CONNECTED") 
    try {
          const result=await client.query('INSERT INTO db_users(name,email,password) VALUES($1,$2,$3) RETURNING id',[name,email,pass])
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
        const result=await client.query('SELECT * FROM db_users WHERE email=$1 AND password=$2',[email,pass])
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
        let userText=`user_id INT REFERENCES db_users(id) DEFAULT ${creator}`
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
        const updateTableQuery=await client.query('UPDATE db_users SET created_tables=ARRAY_APPEND(created_tables,$1) WHERE id=$2',[name,creator])
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
const dropTable=async(userId,name)=>{
    console.log("id-->",userId,"name-->",name)
    const client=await pool.connect();
    console.log("CONNECTED")
    try {
        let text=`DROP TABLE ${name}`
        await client.query(text)
        await client.query('UPDATE db_users SET created_tables=ARRAY_REMOVE(created_tables,$1) WHERE id=$2',[name,userId])
        return {
            error:false
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
const getUserData=async(id)=>{
    const client=await pool.connect();
    console.log("CONNECTED")
    try {
        const result=await client.query('SELECT * FROM db_users WHERE id=$1',[id])
        return {
            error:false,
            data:result.rows[0]
        }
    } catch (error) {
         console.log('QUERY ER IN USER DATA')
         return {
            error:true,
            message:error.message
         }
    }
    finally{
        await client.release()
        console.log("DISCONNECTED")
    }
}
const getTableData=async(name)=>{
    const client=await pool.connect();
    console.log("[+]CONNECTED");
    try {
        let text=`SELECT * FROM ${name}`
        const result=await client.query(text);
        return {
            error:false,
            data:result
        }
    } catch (error) {
        console.log("err in getting tbale")
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
const addRow=async(text)=>{
    const client=await pool.connect()
    console.log("CONNECTED");
    console.log("qq-->",text)
    try {
        await client.query(text)
        return {
            error:false
        }
    } catch (error) {
        console.log("ERROR in row insertion")
        console.log(error.message)
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
const deleteRow=async(text)=>{
    const client=await pool.connect();
    console.log("CONNECTED")
    try {
        await client.query(text)
        return {
            error:false
        }
    } catch (error) {
        return {
            error:true,
            message:error.message
        }
    }
    finally{
        client.release()
        console.log("DISCONNECTED")
    }
}
module.exports={signup,login,createTable,dropTable,getUserData,getTableData,addRow,deleteRow}