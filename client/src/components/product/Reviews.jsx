import React from 'react';
import ProductStore from '../../store/productStore';
import StarRatings from 'react-star-ratings/build/star-ratings.js'

const Reviews = () => {
    const { reviewList }= ProductStore();

    return (
        <>
            <ul className='list-group list-group-flush list-unstyled'>
                {
                    reviewList !== null ? (
                         reviewList.map((item, i) => {
                            return <li key={i} className='mt-4 list-group-item bg-transparent'>
                                <h6 className='text-primary d-flex gap-2'>
                                    <i className="bi bi-person text-black"></i>
                                    {item?.profile?.cus_name}
                                </h6>
                                 <StarRatings 
                                    rating={parseFloat(item['rating'])} 
                                    starRatedColor='rgb(255, 153, 0)' 
                                    starDimension="15px" 
                                    starSpacing="2px" 
                                 />
                                <p className='text-secondary'> {item?.des} </p>
                            </li>
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