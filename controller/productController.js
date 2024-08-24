import productModel from "../models/productModel.js"
import { uploadProductPermission } from "../Helpers/permission.js"

export const uploadProduct = async (req, res) => {
    try{
        const sessionUserId = req.userId

        if(!uploadProductPermission(sessionUserId)){
            throw new Error("Permission denied")
        }
    
        const uploadProduct = new productModel(req.body)
        const saveProduct = await uploadProduct.save()

        res.status(201).json({
            message : "Product upload successfully",
            error : false,
            success : true,
            data : saveProduct
        })
    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}

export const getProduct = async(req,res)=>{
    try{
        const allProduct = await productModel.find().sort({ createdAt : -1 })

        res.json({
            message : "All Product",
            success : true,
            error : false,
            data : allProduct
        })

    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }

}

export const updateProduct = async(req,res)=>{
    try{
        if(!uploadProductPermission(req.userId)){
            throw new Error("Permission denied")
        }

        const { _id, ...resBody} = req.body

        const updateProduct = await productModel.findByIdAndUpdate(_id,resBody)
        
        res.json({
            message : "Product update successfully",
            data : updateProduct,
            success : true,
            error : false
        })
    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }

}


export const getCategoryProductOne = async(req,res)=>{
    try{
        const productCategory = await productModel.distinct("category")

        console.log("category",productCategory)

        //array to store one product from each category
        const productByCategory = []

        for(const category of productCategory){
            const product = await productModel.findOne({category })

            if(product){
                productByCategory.push(product)
            }
        }


        res.json({
            message : "category product",
            data : productByCategory,
            success : true,
            error : false
        })
    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }

}

export const getCategoryWiseProduct = async(req,res)=>{
    try{
        const { category } = req?.body || req?.query
        const product = await productModel.find({ category })

        res.json({
            data : product,
            message : "Product",
            success : true,
            error : false
        })
    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }

}

export const getProductDetails = async(req,res)=>{
    try{
        const { productId } = req.body

        const product = await productModel.findById(productId)

        res.json({
            data : product,
            message : "Ok",
            success : true,
            error : false
        })
    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }

}

export const searchProduct = async(req,res)=>{
    try{
        const query = req.query.q 

        const regex = new RegExp(query,'i','g')

        const product = await productModel.find({
            "$or" : [
                {
                    productName : regex
                },
                {
                    category : regex
                }
            ]
        })


        res.json({
            data  : product ,
            message : "Search Product list",
            error : false,
            success : true
        })
    }catch(err){
        res.json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}

export const filterProductController = async(req,res)=>{
    try{
           const categoryList = req?.body?.category || []
   
           const product = await productModel.find({
               category :  {
                   "$in" : categoryList
               }
           })
   
           res.json({
               data : product,
               message : "product",
               error : false,
               success : true
           })
    }catch(err){
       res.json({
           message : err.message || err,
           error : true,
           success : false
       })
    }
   }