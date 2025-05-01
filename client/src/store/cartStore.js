import { create } from 'zustand';
import axios from 'axios';
import { unauthorized } from '../utility/utility';
import  Cookies  from 'js-cookie';

const CartStore = create((set) => ({
    isCartSubmit : false,
    cartForm: {productID: "", color: "", qty: 1, size: ""},
    cartFormOnchange: (name, value) => {
        set(state => ({
            cartForm: {
                ...state.cartForm,
                [name] : value
            }
           }))
    },

    // Add to Cart Request
    SaveCartRequest: async (postbody, productID) => {
        try {
            set({isCartSubmit : true});
            postbody.productID = productID; // added product id into postbody
            let config = { headers: { token: Cookies.get('token')}}; // Ensure user logged in
            let res = await axios.post(`/api/SaveProductToCart`, postbody, config); // Api call
            return res.data["status"] === "Success";
        }catch(e) {
            unauthorized(e.response.status);
            console.log(e.toString());
        }finally {
            set({isCartSubmit : false});
        }
    },


    CartList: null,
    CartCount: 0,
    CartListRequest: async () => {
        try {
            let config = { headers: { token: Cookies.get('token')}}; // Ensure user logged in
            let res = await axios.get(`/api/SelectCartListProduct`, config);
            set({ CartList: res.data["data"]});
            set({CartCount: res.data['data'].length});
        }catch(e) {
            unauthorized(e.response.status);
            console.log(e.toString());
        }
    }

}));

export default CartStore;
