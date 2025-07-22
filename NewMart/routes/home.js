//create router object
const express = require('express');
const router = express.Router();


const Product = require('../models/products'); //import product model

//create routes
router.get('/', async (req, res) => {
    // if (req.session.user) { //check if user session exists - if user is logged in
        products= await Product.find({}); //find all products

        ctx={
            title: 'NewMart',
            message: 'Good to have you here!',
            notifs: true,
            products: products, //pass products to the view
            user: req.session.user //pass user session to the view
        }
        res.render('home/home.ejs',ctx); //render home.ejs template with context
    // }else{
    //     res.redirect('/auth'); //if no user session, redirect to auth page
    // }
});

router.get('/about', (req, res) => {
    ctx={
        title: 'About NewMart',
    } 

    res.render('home/about.ejs',ctx); //render about.ejs template
});

router.get('/search', async (req, res) => {
    const keyword = req.query.keyword; 

    let products = [];

    if (keyword) {
        //find products that match the keyword
        products = await Product.find({
            $or: [
                { name: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } }
            ]
        });
    }else{
        //if no keyword, return all products
        products = await Product.find({});
    }


    ctx = {
        title: 'Search Results',
        message: `Results for "${keyword}"`,
        products: products //pass products to the view
    };

    console.log("Search Results: ", products);

    res.render('home/searchResults.ejs', ctx); //render home.ejs template with context

    
});


//export router object
module.exports = router;