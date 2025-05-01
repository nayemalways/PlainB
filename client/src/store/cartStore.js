import { create } from 'zustand';
import axios from 'axios';

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
    }

}));

export default CartStore;
