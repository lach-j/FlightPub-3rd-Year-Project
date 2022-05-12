import React from 'react';
import { LoginPage } from './pages/LoginPage';
import { Route, Routes } from 'react-router-dom';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { routes } from './constants/routes';
import { PasswordResetPage } from './pages/PasswordResetPage';
import { SearchPage } from './pages/SearchPage';
import { MapPage } from './pages/MapPage';
import { AccountPage } from './pages/AccountPage';
function App() {
  return (
    <Routes>
      <Route path={routes.login} element={<LoginPage />} />
      <Route path={routes.register} element={<RegisterPage />} />
      <Route path={routes.forgotPassword} element={<ForgotPasswordPage />} />
      <Route path={routes.resetPassword} element={<PasswordResetPage redirectPath={routes.login} />} />
      <Route path={routes.search} element={<SearchPage />} />
      <Route path={routes.map} element={<MapPage />} />
      <Route path={routes.account} element={<AccountPage />} />
       <Route path={"*"} element={<h1>Page Not Found</h1>} />
    </Routes>
  );
}

export default App;
