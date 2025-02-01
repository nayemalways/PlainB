import React from 'react';
import ProductStore from '../../store/productStore';
import ProductsSkeleton from './../../skeleton/ProductsSkeleton';

const Products = () => {

    const {ProductList} = ProductStore();
    
    if(ProductList === null) {
        return <ProductsSkeleton/>
    }
    
    return (
        <div>
            
        </div>
    );
};

export default Products;