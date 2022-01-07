require('dotenv').config()
const express = require('express')
const server = express()
const mongoose = require('mongoose')
server.use(express.static('public'))
server.use(express.urlencoded())

//mongoose.connect('mongdb://localhost:27017/db')
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection

db.on('open', (err)=>{
    if(err)throw err
    console.log('Database connected');
})
const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String
})
const Users = mongoose.model('usersModel', userSchema, 'users')

server.get('/register', (req,res)=>{
    res.sendFile(__dirname + '/public' + '/register.html')
})
server.post('/register', (req, res)=>{
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    const data = new Users({
        name: name,
        email: email,
        password: password
    })
    data.save((err)=>{
        if(err)throw err
        console.log('Saved to database');
    })
})
server.post('/login', (req, res)=>{
    const userEmail = req.body.login_email
    const userPassword = req.body.login_password
    async function auth() {
        const match = await Users.findOne({email:userEmail, password:userPassword})
        if(match){
            res.redirect('/home')
        }else {
            res.send('Login Failed')
        }
    }
    auth()
})
server.get('/login', (req,res)=>{
    res.sendFile(__dirname + '/public' + '/login.html')
})
server.get('/home', (req,res)=>{
    res.sendFile(__dirname + '/public' + '/home.html')
})


server.listen(process.env.PORT)