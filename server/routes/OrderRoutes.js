const express=require('express')
const {createOrder,myOrders} = require('../controllers/OrderController')
const router=express.Router()
const {isAuthenticated,authoriseRoles} = require('../middleware/auth');

 router.post('/order/new',isAuthenticated,createOrder);

 router.get('/orders/me',isAuthenticated,myOrders);

 router.get('/order/:id',isAuthenticated,authoriseRoles("admin"),getSingleOrder);


module.exports = router

