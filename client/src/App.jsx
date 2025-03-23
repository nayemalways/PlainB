import React, { lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const Home = lazy(() => import("./pages/Home.jsx"));
const Wish = lazy(() => import("./pages/Wish.jsx"));
const Cart = lazy(() => import("./pages/Cart.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const ProductByBrand = lazy(() => import("./pages/ProductByBrand.jsx"));
const ProductByCategory = lazy(() => import("./pages/ProductByCategory.jsx"));
const ProductDetails = lazy(() => import("./pages/ProductDetails.jsx"));
const ProductByKeyword = lazy(() => import("./pages/ProductByKeyword.jsx")); 
const About = lazy(() => import("./pages/Legals/About.jsx")); 
const Complain = lazy(() => import("./pages/Legals/Complain.jsx")); 
const Contact = lazy(() => import("./pages/Legals/Contact.jsx")); 
const HotToBuy = lazy(() => import("./pages/Legals/HotToBuy.jsx")); 
const Privacy = lazy(() => import("./pages/Legals/Privacy.jsx")); 
const Refund = lazy(() => import("./pages/Legals/Refund.jsx")); 
  



 const App = () => {
  return (
    < >
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/wish' element={<Wish/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/brands/:brandId' element={<ProductByBrand/>}/>
          <Route path='/categories/:id' element={<ProductByCategory/>}/>
          <Route path='/details/:id' element={<ProductDetails/>}/>
          <Route path='/by-keyword/:keyword' element={<ProductByKeyword/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/complain' element={<Complain/>}/>
          <Route path='/contact' element={<Contact/>}/>
          <Route path='/how-to-buy' element={<HotToBuy/>}/>
          <Route path='/privacy' element={<Privacy/>}/>
          <Route path='/refund' element={<Refund/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
 };
 
 export default App;