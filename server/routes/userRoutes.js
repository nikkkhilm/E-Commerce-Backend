const express = require('express');
const router=express.Router()
const {registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updateUserPassword, updateUserProfile, getAllUsers, getUser, updateUserProfileadmin, deleteUser} =require('../controllers/usercontroller');

const {isAuthenticated,authoriseRoles} = require('../middleware/auth');

router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/logout',logout);
router.post('/password/forgot',forgotPassword);
router.put('/password/reset/:token',resetPassword);
router.put('/password/update',isAuthenticated,updateUserPassword);
// this get user detail is for the user to see his data
router.get('/me',isAuthenticated,getUserDetails);
router.put('/me/update',isAuthenticated,updateUserProfile);


// g
router.get('/admin/users',isAuthenticated,authoriseRoles('admin'),getAllUsers);
router.get('/admin/user/:id',isAuthenticated,authoriseRoles('admin'),getUser);
router.put('/admin/user/:id',isAuthenticated,authoriseRoles('admin'),updateUserProfileadmin);
router.delete('/admin/user/:id',isAuthenticated,authoriseRoles('admin'),deleteUser);




module.exports = router
