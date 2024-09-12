const express = require('express');
const {createProduct,getallproducts,updateProduct,deleteProduct,getProductdetails, createProductReview, getReviews, deleteReview} = require('../controllers/Productcontroller');
const {isAuthenticated,authoriseRoles} = require('../middleware/auth');
const router = express.Router();

router.get('/products',getallproducts);

router.post('/product/new',isAuthenticated
    ,authoriseRoles("admin"),createProduct);

router.put('/product/:id',isAuthenticated,authoriseRoles("admin"),updateProduct);

router.delete('/product/:id',isAuthenticated,authoriseRoles("admin"),deleteProduct);

router.get('/product/:id',getProductdetails);

router.put('/review',isAuthenticated,createProductReview);

router.get('/reviews',getReviews);//no authentication required to see review

router.delete('/review/delete',isAuthenticated,deleteReview);






module.exports = router