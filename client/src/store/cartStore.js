import { create } from 'zustand';
import axios from 'axios';
import { unauthorized } from '../utility/utility';
import  Cookies  from 'js-cookie';

const CartStore = create((set) => ({
    isCartSubmit : false,
    cartForm: {productID: "", color: "", size: ""},
    cartFormOnchange: (name, value) => {
        set(state => ({
            cartForm: {
                ...state.cartForm,
                [name] : value
            }
           }))
    },

    // Add to Cart Request
    SaveCartRequest: async (postbody, productID, quantity) => {
        try {
            set({isCartSubmit : true});
            postbody.productID = productID; // added product id into postbody
            postbody.qty = quantity;
            let config = { headers: { token: Cookies.get('token')}}; // Ensure user logged in
            let res = await axios.post(`https://plainb.onrender.com/api/SaveProductToCart`, postbody, config); // Api call

            return res.data["status"] === "Success" ? true : res.data["message"];
        }catch(e) {
            unauthorized(e.response.status);
            console.log(e.toString());
        }finally {
            set({isCartSubmit : false});
        }
    },


    CartList: null,
    CartCount: 0,
    CartTotal: 0,
    CartVatTotal: 0,
    CartPayable: 0,
    CartListRequest: async () => {
        try {
            let config = { headers: { token: Cookies.get('token')}}; // Ensure user logged in
            let res = await axios.get(`/api/SelectCartListProduct`, config);

            set({ CartList: res.data["data"]});
            set({CartCount: res.data['data'].length});

            // Calculating
            let total = 0;
            let vat = 0;
            let payable = 0;

            res?.data["data"].forEach((item) => {
                if(item["product"]["discount"] === false) {
                    total += parseFloat(item?.product["price"]) * parseFloat(item["qty"]);
                }else {
                    total += parseFloat(item?.product["discountPrice"]) * parseFloat(item["qty"]);
                }
            });

            vat = total * 0.05;
            payable = vat + total;
            set({CartTotal: total});
            set({CartVatTotal: vat});
            set({CartPayable: payable});

            return;
        }catch(e) {
            unauthorized(e.response.status);
            console.log(e.toString());
        }
    },


    // Product remove from cartlist
    removeCartProduct: async (productID) => {
        try {
            console.log(productID);
            let config = { headers: { token: Cookies.get('token')}}; // Ensure user logged in
            let postBody = {productID};
            let res = await axios.post(`/api/RemoveProductFromCart`, postBody, config);
            return res.data["status"] === "Success" ? true : res.data["message"];
        }catch(e) {
            unauthorized(e.response.status);
            console.log(e.toString());
        }
    },

    // Checkout to payment page 
    isChekout: false,
    createInvoice: async () => {
        try {
            set({isChekout: true});
            let config = { headers: { token: Cookies.get('token')}}; // Ensure user logged in
            let res = await axios.get(`/api/CreateInvoice`, config);
            set({isChekout: true});
            window.location.href = res["data"]["data"]["GatewayPageURL"];
         }catch(e) {
            // unauthorized(e.response.status);
            console.log(e.toString());
         }
    }


    

}));

export default CartStore;
