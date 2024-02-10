const express=require('express')
const app=express()
const port =process.env.PORT || 3000
const {Pool}=require('pg')
require('dotenv').config()
const bodyparser=require('body-parser')

//EJS TEMPLATE
app.set('view engine','ejs')


//middle ware 
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())
app.use('/public',express.static('public'))

// const pool=new Pool({
//     user:'postgres',
//    host:'localhost',
//    database : 'inventory_2',
//    password:'Trogen@2023'
// })

//CLOUD CONNECTION STRING

const pool=new Pool({
    connectionString:process.env.CONNECTION_STRING
})



//Home page
app.get('/',async(req,res)=>{
    try{

       res.render('home')
    }
    catch(e){
        console.log(`Error in getting a page ${e}`)
    }
})

//customer page
app.get('/customer',async(req,res)=>{
    try{

       res.render('customer')
    }
    catch(e){
        console.log(`Error in getting a page ${e}`)
    }
})

app.get('/cust',async(req,res)=>{
    const client=await pool.connect()
    try{
        const value = await client.query('SELECT * from customer')
        console.log(value.rows)
        res.send(value.rows).status(200)
    }catch(e){

    }finally{
        client.release()
    }
})

app.post('/custpost',async(req,res)=>{

    const client=await pool.connect()
    const cust_data=req.body
    try{

        await client.query('insert into customer (customer_name,age,email) values ($1,$2,$3)',[req.body.customer_name,req.body.age,req.body.email])
    res.send(req.body)
    }catch(e){

    }finally{
        client.release()
    }
})

//delete route
app.delete('/custdelete:id',async(req,res)=>{
    const client=await pool.connect()
    // splitting the : to create an array
    const id =req.params.id.split(':')
    console.log(id.length)
   //if more than one value selected for deletion
    if(id.length>=2){
        // const arr=[]
       console.log(id[1].split(',')) 
       console.log(typeof(id[1].split(',')))
    //    for (i=1;i<id[1].split(',').length;i++){
    //     console.log(id[1].split(',')[i])
    //     arr.push(parseInt(id[1].split(',')[i]))
        
    //    }
    //    console.log(arr)   
       const delete_query= "delete from customer where customer_id = any ($1);"
        await client.query(delete_query,[id[1].split(',')])
    }
    else{
         const id =parseInt(req.params.id.split(':')[1])
          const delete_query= "delete from customer where customer_id=$1"
        await client.query(delete_query,[id])
    }
    try{

      
        res.send("deleted").status(200)

    }catch(e){
        console.log(`delete route ${e}`)
    }finally{
        client.release()
    }
})
app.listen(port,()=>{
    console.log(`listening to the port no ${port}`)
})