import React from 'react';
import BrandsSkeleton from './../../skeleton/BrandsSkeleton';
import ProductStore from '../../store/productStore';
import { Link } from 'react-router-dom';

const Brand = () => {
    const {BrandList} = ProductStore();
    
     // Check has Data fetched ohterwise showing loading skeleton
    if(BrandList === null) {
        return <BrandsSkeleton/>
    }
    
    return (
        <>
            <div className="section">
                <div className="container">
                    <div className="row">
                        <h1 className="headline-4 text-center my-2 p-0">Top Brands</h1>
                        <span className="bodySmal mb-5 text-center">Explore a World of Choices Across Our Most Popular <br/>Shopping Categories </span>
                        
                            {
                                BrandList.map((item, index) => {
                                    return (
                                        <div key={index} title={item?.brandName} className="col-6 col-lg-8r text-center col-md-8r p-2">
                                            <Link  to="" className="card h-500 rounded-3 bg-white">
                                                <div className="card-body">
                                                    <img className="w-100" src={item?.brandImg}  />
                                                </div>
                                            </Link>
                                        </div>
                                    )
                                })
                            }
                            
                        
                    </div>
                </div>
            </div>
        </>
    );
};

export default Brand;