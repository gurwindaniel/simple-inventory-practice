const express=require('express')
const session = require('express-session');
const app=express()
const port =process.env.PORT || 3000
const {Pool}=require('pg')
const fs=require('fs')
require('dotenv').config()

const bodyparser=require('body-parser')
const bcryptjs=require('bcryptjs')
const passport=require('passport')
const LocalStrategy=require('passport-local').Strategy;
const flash=require('connect-flash')
const obj=require('./middleware/auth');
const { count } = require('console');


app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(flash())

  async function mystrategy(email,password,done){
    const client =await pool.connect()
    try{
        await client.query('select * from users where email=$1',[email] , 
          
        // query function start
       async function(err,res){
            if(err){
                  return done(err)
            }
            if(res.rows[0]==null){
                console.log("incorrect user name")
                return done(null,false,{message:"Incorrect User Name"})
           }
        await bcryptjs.compare(password,res.rows[0].password,
            // error comparing 
            function(err,ismatch){
              if(err){
                  throw err
              }
               else if(ismatch){
                   console.log(ismatch)
                   console.log(res.rows)
                    return done(null,res.rows[0])
                }else{
                    return done(null, false, {message:'Incorrect Password'})
                }               
            }//error comparing function end           
            )
        }) }catch(e){console.log(e)}finally{client.release()}
}

passport.use('local',new LocalStrategy({usernameField:'email',passwordField:'password'},mystrategy))





  //Serialize user
passport.serializeUser((user,done)=>{done(null,user.user_id)

})

//deserialize user
passport.deserializeUser(async(user_id,done)=>{
const client=await pool.connect();

try{
await client.query('select * from users where user_id=$1',[user_id],function(err,res){
 if(err){throw err}
 else{
  return done(err,res.rows[0])
 }
 
})
}catch(e){

}finally{
client.release();
}

})     //deserialize end


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

// const pool=new Pool({
//     user:process.env.user,
//     port:process.env.database_port,
//     password:process.env.password,
//     database:process.env.database,
//     host:process.env.host,
//     ssl:{
//      rejectUnauthorized:false,
//      ca:fs.readFileSync('./cert/ca.crt')
//     },
//  })


//Login page
app.get('/',async(req,res)=>{
    try{

       res.render('login',{message:req.flash('error')})
    }
    catch(e){
        console.log(`Error in getting a page ${e}`)
    }
})

app.get('/home',obj.auth,async(req,res)=>{
    res.render('home')
})
//customer page
app.get('/customer',obj.auth,async(req,res)=>{
    try{

       res.render('customer')
    }
    catch(e){
        console.log(`Error in getting a page ${e}`)
    }
})

app.get('/cust',obj.auth,async(req,res)=>{
    const client=await pool.connect()
    try{
        const value = await client.query('SELECT * from customer')
        // console.log(value.rows)
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

        await client.query('insert into customer (customer_name,age,email) values ($1,$2,$3)',
        [req.body.customer_name,req.body.age,req.body.email])
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
    // console.log(id.length)
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

//EDIT POST

app.post('/custpatch',async(req,res)=>{
    // console.log(req.body)
    const {customer_id,customer_name,age,email} =req.body
    const client = await pool.connect()
    try{
       const result= await client.query('select updatecust($1,$2,$3,$4)',[customer_id,customer_name,age,email])
    //    console.log(result.rows)
        res.send(req.body).status(200)
    }catch(e){
        console.error(`custpatch error ${e}`)
    }finally{
        client.release()
    }
})

//render user page

app.get('/user',obj.auth,async(req,res)=>{
    const client = await pool.connect()
    try{

        const role_name=await client.query('select role_name from roles')
        res.render('userform',{roles:role_name.rows})
      
       
    }catch(e){
        console.log(`users error ${e}`)
    }finally{
        client.release()
    }
})

//Loading users

app.get('/loaduser',obj.auth,async(req,res)=>{

    const client = await pool.connect()
    try{


       let users;
        // console.log(role_name.rows)
        // console.log(req.user.role_id)
        // res.render('userform',{roles:role_name.rows})
        console.log(req.user.role_id)
        if(req.user.role_id==1){

            users=await client.query('select * from users join roles on users.role_id=roles.role_id')
            res.send(users.rows).send(200)

        }
        else{

            users=await client.query('select users.user_id,users.name,users.email,users.password,users.user_date,roles.role_name from users join roles on users.role_id=roles.role_id where users.role_id in ($1)',[req.user.role_id])
            res.send(users.rows).send(200)

        }

    }catch(e){
        console.log(`users error ${e}`)
    }finally{
        client.release()
    }

})
//User Form Submission

app.post('/userpost',async(req,res)=>{
    const client=await pool.connect()

    const encrypted=await bcryptjs.hash(req.body.password,10)

    console.log(req.body)
    try{
        const email_valid=await client.query('select duplicate_email($1)',[req.body.email])
        console.log(email_valid.rows[0].duplicate_email)
        if(!email_valid.rows[0].duplicate_email)
        {
           const role_id= await client.query('select role_id from roles where role_name = $1',[req.body.role_name])
            await client.query('INSERT INTO users (name,email,role_id,password) values ($1,$2,$3,$4)',[req.body.name,req.body.email, role_id.rows[0].role_id,encrypted])
            console.log(typeof(role_id.rows[0].role_id))
            res.send(req.body).status(200)
        }
        else{
            console.log("invalid")
            res.send("Invalid").status(404)
        }
        
    }catch(e){
        console.log(`user post error ${e}`)
    }finally{
        client.release()
    }

})

//VENDOR PAGE CREATION

app.get('/vendor',async(req,res)=>{
    const client=await pool.connect()
    try{

        res.render('vendor')

    }catch(e){
           console.log(`vendor page render error ${e}`)
    }finally{
        client.release()
    }
})

var client_connect=async()=>{
   
    return await pool.connect()   
}
//Vendor Post Handling
app.post('/vendorpost',async(req,res)=>{

   const client=await client_connect()
   const {vendor_name,city,province,country,contact}=req.body

    try{
        await client.query('insert into vendor (vendor_name,city,province,country,contact) values ($1,$2,$3,$4,$5)',[vendor_name,city,province,country,contact])
        res.send(req.body).status(200)
    

    }catch(e){
        console.log(`vendor post error ${e}`)
    }finally{
        await client.release()
    }
})
app.post('/loginpost',passport.authenticate('local',{
    successRedirect:'/home',
    failureRedirect:'/',
    failureFlash:true
}));

 //logout
 app.get('/logout',(req,res)=>{
    req.logOut(function(err){
        console.log(err)
        
    })
    res.redirect('/')
})
app.listen(port,()=>{
    console.log(`listening to the port no ${port}`)
})