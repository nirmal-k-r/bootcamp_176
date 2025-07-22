//create router object
const express = require('express');
const router = express.Router();


//import product model
const Product = require('../models/products'); //import product model

//create routes
router.get('/', async  (req, res) => {
    if (req.session.user){
        //check if user is admin
        if (req.session.user.perms == 'admin') {
            products= await Product.find({}); //find all products

            //render admin page
            res.render('admin/dashboard.ejs', {
                title: 'Newpart - Admin',
                message: 'Welcome to the Admin Page',
                products: products, //pass products to the view,
                user: req.session.user //pass user session to the view
            });  
        } else {
            //if user is not admin, redirect to home page
            res.redirect('/');
        }

    }else{
        res.redirect('/auth'); //if no user session, redirect to auth page
    }
   


});

router.post('/create-product', (req, res) => {
   //get all form data
    // console.log(req.body);

    productData={
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        stock: req.body.stock,
        sale: req.body.sale === 'on' ? true : false, //convert to boolean
        image: req.body.image //base64 string
    };

    //console.log(productData);

    //create new product instance
    const newProduct = new Product(productData);
    //save product to database
    newProduct.save()
        .then(() => {
            res.redirect('/admin');
        })
        .catch((err) => {
            console.error('Error saving product:', err);
            // res.status(500).send('Internal Server Error');
            res.redirect('/admin');
        });


});


router.get('/edit-product/:id', async (req, res) => {
    id= req.params.id; //get product id from url
    product= await Product.findOne({_id: id}); //find all products
    // console.log(product);

    //render edit page
    res.render('admin/editProduct.ejs', {
        title: 'Newpart - Admin',
        message: 'Edit product',
        product: product //pass product to the view
    });   

});

router.post('/edit-product/:id', async (req, res) => {
    id= req.params.id; //get product id from url
    
    productData={
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        stock: req.body.stock,
        sale: req.body.sale === 'on' ? true : false, //convert to boolean
        image: req.body.image //base64 string
    };

    //console.log(productData);

    //find and update product
    await Product.findByIdAndUpdate(id, productData);

    res.redirect('/admin'); //redirect to admin page

});



router.get('/delete-product/:id', async (req, res) => {
    id= req.params.id; //get product id from url
    await Product.findByIdAndDelete(id) //delete product by id
        .then(() => {
            res.redirect('/admin'); //redirect to admin page
        })
        .catch((err) => {
            console.error('Error deleting product:', err);
            // res.status(500).send('Internal Server Error');
            res.redirect('/admin');
        });
   
});


//export router object
module.exports = router;