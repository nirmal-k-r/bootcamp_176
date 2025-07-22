//create router object
const express = require('express');
const router = express.Router();
const Product = require('../models/products'); //import product model        
const Purchases = require('../models/purchases'); //import purchases model

router.get('/add', async  (req, res) => {
    if (!req.session.cart){
        req.session.cart = {};
    }

    id=req.query.id; //get product id from query params

    if (req.query.qty){
        qty=parseInt(req.query.qty); //get quantity from query params
    }else{
        qty=1; //default quantity is 1
    }

    if (id in req.session.cart){
        req.session.cart[id] += parseInt(qty); //increment quantity if product already in cart
    }else{
        req.session.cart[id] = parseInt(qty); //add product to cart with quantity
    }

    res.redirect('/cart'); //redirect to cart page
});

router.get('', async  (req, res) => {
        if (!req.session.cart){
            req.session.cart = {};
        }
        products,total= await getCartProducts(req.session.cart);
        
        //if cart exists and has products
        res.render('cart/cart.ejs', {
            title: 'NewMart - Cart',
            message: 'Your Shopping Cart',
            cart: products, //pass cart to the view
            total: total, //pass total price to the view
            user: req.session.user //pass user session to the view
        });
   
});

async function getCartProducts(cart) {
    products={};
    total=0; //initialize total price

    for (productid in cart) {
        //get product from database
        product_details= await Product.findById(productid); 
        if (product_details) {
            products[productid] = {
                qty: cart[productid],
                name: product_details.name,
                price: product_details.price,
                image: product_details.image
            };
            total += (product_details.price * cart[productid]); //calculate total price
        };    
    };
    return products,total;
}

router.post('/update/', async  (req, res) => {
    id=req.body.id; //get product id from form data
    qty=parseInt(req.body.qty); //get quantity from form data
    req.session.cart[id] = qty; //update quantity in cart
    res.redirect('/cart'); //redirect to cart page
   
});

router.get('/remove/:id', async  (req, res) => {
    id=req.params.id; //get product id from url params
    if (id in req.session.cart) {
        delete req.session.cart[id]; //remove product from cart
    }
    res.redirect('/cart'); //redirect to cart page
});

router.get('/payment', async  (req, res) => {
    total,products= await getCartProducts(req.session.cart);
    res.render('cart/payment.ejs', {
        title: 'NewMart - Payment',
        user: req.session.user, //pass user session to the view
        cart: products, //pass cart to the view
        total: total //pass total price to the view
    });
});

router.get('/checkout', async  (req, res) => {
    if (!req.session.user) {
        res.redirect('/auth'); //if user is not logged in, redirect to auth page
    } else {

        total, products = await getCartProducts(req.session.cart);
        const purchase = new Purchases({
            user: req.session.user.email,
            items: Object.keys(req.session.cart).map(id => ({
                product: id,
                quantity: req.session.cart[id]
            })),
            total: total
        });
        
        await purchase.save(); //save purchase record to database
        req.session.cart = {}; //clear cart after checkout
        res.redirect('/'); //redirect to home page
    }
});

//export router object
module.exports = router;