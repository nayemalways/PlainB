import React from 'react';
import CartStore from '../../store/cartStore';

const CartButton = ({onClick, className, text}) => {
    let { isCartSubmit } = CartStore();

    if(isCartSubmit === false) {
        return <button onClick={onClick} className={className} > {text} </button>
    }else {
        return (
            <button disabled={false} onClick={onClick} className={className} > 
                <div className='spinner-border spinner-border-sm me-1' role='status'></div>
                Processing...
            </button>
        )
     }
};

export default CartButton;