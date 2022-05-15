import React from 'react';
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
import Header from './components/navbar';
import { Box, Flex } from '@chakra-ui/react';

const noNavbar = [
  routes.login,
  routes.register,
  routes.forgotPassword,
  routes.resetPassword
]

const App = () => {

  const location = useLocation();

  const hasNavbar = (): boolean => {
    return !noNavbar.some(r => r === location.pathname)
  }

  return (
    <Flex direction={'column'} height={'100vh'} >
      {hasNavbar() && <Header />}
      <Box flex={1}>
      <Routes>
        <Route path={routes.home} element={<HomePage />} />
        <Route path={routes.login} element={<LoginPage />} />
        <Route path={routes.register} element={<RegisterPage />} />
        <Route path={routes.forgotPassword} element={<ForgotPasswordPage />} />
        <Route path={routes.resetPassword} element={<PasswordResetPage redirectPath={routes.login} />} />
        <Route path={routes.search} element={<SearchPage />} />
        <Route path={routes.map} element={<MapPage />} />
        <Route path={routes.account} element={<AccountPage />} />
        <Route path={routes.searchResults} element={<SearchResultsPage />} />
        <Route path={"*"} element={<h1>Page Not Found</h1>} />
      </Routes>
      </Box>
    </Flex>
  );
}

export default App;
