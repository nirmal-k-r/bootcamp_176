//import libraries
const express = require('express');
const server = express(); //create server instance

// Middleware to log requests
function logger(req,res,next){
    //log the request method and URL
    console.log(`${req.method} request for '${req.url}'`);
    next();
};

//link public directory for static files
server.use(express.static('public')); 


server.use(logger); //use the logger middleware

//routes
//handle home route only
server.get('/', (req, res) => {
    res.send('Welcome to NewMart');
});

server.get('/about', (req, res) => {
    res.send('About us');
});

server.get('/contact', (req, res) => {
    res.send('Contact us');
});


//redirect
server.get('/google', (req, res) => {
    res.redirect('https://www.google.com');
});

// Serve static files from the 'views' directory -> bad practice
server.get('/example', (req, res) => {
    res.sendFile(__dirname + '/views/example_static.html');
});

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