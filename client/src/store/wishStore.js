import { create } from 'zustand';
import axios from 'axios';
import { BaseServerUrl, unauthorized } from '../utility/utility';
import  Cookies  from 'js-cookie';

const wishStore = create((set) => ({

    isWishSubmit : false,
    // Add to Cart Request
    SaveWishRequest: async (productID) => {
        try {
            set({isWishSubmit : true});
            let config = { headers: { token: Cookies.get('token')}}; // Ensure user logged in
            let res = await axios.post(`${BaseServerUrl}/api/SaveWishList`,  {productID}, config); // Api call
            return res.data["status"] === "Success" ? true : res.data["message"];
        }catch(e) {
            // unauthorized(e.response.status);
            console.log(e.toString());
        }finally {
            set({isWishSubmit : false});
        }
    },


    WishList: null,
    WishCount: 0,
    WishListRequest: async () => {
        try {
            let config = { headers: { token: Cookies.get('token')}}; // Ensure user logged in
            let res = await axios.get(`${BaseServerUrl}/api/ReadWishListProducts`, config);

            set({ WishList: res.data["data"]});
            set({ WishCount: res.data['data'].length});
            return;
        }catch(e) {
            unauthorized(e.response.status);
            console.log(e.toString());
        } 
    },


    removeFromWish: async (productID) => {
        try {
            let config = { headers: { token: Cookies.get('token')}}; // Ensure user logged in
            let postBody = {productID};
            let res = await axios.post(`${BaseServerUrl}/api/RemoveWishList`, postBody, config);
            return res.data["status"] === "Success" ? true : res.data["message"];
        }catch(e) {
            unauthorized(e.response.status);
            console.log(e.toString());
        }
    } 
    

}));

export default wishStore;
