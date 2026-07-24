import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout.tsx';
import { PublicLayout } from '../layouts/PublicLayout.tsx';
import { AuthGuard } from '../../features/auth/components/AuthGuard.tsx';
import { LegacyOrderRedirect, LegacyProductRedirect, LegacySearchRedirect } from './LegacyRedirect.tsx';
import { LazyBoundary as Lazy } from '../../components/feedback/LazyBoundary.tsx';

const Home = lazy(() => import('../../pages/HomePage.tsx'));
const Catalog = lazy(() => import('../../pages/CatalogPage.tsx'));
const Product = lazy(() => import('../../pages/ProductDetailsPage.tsx'));
const Cart = lazy(() => import('../../pages/CartPage.tsx'));
const Wishlist = lazy(() => import('../../pages/WishlistPage.tsx'));
const Orders = lazy(() => import('../../pages/OrdersPage.tsx'));
const OrderDetails = lazy(() => import('../../pages/OrderDetailsPage.tsx'));
const Profile = lazy(() => import('../../pages/ProfilePage.tsx'));
const Payment = lazy(() => import('../../pages/PaymentPage.tsx'));
const Login = lazy(() => import('../../pages/LoginPage.tsx'));
const Otp = lazy(() => import('../../pages/OtpPage.tsx'));
const Information = lazy(() => import('../../pages/InformationPage.tsx'));
const NotFound = lazy(() => import('../../pages/NotFoundPage.tsx'));
const RouteError = lazy(() => import('../../pages/RouteErrorPage.tsx'));

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    errorElement: <Lazy><RouteError /></Lazy>,
    children: [
      { index: true, element: <Lazy><Home /></Lazy> },
      { path: 'products/:productId', element: <Lazy><Product /></Lazy> },
      { path: 'search', element: <Lazy><Catalog /></Lazy> },
      { path: 'brands/:brandId', element: <Lazy><Catalog mode="brand" /></Lazy> },
      { path: 'categories/:categoryId', element: <Lazy><Catalog mode="category" /></Lazy> },
      ...['about', 'support', 'contact', 'complaints', 'how-to-buy', 'faq', 'privacy', 'refund', 'terms'].map((path) => ({ path, element: <Lazy><Information /></Lazy> })),
      {
        element: <AuthGuard />,
        children: [
          { path: 'cart', element: <Lazy><Cart /></Lazy> },
          { path: 'account/profile', element: <Lazy><Profile /></Lazy> },
          { path: 'account/wishlist', element: <Lazy><Wishlist /></Lazy> },
          { path: 'account/orders', element: <Lazy><Orders /></Lazy> },
          { path: 'account/orders/:invoiceId', element: <Lazy><OrderDetails /></Lazy> },
          { path: 'payment/success', element: <Lazy><Payment /></Lazy> },
          { path: 'payment/cancel', element: <Lazy><Payment /></Lazy> },
        ],
      },
      { path: 'details/:id', element: <LegacyProductRedirect /> },
      { path: 'by-keyword/:keyword', element: <LegacySearchRedirect /> },
      { path: 'profile', element: <Navigate replace to="/account/profile" /> },
      { path: 'wish', element: <Navigate replace to="/account/wishlist" /> },
      { path: 'order', element: <LegacyOrderRedirect /> },
      { path: 'order/:invoiceId', element: <LegacyOrderRedirect /> },
      { path: 'complain', element: <Navigate replace to="/complaints" /> },
      { path: '*', element: <Lazy><NotFound /></Lazy> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <Lazy><Login /></Lazy> },
      { path: '/otp-verify', element: <Lazy><Otp /></Lazy> },
    ],
  },
]);
