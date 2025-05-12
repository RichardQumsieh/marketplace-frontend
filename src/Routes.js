import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import AdminDeliveryRequests from './AdminDeliveryPersonnel';
import AdminOrders from './AdminOrders';
import AdminUsers from './AdminUsers';
import Signin from './Signin';
import Signup from './Signup';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import LayoutWrapper from './components/LayoutWrapper';
import ForgotPassword from './ForgotPassword';
import AdminAuthPage from './AdminsAuth';
import AddProduct from './AddProduct';
import EditProduct from './EditProduct';
import MarketPage from './Market';
import ViewProduct from './ViewProduct';
import CartPage from './CartPage';
import BuyerProfilePage from './BuyerProfile';
import AdminSettings from './AdminSettings';
import DeliverySignup from './DeliverySignup';
import Checkout from './Checkout';
import About from './About';
import BusinessPage from './BusinessPage';
import BrandProfile from './BrandProfile';
import PrivacyPolicy from './PrivacyPolicy';
import ProductsPage from './ProductsPage';
import OrdersHistory from './OrdersHistory';
import SellerSettings from './SellerSettings';
import SellerProducts from './SellerProducts';
import SellerDashboard from './SellerDashboard';
import SellerRefundIssues from './SellerRefundIssues';
import DeliveryDashboard from './DeliveryDashboard';

const App = () => {
  return (
    <LayoutWrapper>
      <Routes>
        
        <Route
          path="/sign-in"
          element={
            <PublicRoute redirectTo="/">
              <Signin />
            </PublicRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicRoute redirectTo="/">
              <Signup />
            </PublicRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <PublicRoute redirectTo="/">
              <ForgotPassword />
            </PublicRoute>
          }
        />

        <Route
          path="/admin-auth"
          element={
            <PublicRoute redirectTo="/">
              <AdminAuthPage />
            </PublicRoute>
          }
        />

        <Route
          path="/business"
          element={
            <BusinessPage />
          }
        />

        <Route
          path="/delivery/signup"
          element={
            <PublicRoute redirectTo="/">
              <DeliverySignup />
            </PublicRoute>
          }
        />

        <Route
          path="/delivery/profile"
          element={
            <ProtectedRoute allowedUserTypes={['Delivery']}>
              <DeliveryDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={
            <MarketPage />
          }
        />

        <Route
          path="/about"
          element={
            <About />
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute allowedUserTypes={['Buyer']}>
              <CartPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders-history"
          element={
            <ProtectedRoute allowedUserTypes={['Buyer']}>
              <OrdersHistory />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/checkout"
          element={
            <ProtectedRoute allowedUserTypes={['Buyer']}>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedUserTypes={['Buyer']}>
              <BuyerProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-control-panel/dashboard"
          element={
            <ProtectedRoute allowedUserTypes={['Admin', 'Seller']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-control-panel/orders"
          element={
            <ProtectedRoute allowedUserTypes={['Admin', 'Seller']}>
              <AdminOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seller-profile/Dashboard"
          element={
            <ProtectedRoute allowedUserTypes={['Seller']}>
              <SellerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seller-profile/Settings"
          element={
            <ProtectedRoute allowedUserTypes={['Seller']}>
              <SellerSettings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seller-profile/Products"
          element={
            <ProtectedRoute allowedUserTypes={['Seller']}>
              <SellerProducts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seller-profile/Product-Issues"
          element={
            <ProtectedRoute allowedUserTypes={['Seller']}>
              <SellerRefundIssues />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/:store_name"
          element={
            <BrandProfile />
          }
        />

        <Route
          path="/add-product"
          element={
              <AddProduct />
          }
        />

        <Route
          path="/admin-control-panel/users"
          element={
            <ProtectedRoute allowedUserTypes={['Admin']}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-control-panel/delivery-personnel"
          element={
            <ProtectedRoute allowedUserTypes={['Admin']}>
              <AdminDeliveryRequests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/product/:id"
          element = {
            <ViewProduct />
          }
        />

        <Route
          path="/products"
          element = {
            <ProductsPage />
          }
        />

        <Route
          path="/edit-product/:id"
          element={
            <ProtectedRoute allowedUserTypes={['Admin', 'Seller']}>
              <EditProduct />
            </ProtectedRoute>
          }
        />
  
        <Route
          path="/admin-control-panel/Settings"
          element={
            <ProtectedRoute allowedUserTypes={['Admin']}>
              <AdminSettings />
            </ProtectedRoute>
          }
        />

        <Route path="/privacy-policy" element={ <PrivacyPolicy /> } />

        <Route path="*" element={<Navigate to='/' />} />
      </Routes>
    </LayoutWrapper>
  );
};

export default App;