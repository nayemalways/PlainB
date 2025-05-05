
/*-----------------DEPENDENCIES------------*/
import CartModel from "../models/UsersModel/CartModel.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;


export const SaveProductToCartService = async (req) => {
    try {
        const userID = new ObjectId( req.headers.user_id);
        const reqBody = req.body;
        reqBody.userID = userID;

        /*------If product already exist------*/
        const alreadyExist = await CartModel.find({userID: userID , productID: reqBody.productID});
        if(alreadyExist.length != 0) {
            throw new Error("Already in the cart");
        }

        /*--------ADD PRODUCT TO CART--------*/
        await CartModel.create(reqBody);
        return {status: "Success", message: "Added to cart!"};
    }catch(e) {
        return {status: "Error", message:  e._message || e.toString()}
    }
}


export const UpdateProductOfCartService = async (req) => {
    try {
        const userID = req.headers.user_id;
        const CartID = req.params.CartID;
        const reqBody = req.body;

        /*----------------CART LIST PRUDUCT UPDATE-----------------*/
        await CartModel.updateOne({_id: CartID, userID}, {$set: reqBody});
        return {status: "Success", message: "Cart updated successful!"};


    }catch(e) {
        return {status: "Error", message: e._message || e.toString()};
    }
}


export const RemoveProductFromCartService = async (req) => {
    try {
        const userID = new ObjectId( req.headers.user_id);
        const productID = new ObjectId(req.body.productID);

        /*---REMOVE CART LIST PRODUCT----*/
        let res = await CartModel.deleteOne({productID, userID});
        if(res.deletedCount === 0) throw new Error("Failed to remove");
        return {status: "Success", message: "Removed success!", d: res}

    }catch(e) {
        return {status: "Error", message: e._message || e.toString()};
    }
}




export const SelectCartListProductService = async (req) => {
    try {
        const userId = new ObjectId(req.headers.user_id);
        /*----------------- DATABASE QUERY--------------------*/
        const matchStage = {$match:{userID: userId}};

        const JoinWithProductStage = {$lookup: {from: "products", localField: "productID", foreignField: "_id", as: "product"}};
        const UnwindProductStage = {$unwind: "$product"};

        const JoinWithBrandStage = {$lookup: {from: "brands", localField: "product.brandID", foreignField: "_id", as: "brand"}};
        const UnwindBrandStage = {$unwind: "$brand"};

        const JoinWithCategoryStage = {$lookup: {from: "categories", localField: "product.categoryID", foreignField: "_id", as: "Category"}};
        const UnwindCategoryStage = {$unwind: "$Category"};

        const projectionStage = {$project: {
            "product.createdAt": 0,
            "product.updatedAt": 0,
            "product.brandID": 0,
            "product.categoryID": 0,
            "brand.updatedAt": 0,
            "brand.createdAt": 0,
            "brand._id": 0,
            "Category._id": 0,
            "Category.createdAt": 0,
            "Category.updatedAt": 0,
        }}



        /*--------JOIN PRODUCT WITH WISH LIST MODEL AND SELECT DATA----------*/
        const data = await CartModel.aggregate([
            matchStage,
            JoinWithProductStage,
            UnwindProductStage,
            JoinWithBrandStage,
            UnwindBrandStage,
            JoinWithCategoryStage,
            UnwindCategoryStage,
            projectionStage
        ])


        /*----------RETURN DATA-----------*/
        return {status: "Success", data: data};


    }catch(e) {
        console.log(e);
        return {status: "Error", message: "Internal server error"}
    }
}
