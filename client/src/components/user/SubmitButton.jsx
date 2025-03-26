import React from 'react';

const SubmitButton = ({submit, className, text, onClick}) => {
     if(submit === false) {
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