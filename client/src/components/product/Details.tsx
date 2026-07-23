import React, { useEffect, useState } from 'react';
import ProductImages from './ProductImages.tsx';
import ProductStore from '../../store/productStore.ts';
import DetailsSkeleton from '../../skeleton/DetailsSkeleton.tsx';
import parser from 'html-react-parser';
import Reviews from './Reviews.tsx';
import CartButton from '../cart/CartButton.tsx';
import CartStore from '../../store/cartStore.ts';
import WishStore from '../../store/wishStore.ts';
import toast from 'react-hot-toast';
import NoDataFound from './NoDataFound.tsx';

const Details = () => {
  const { productDetails } = ProductStore();
  const [quantity, setQuantity] = useState(1);
  const { saveToCart, cartForm, cartFormOnchange, CartListRequest, isCartSubmit } = CartStore();
  const { saveToWishlist, isWishSubmit, WishListRequest } = WishStore();
  const { BrandListRequest } = ProductStore();

  useEffect(() => {
    void (async () => {
      await BrandListRequest();
    })();
  }, [BrandListRequest]);

  // Qty increment and decrement
  const incrementQty = () => {
    setQuantity((qty) => qty + 1);
  };
  const decrementQty = () => {
    setQuantity((qty) => qty - 1);
  };

  // Add to cart list
  const AddCart = async (productId: string) => {
    if (cartForm.color.length === 0) {
      toast.error('Select color');
      return;
    }
    if (cartForm.size.length === 0) {
      toast.error('Select size');
      return;
    }

    await saveToCart(cartForm, productId, quantity); // Api Call
    await CartListRequest();
  };

  // Add to wishlist
  const AddWish = async (productID: string) => {
    const res = await saveToWishlist(productID); // Api Call

    if (res?.success) {
      toast.success(res.message);
      await WishListRequest();
    } else {
      toast.error('Something went wrong');
    }
  };

  // Showing Skeleton until the productDetails is null
  if (productDetails === null) {
    return <DetailsSkeleton />;
  } else if (productDetails.length === 0) {
    return (
      <div className="vh-100 w-100">
        <NoDataFound />
      </div>
    );
  } else {
    return (
      <>
        <div>
          <div className="container mt-2">
            <div className="row">
              <div className="col-md-7 p-3">
                <ProductImages />
              </div>
              <div className="col-md-5 p-3">
                <h4> {productDetails['title']} </h4>
                <p className="text-body-secondary my-1 fw-bold">
                  Category: {productDetails['category']['categoryName']}{' '}
                </p>
                <p className="text-body-secondary my-1 fw-bold">
                  Brand: {productDetails['brand']['brandName']}
                </p>
                <p className="mb-2 fs-6 mt-1">{productDetails['shortDes']}</p>
                {productDetails['discount'] ? (
                  <span className="fs-5">
                    Price: ৳<del>{productDetails?.price} </del>৳{productDetails?.discountPrice}
                  </span>
                ) : (
                  <span>{productDetails?.price}</span>
                )}
                <div className="row">
                  <div className="col-4 p-2">
                    <label className="bodySmall">Size</label>
                    <select
                      value={cartForm?.size}
                      onChange={(e) => cartFormOnchange('size', e.target.value)}
                      className="form-control form-select my-2"
                    >
                      <option value="">Size</option>
                      {productDetails['size'].split(',').map((size: string, i: number) => {
                        return (
                          <option key={i} value={size}>
                            {' '}
                            {size}{' '}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="col-4 p-2">
                    <label className="bodySmall">Color</label>
                    <select
                      value={cartForm.color}
                      onChange={(e) => cartFormOnchange('color', e.target.value)}
                      className="form-control form-select my-2"
                    >
                      <option value="">Color</option>
                      {productDetails['color'].split(',').map((color: string, i: number) => {
                        return (
                          <option key={i} value={color}>
                            {' '}
                            {color}{' '}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="col-4 p-2">
                    <label className="bodySmall">Quantity</label>
                    <div className="input-group w-100 my-2">
                      <button
                        onClick={decrementQty}
                        disabled={quantity <= 1}
                        className="btn btn-outline-secondary"
                      >
                        -
                      </button>
                      <input
                        value={quantity}
                        type="text"
                        className="form-control bg-light text-center"
                        readOnly
                      />
                      <button onClick={incrementQty} className="btn btn-outline-secondary">
                        +
                      </button>
                    </div>
                  </div>
                  <div className="col-4 p-2">
                    <CartButton
                      isSubmit={isCartSubmit}
                      className="btn btn-success w-100"
                      text="Add to Cart"
                      onClick={async () => AddCart(productDetails['_id'])}
                    />
                  </div>
                  <div className="col-4 p-2">
                    <CartButton
                      isSubmit={isWishSubmit}
                      className="btn btn-success w-100"
                      text="Add to Wish"
                      onClick={async () => AddWish(productDetails['_id'])}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link active"
                    id="Speci-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#Speci-tab-pane"
                    type="button"
                    role="tab"
                    aria-controls="Speci-tab-pane"
                    aria-selected="true"
                  >
                    Specifications
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="Review-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#Review-tab-pane"
                    type="button"
                    role="tab"
                    aria-controls="Review-tab-pane"
                    aria-selected="false"
                  >
                    Review
                  </button>
                </li>
              </ul>
              <div className="tab-content" id="myTabContent">
                <div
                  className="active fade show tab-pane"
                  id="Speci-tab-pane"
                  role="tabpanel"
                  aria-labelledby="Speci-
                                    tab"
                  tabIndex={0}
                >
                  {parser(productDetails['des'])}
                </div>
                <div
                  className="fade tab-pane"
                  id="Review-tab-pane"
                  role="tabpanel"
                  aria-labelledby="Review-tab"
                  tabIndex={0}
                >
                  <ul className="list-group list-group-flush">
                    <Reviews />
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default Details;
