import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const Home = lazy(() => import("./pages/Products/Home.jsx"));
const Wish = lazy(() => import("./pages/User/Wish.jsx"));
const Cart = lazy(() => import("./pages/User/Cart.jsx"));
const Profile = lazy(() => import("./pages/User/Profile.jsx"));
const ProductByBrand = lazy(() => import("./pages/Products/ProductByBrand.jsx"));
const ProductByCategory = lazy(() => import("./pages/Products/ProductByCategory.jsx"));
const ProductDetails = lazy(() => import("./pages/Products/ProductDetails.jsx"));
const ProductByKeyword = lazy(() => import("./pages/Products/ProductByKeyword.jsx")); 
const About = lazy(() => import("./pages/Legals/About.jsx")); 
const Complain = lazy(() => import("./pages/Legals/Complain.jsx")); 
const Contact = lazy(() => import("./pages/Legals/Contact.jsx")); 
const HotToBuy = lazy(() => import("./pages/Legals/HotToBuy.jsx")); 
const Privacy = lazy(() => import("./pages/Legals/Privacy.jsx")); 
const Refund = lazy(() => import("./pages/Legals/Refund.jsx")); 
const Terms = lazy(() => import("./pages/Legals/Terms.jsx")); 
const Login = lazy(() => import("./pages/User/Login.jsx")); 
const OTP = lazy(() => import("./pages/User/Otp.jsx")); 
const Payment = lazy(() => import("./pages/User/Payment.jsx")); 
  



 const App = () => {
  return (
    < >
      <BrowserRouter>
        <Suspense fallback={<div className='loader-container'><div className='loader'>Loading...</div></div>}>
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
            <Route path='/terms' element={<Terms/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/otp-verify' element={<OTP/>}/>
            <Route path='/payment/:payment_status/:trn_id' element={<Payment/>}/>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
 };
 
 export default App;