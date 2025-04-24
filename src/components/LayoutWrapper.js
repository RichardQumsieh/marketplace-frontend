import { useLocation } from 'react-router-dom';
import Layout from './Layout';
import MainLayout from './MainLayout';

const NO_LAYOUT_ROUTES = ['/', '/sign-in', '/signup', '/forgot-password', '/admin-auth', '/add-product', '/business', '/seller-profile'];
const MAIN_LAYOUT_PREFIXES = ['/product/', '/cart', '/checkout', '/profile', '/privacy', '/products'];

const LayoutWrapper = ({ children }) => {
  const { pathname } = useLocation();
  
  if (NO_LAYOUT_ROUTES.includes(pathname) || pathname.startsWith('/delivery') || pathname.startsWith('/edit-product')) {
    return children;
  }

  if (MAIN_LAYOUT_PREFIXES.some(prefix => pathname.startsWith(prefix)) || pathname === '/about') {
    return <MainLayout>{children}</MainLayout>;
  }

  return <Layout>{children}</Layout>;
};

export default LayoutWrapper;