const express = require('express');
const connectDB = require('./config/db');
const user = require('./routes/UserRouter');
const todo = require('./routes/TodoRouter');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/user', user);
app.use('/todo', todo);

app.get('/' , (req,res)=>{
    res.send('Hello world');
});






app.listen(PORT, async ()=>{
    try {
        await connectDB();
        console.log(`server is running on PORT ${PORT}`);
    } catch (error) {
        console.log('Error starting server' , error.message)
    }
})