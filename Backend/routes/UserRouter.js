const express = require('express');
const UserModel = require('../model/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = express.Router();

user.get("/" , (req,res)=>{
    res.send('User Route is working')
});

user.post('/register' , async (req,res)=>{
    try {
        const {name , email , password} = req.body;
        const user = await UserModel.findOne({email});
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUND))
        if(user){
            return res.status(400).send({message:'User already exists'});
        }
            const newUser = new UserModel({name , email , password:hashedPassword});
            const token = jwt.sign({userId : newUser._id},process.env.JWT_SECRET , {expiresIn :'2h'} )
            res.cookie('token' , token);
            await newUser.save();
            res.status(201).send({message:'User registered successfully',newUser,token});
        
    } catch (error) {
        console.error('Error registering user', error.message);
        res.status(500).send({message:'Internel server error'});
    }
});

user.post('/login' , async (req,res)=>{
    try {
        const {email , password} = req.body;
        const user = await UserModel.findOne({email});
        if(!user){
            return res.status(400).send({message:'User not found'});
        }
        const isValidPassword = await bcrypt.compare(password , user.password);
        if(!isValidPassword){
            return res.status(400).send({message:'Invalid Password'});
        }
        const token = jwt.sign({userId : user._id}, process.env.JWT_SECRET , {expiresIn :'2h'});
        res.cookie('token' , token);
        res.status(200).send({message:'Login succesfull',user,token})
        
    } catch (error) {
        console.error('Error Logging in user', error.message)
        res.status(500).send({message:'Internel server error'});
    }
});


module.exports = user;