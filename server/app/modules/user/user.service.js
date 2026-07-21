import ProfilesModel from "./user.model.js";

const saveUserProfile  = async (req) => {
        const user_id = req.headers['user_id'];
        const reqBody = req.body;
 
         /*----SET USER ID IN THE PROFILE-----*/
        reqBody.userID =  user_id;

        /*-------CREATE OR UPDATE USER INFO WHETHER ALREADY USER CREATED OR NOT--------*/
        await ProfilesModel.updateOne({userID: user_id}, {$set:reqBody}, {upsert: true});
        return {status: "Success", message: "Profile save success"};
}




export const userServices = {
     saveUserProfile
}