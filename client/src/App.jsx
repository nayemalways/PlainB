 import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Wish from './pages/Wish';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import ProductByBrand from './pages/ProductByBrand';
import ProductByCategory from './pages/ProductByCategory';
 
 const App = () => {
  return (
    < >
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/wish' element={<Wish/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/brands/:id' element={<ProductByBrand/>}/>
          <Route path='/categories/:id' element={<ProductByCategory/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
 };
 
 export default App;