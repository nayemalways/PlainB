import FeaturesModel from "../models/InvoiceAndPayment/FeaturesModel.js";
import LegalModel from "../models/ProductModel/LegalDetailsModel.js";

// Features
export const FeaturesListService = async () => {
    try {

        const data = await FeaturesModel.find();
        return {status: "Success", data: data};
        
    }catch(e) {
        console.log(e);
        return {status: "Error", message: "Internal server error..!"};
    }
}

// Legal Details
export const LegalDetailsService = async (req) => {
    try {
        const type  = req.params.type;
        const data = await LegalModel.find( {type: type} );
        return {status: "Success", data: data};
        
    }catch(e) {
        console.log(e.toString());
        return {status: "Error", message: "Internal server error..!"};
    }
}