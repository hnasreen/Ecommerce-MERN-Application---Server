import express from 'express';
import {registerController,loginController, userDetailsController, userLogoutController} from "../controller/authController.js";
import { authToken } from '../middleware/authToken.js';
import { allUsers, updateUsers } from '../controller/userController.js';
import {filterProductController, getCategoryProductOne, getCategoryWiseProduct, getProduct, getProductDetails, searchProduct, updateProduct, uploadProduct } from '../controller/productController.js';
import { addToCartController, addToCartViewProduct, countAddToCartProduct, deleteAddToCartProduct, updateAddToCartProduct } from '../controller/addToCartController.js';

 const router = express.Router();

 //user
 
 router.post('/register', registerController);
 router.post('/login', loginController);
 router.get('/user-details' ,authToken,userDetailsController);
 router.get('/logout',userLogoutController);

//  admin panel

 router.get("/all-users",authToken,allUsers)
 router.post("/update-user",authToken,updateUsers)


 //product

 router.post("/upload-product",authToken,uploadProduct)
 router.get('/get-product',getProduct)
 router.post('/update-product',authToken,updateProduct)
 router.get('/get-categoryProduct',getCategoryProductOne)
 router.post('/category-product',getCategoryWiseProduct)
 router.post('/product-details',getProductDetails)
 router.get("/search",searchProduct)
 router.post("/filter-product",filterProductController)

 //user add to cart

router.post("/addtocart",authToken,addToCartController)
router.get("/countAddToCartProduct",authToken,countAddToCartProduct)
router.get("/view-card-product",authToken,addToCartViewProduct)
router.post("/update-cart-product",authToken,updateAddToCartProduct)
router.post("/delete-cart-product",authToken,deleteAddToCartProduct)

 export default router;