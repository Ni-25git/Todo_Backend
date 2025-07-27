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
    origin: 'https://realtimetodofrontend.vercel.app',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/user', user);
app.use('/todo', todo);

app.get('/' , (req,res)=>{
    res.send('Hello world');
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).send({ message: 'Internal server error' });
});

// 404 handler for undefined routes - using a function instead of wildcard
app.use((req, res) => {
    res.status(404).send({ message: 'Route not found' });
});






app.listen(PORT, async ()=>{
    try {
        await connectDB();
        console.log(`Server is running on PORT ${PORT}`);
    } catch (error) {
        console.error('Error starting server:', error.message);
        process.exit(1); // Exit the process if database connection fails
    }
})