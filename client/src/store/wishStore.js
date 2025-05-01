import { create } from 'zustand';
import axios from 'axios';
import { unauthorized } from '../utility/utility';
import  Cookies  from 'js-cookie';

const CartStore = create((set) => ({

    isWishSubmit : false,
    // Add to Cart Request
    SaveWishRequest: async (productID) => {
        try {
            set({isWishSubmit : true});
            let config = { headers: { token: Cookies.get('token')}}; // Ensure user logged in
            let res = await axios.post(`/api/SaveWishList`,  {productID}, config); // Api call

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
            let res = await axios.get(`/api/ReadWishListProducts`, config);

            set({ WishList: res.data["data"]});
            set({ WishCount: res.data['data'].length});
            return;
        }catch(e) {
            unauthorized(e.response.status);
            console.log(e.toString());
        }
    },


    

}));

export default CartStore;
