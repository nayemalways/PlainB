import React, { useState } from 'react';
import ProductImages from './ProductImages';
import ProductStore from '../../store/productStore';
import DetailsSkeleton from '../../skeleton/DetailsSkeleton';
import parser from 'html-react-parser';
import Reviews from './Reviews';
import CartButton from '../cart/CartButton';
import CartStore from '../../store/cartStore';
import toast from 'react-hot-toast';

const Details = () => {
    const { productDetails }= ProductStore();
    const [quantity, setQuantity] = useState(1);
    const {SaveCartRequest, cartForm, cartFormOnchange, CartListRequest} = CartStore();


    console.log(quantity);
    // Qty increment and decrement
    const incrementQty = () => {
        setQuantity(qty => qty + 1);
     }
    const decrementQty = () => {
        setQuantity(qty => qty - 1);
    }

    // Add to cart 
    const AddCart = async (productID) => {
        const res = await SaveCartRequest(cartForm, productID, quantity); // Api Call

        if(res === true) {
            toast.success("Item added to cart");
            await CartListRequest();
        }else {

            if(res === "carts validation failed") {
                for (const item in cartForm) {
                     if( cartForm[item].length === 0) {
                        toast.error(`Select ${item}`);
                     }
                }
                
            }else {
                toast.error(res);
            }

        }
    }
         
   
    // Showing Skeleton until the productDetails is null
    if(productDetails === null) {
       return <DetailsSkeleton/>
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
                                <h4>  {productDetails[0]['title']} </h4>
                                <p className="text-body-secondary my-1 fw-bold">Category:  {productDetails[0]['category']['categoryName']} </p>
                                <p className="text-body-secondary my-1 fw-bold">Brand: {productDetails[0]['brand']['brandName']}</p>
                                <p className="mb-2 fs-6 mt-1">{productDetails[0]['shortDes']}</p>
                                 {
                                    productDetails[0]['discount'] ? (
                                        <span className='fs-5'>
                                             Price: ৳ 
                                            <strike>{productDetails[0]?.price} </strike> 
                                            ৳{productDetails[0]?.discountPrice} 
                                        </span>
                                    ) : (
                                        <span>{productDetails[0]?.price}</span>
                                    )
                                 }
                                <div className="row">
                                    <div className="col-4 p-2">
                                        <label className="bodySmal">Size</label>
                                        <select 
                                            value={cartForm.size} 
                                            onChange={(e) => cartFormOnchange("size", e.target.value)} 
                                            className="form-control form-select my-2"
                                        >  
                                            <option value="">Size</option>
                                            {
                                                productDetails[0]['ProductDetails']['size'].split(',').map((size, i) => {
                                                    return <option key={i} value={size}> {size} </option>
                                                })
                                                 
                                            }
                                        </select>
                                    </div>
                                    <div className="col-4 p-2">
                                        <label className="bodySmal">Color</label>
                                        <select  
                                            value={cartForm.color} 
                                            onChange={(e) => cartFormOnchange("color", e.target.value)}
                                            className="form-control form-select my-2"
                                        >
                                            <option value="">Color</option>
                                            {
                                                productDetails[0]['ProductDetails']['color'].split(',').map((color, i) => {
                                                    return <option key={i} value={color}> {color} </option>
                                                })
                                                 
                                            }
                                        </select>
                                    </div>
                                    <div className="col-4 p-2">
                                        <label className="bodySmal">Quantity</label>
                                        <div className="input-group my-2">
                                            <button onClick={decrementQty} disabled={quantity <= 1} className="btn btn-outline-secondary">-</button>
                                            <input 
                                                value={quantity} 
                                                type="text" 
                                                className="form-control bg-light text-center" 
                                                readOnly 
                                            />
                                            <button onClick={incrementQty} className="btn btn-outline-secondary">+</button>
                                        </div>
                                    </div>
                                    <div className="col-4 p-2">
                                        <CartButton className="btn btn-success w-100" text="Add to Cart" onClick={async () => AddCart(productDetails[0]["_id"])} />
                                    </div>
                                    <div className="col-4 p-2">
                                        <button className="btn btn-success w-100">Add to Wish</button>
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
                                        aria-selected="true">
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
                                        aria-selected="false">
                                        Review
                                    </button>
                                </li>
                            </ul>
                            <div className="tab-content" id="myTabContent">
                                <div className="active fade show tab-pane" id="Speci-tab-pane" role="tabpanel" aria-labelledby="Speci-
                                    tab" tabIndex="0">
                                        {
                                            parser(productDetails[0]['ProductDetails']['des'])
                                        }
                                </div>
                                <div className="fade tab-pane" id="Review-tab-pane" role="tabpanel" aria-labelledby="Review-tab"
                                tabIndex="0">
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