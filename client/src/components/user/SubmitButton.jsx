import React from 'react';
import UserStore from '../../store/userStore';

const SubmitButton = ({ className, text, onClick}) => {
     const {isSubmitForm} = UserStore();
    
    if(isSubmitForm === false) {
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

export default SubmitButton;