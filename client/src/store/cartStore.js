import { create } from 'zustand';
import axios from 'axios';
import { unauthorized } from '../utility/utility';

const CartStore = create((set) => ({
    isCartSubmit : false,
    cartForm: {productID: "", color: "", qty: "", size: ""},
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
            postbody.productID = productID;
            let res = await axios.post(`/api/SaveProductToCart`, postbody);
            return res.data["status"] === "Success";
        }catch(e) {
            unauthorized(e.response.status);
        }finally {
            set({isCartSubmit : false});
        }
    },


    CartList: null,
    CartCount: 0,
    CartListRequest: async () => {
        try {
            let res = await axios.get(`/api/SelectCartListProduct`);
            set({ CartList: res.data["data"]});
            set({CartCount: res.data['data'].length});
        }catch(e) {
            unauthorized(e.response.status);
        }
    }

}));

export default CartStore;
