import { useLocation } from 'react-router-dom';
import MainLayout from './MainLayout';

// const NO_LAYOUT_ROUTES = ['/', '/sign-in', '/signup', '/forgot-password', '/admin-auth', '/add-product'];
const MAIN_LAYOUT_PREFIXES = ['/product/', '/cart', '/checkout', '/profile', '/products', '/orders-history'];

const LayoutWrapper = ({ children }) => {
  const { pathname } = useLocation();
  
  if (MAIN_LAYOUT_PREFIXES.some(prefix => pathname.startsWith(prefix))) {
    return <MainLayout>{children}</MainLayout>;
  } else {
    return children;
  }
  
  // if (NO_LAYOUT_ROUTES.includes(pathname) || pathname.startsWith('/delivery') || pathname.startsWith('/edit-product') || pathname.startsWith('/seller-profile') || pathname.startsWith('/admin-control-panel')) {
  //   return children;
  // }
};

export default LayoutWrapper;