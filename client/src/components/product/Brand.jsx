import React from 'react';
import BrandsSkeleton from './../../skeleton/BrandsSkeleton';
import ProductStore from '../../store/productStore';

const Brand = () => {
    const {BrandList} = ProductStore();
    
    if(BrandList === null) {
        return <BrandsSkeleton/>
    }
    
    return (
        <div>
            
        </div>
    );
};

export default Brand;