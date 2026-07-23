import { useEffect, type ComponentType } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import wishStore from '../../store/wishStore.ts';
import ProductsSkeleton from '../../skeleton/ProductsSkeleton.tsx';
import StarRatings from 'react-star-ratings';
import NoDataFound from '../product/NoDataFound.tsx';

const StarRating = StarRatings as unknown as ComponentType<{
  rating: number;
  starRatedColor?: string;
  starDimension?: string;
  starSpacing?: string;
}>;

const WishList = () => {
  const { WishListRequest, WishList, removeFromWish } = wishStore();

  useEffect(() => {
    (async () => {
      await WishListRequest();
    })();
  }, [WishListRequest]);

  // Remove from wishlist
  const removeProduct = async (productId: string) => {
    const res = await removeFromWish(productId);
    if (res?.success) {
      toast.success('Item removed!');
      await WishListRequest();
    } else {
      toast.error('Something went wrong');
    }
  };

  // console.log("Wish List: ",  WishList);

  if (WishList === null) {
    return <ProductsSkeleton />;
  } else if (WishList.length === 0) {
    return <NoDataFound />;
  } else {
    return (
      <>
        <div className="section container py-5 bg-white">
          <div className="row">
            <h4>My Wishlist:</h4>
            {WishList &&
              WishList.map((item, i) => {
                return (
                  <div key={i} className="col-md-3 p-2 col-lg-3 col-sm-6 col-12">
                    <div className="card shadow-sm h-100 rounded-3 bg-white">
                      <img className="w-100 rounded-top-2" src={item?.products['images'][0]} />
                      <div className="card-body">
                        <p className="bodySmall text-secondary">{item?.products['title']}</p>
                        <p className="fw-bold">
                          {' '}
                          Price:
                          {item.products['discount'] ? (
                            <>
                              <span>
                                <del> {item?.products['price']} </del>
                              </span>
                              <span>{item?.products['discountPrice']}</span>
                            </>
                          ) : (
                            <span>{item?.products['price']}</span>
                          )}
                        </p>
                        <StarRating
                          rating={parseFloat(item?.products['star'])}
                          starRatedColor="rgb(255, 153, 0)"
                          starDimension="15px"
                          starSpacing="2px"
                        />

                        <div className="d-flex gap-3 mt-2">
                          <Link
                            className="btn btn-outline-warning"
                            to={`/details/${item.products['_id']}`}
                          >
                            Details
                          </Link>
                          <button
                            onClick={() => removeProduct(item?.products['_id'])}
                            className="btn btn-danger"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </>
    );
  }
};

export default WishList;
