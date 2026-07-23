import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import ProductStore from '../../store/productStore.ts';

interface IImageGallery {
  original: string,
  thumbnail: string
}

const ProductImages = () => {
  const { productDetails } = ProductStore();
  
  const images: IImageGallery[] = [];
  productDetails?.images.forEach((img: string) => {
    images.push({
      original: img,
      thumbnail: img
    })
  });

  return (
    <>
      <ImageGallery autoPlay={true} items={images} />
    </>
  );
};

export default ProductImages;
