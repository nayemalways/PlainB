import React from 'react';
import ReviewStore from '../../store/reviewStore.ts';
import StarRatings from 'react-star-ratings';

const Reviews = () => {
  const { reviewList } = ReviewStore();

  return (
    <>
      <ul className="list-group list-group-flush list-unstyled">
        {reviewList !== null ? (
          reviewList.map((item) => {
            return (
              <li key={item._id} className="mt-4 list-group-item bg-transparent">
                <h6 className="text-primary d-flex gap-2 m-0 p-0">
                  <i className="bi bi-person text-black"></i>
                  {item?.profile?.cus_name}
                </h6>
                <StarRatings
                  rating={Number(item.rating)}
                  starRatedColor="rgb(255, 153, 0)"
                  starDimension="15px"
                  starSpacing="2px"
                />
                <p className="text-secondary"> {item?.des} </p>
              </li>
            );
          })
        ) : (
          <span></span>
        )}
      </ul>
    </>
  );
};

export default Reviews;
