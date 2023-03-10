import React, { useEffect, useState } from 'react';
import {
  AccountPage,
  BookingPage,
  ForgotPasswordPage,
  HomePage,
  LoginPage,
  MapPage,
  PasswordResetPage,
  RegisterPage,
  SearchPage,
  SearchResultsPage,
} from './pages';
import { Route, Routes, useLocation } from 'react-router-dom';
import { routes } from './constants/routes';
import Header from './components/Header';
import { Box, Flex } from '@chakra-ui/react';
import { Flight } from './models';

const noNavbar = [
  routes.login,
  routes.register,
  routes.forgotPassword,
  routes.resetPassword,
];

const App = () => {

  const location = useLocation();

  const cartState = useState<Flight[]>([]);

  const [cart, setCart] = cartState;

  const hasNavbar = (): boolean => {
    return !noNavbar.some(r => r === location.pathname);
  };

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart)
      setCart(JSON.parse(savedCart));
  }, []);


  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  return (
    <Flex direction='column' height='100vh'>
      {hasNavbar() && <Header cartState={cartState} />}
      <Box position='relative' height='100%'>
        <Routes>
          <Route path={routes.default} element={<HomePage cartState={cartState} />} />
          <Route path={routes.home} element={<HomePage cartState={cartState} />} />
          <Route path={routes.login} element={<LoginPage redirectPath={routes.search} />} />
          <Route path={routes.register} element={<RegisterPage />} />
          <Route path={routes.forgotPassword} element={<ForgotPasswordPage redirectPath={routes.login} />} />
          <Route path={routes.resetPassword} element={<PasswordResetPage redirectPath={routes.login} />} />
          <Route path={routes.search} element={<SearchPage />} />
          <Route path={routes.map} element={<MapPage />} />
          <Route path={routes.account} element={<AccountPage />} />
          <Route path={routes.searchResults} element={<SearchResultsPage cartState={cartState} />} />
          <Route path={routes.booking} element={<BookingPage cartState={cartState} />} />
          <Route path='*' element={<h1>Page Not Found</h1>} />
        </Routes>
      </Box>
    </Flex>
  );
};

export default App;
