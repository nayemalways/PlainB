import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const Home = lazy(() => import('./pages/Products/Home.tsx'));
const Wish = lazy(() => import('./pages/User/Wish.tsx'));
const Cart = lazy(() => import('./pages/User/Cart.tsx'));
const Profile = lazy(() => import('./pages/User/Profile.tsx'));
const ProductByBrand = lazy(() => import('./pages/Products/ProductByBrand.tsx'));
const ProductByCategory = lazy(() => import('./pages/Products/ProductByCategory.tsx'));
const ProductDetails = lazy(() => import('./pages/Products/ProductDetails.tsx'));
const ProductByKeyword = lazy(() => import('./pages/Products/ProductByKeyword.tsx'));
const About = lazy(() => import('./pages/Legals/About.tsx'));
const Complain = lazy(() => import('./pages/Legals/Complain.tsx'));
const Contact = lazy(() => import('./pages/Legals/Contact.tsx'));
const HotToBuy = lazy(() => import('./pages/Legals/HotToBuy.tsx'));
const Privacy = lazy(() => import('./pages/Legals/Privacy.tsx'));
const Refund = lazy(() => import('./pages/Legals/Refund.tsx'));
const Terms = lazy(() => import('./pages/Legals/Terms.tsx'));
const Login = lazy(() => import('./pages/User/Login.tsx'));
const OTP = lazy(() => import('./pages/User/Otp.tsx'));
const Payment = lazy(() => import('./pages/User/Payment.tsx'));
const Order = lazy(() => import('./pages/User/Order.tsx'));
const OrderDetails = lazy(() => import('./pages/User/OrderDetails.tsx'));

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="loader-container">
              <div className="loader">Loading...</div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/wish" element={<Wish />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/brands/:brandId" element={<ProductByBrand />} />
            <Route path="/categories/:id" element={<ProductByCategory />} />
            <Route path="/details/:id" element={<ProductDetails />} />
            <Route path="/by-keyword/:keyword" element={<ProductByKeyword />} />
            <Route path="/about" element={<About />} />
            <Route path="/complain" element={<Complain />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/how-to-buy" element={<HotToBuy />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/refund" element={<Refund />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/login" element={<Login />} />
            <Route path="/otp-verify" element={<OTP />} />
            <Route path="/payment/:payment_status/:trn_id" element={<Payment />} />
            <Route path="/order" element={<Order />} />
            <Route path="/order/:invoiceId/:payment_status" element={<OrderDetails />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
};

export default App;
