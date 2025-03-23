import React from 'react';
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import ProductStore from '../../store/productStore';

const ProductImages = () => {
    const { productDetails } = ProductStore();
    const images = [
        {
            original:  productDetails[0]['ProductDetails']['img1'],
            thumbnail:   productDetails[0]['ProductDetails']['img1']
        }, 
        {
            original:  productDetails[0]['ProductDetails']['img2'],
            thumbnail:   productDetails[0]['ProductDetails']['img2']
        }, 
        {
            original:  productDetails[0]['ProductDetails']['img3'],
            thumbnail:   productDetails[0]['ProductDetails']['img3']
        }, 
        {
            original:  productDetails[0]['ProductDetails']['img4'],
            thumbnail:   productDetails[0]['ProductDetails']['img4']
        }, 
        {
            original:  productDetails[0]['ProductDetails']['img5'],
            thumbnail:   productDetails[0]['ProductDetails']['img5']
        }, 
        {
            original:  productDetails[0]['ProductDetails']['img6'],
            thumbnail:   productDetails[0]['ProductDetails']['img6']
        }, 
        {
            original:  productDetails[0]['ProductDetails']['img7'],
            thumbnail:   productDetails[0]['ProductDetails']['img7']
        }, 
        {
            original:  productDetails[0]['ProductDetails']['img8'],
            thumbnail:   productDetails[0]['ProductDetails']['img8']
        }, 
         
    ]
 

    return (
        < >
            <ImageGallery autoPlay={true} items={images} />
        </>
    );
};

export default ProductImages;