import React from 'react';
import ProductStore from '../../store/productStore';


const Reviews = () => {
    const { reviewList }= ProductStore();

    return (
        <>
            <ul>
                {
                    reviewList !== null ? (
                         reviewList.map((item, i) => {
                            return <div key={i} className='mt-4'>
                                <h6 className='text-success'>{item?.profile?.cus_name}</h6>
                                <p className='text-secondary'> {item?.des} </p>
                            </div>
                         })
                    ): (
                        <span></span>
                    )
                }
            </ul>
        </>
    );
};

export default Reviews;