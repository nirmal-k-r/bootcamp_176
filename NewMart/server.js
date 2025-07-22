//import libraries
const express = require('express');
session= require('express-session');
const server = express(); //create server instance
const db= require('./db'); //import db connection from db.js
//import body-parser to parse form data
const bodyParser = require('body-parser');

//import routers
const homeRouter = require('./routes/home'); //import home router
const adminRouter = require('./routes/admin'); //import administration router
const authRouter = require('./routes/auth'); //import authentication router
const cartRouter = require('./routes/cart'); //import cart router



// Middleware to log requests
function logger(req,res,next){
    //log the request method and URL
    console.log(`${req.method} request for '${req.url}'`);
    next();
};

//link public directory for static files
server.use(express.static('public')); 

//link views directory for ejs templates
server.set('views', './views'); //set views directory


server.use(logger); //use the logger middleware

//connect body-parser middleware to parse form data
server.use(bodyParser.urlencoded({ extended: true, limit: "100mb" })); //parse urlencoded data

//create session middleware
server.use(session({
    secret:"vgchkel567823b:5^&UYG^&",
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 *30 //30 day - in milliseconds
    } 
}));

//connect routers
server.use('', homeRouter); //use home router for root path
server.use('/admin', adminRouter); 
server.use('/auth', authRouter); //use auth router for /auth path
server.use('/cart', cartRouter); //use cart router for /cart path



//not found - capture all other routes -> Default 404 handler
server.use((req, res, next) => {
    res.send('Page not found');
});

//error handling middleware
server.use((err, req, res, next) => {
    console.error(err.stack);
    //res.status(500).send('Something went wrong!');
    res.send('Error occurred');
});

// Start the server
const port = 3000;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});