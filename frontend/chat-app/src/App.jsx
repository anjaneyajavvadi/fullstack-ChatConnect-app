import React, { useEffect } from 'react';
import NavBar from './Components/NavBar';
import { Loader } from 'lucide-react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import SignUpPage from './Pages/SignUpPage';
import LoginPage from './Pages/LoginPage';
import ProfilePage from './Pages/ProfilePage';
import SettingsPage from './Pages/SettingsPage';
import useAuthStore from './store/useAuthStore';
import { Toaster } from 'react-hot-toast';
import useThemeStore from './store/useThemeStore';

const App = () => {
  const { authUser, checkAuth, isCheckingAuth,onlineUsers } = useAuthStore();
  const {theme}=useThemeStore()
  useEffect(() => {
    checkAuth(); // ✅ Ensure authentication check runs on mount
  }, []);

  // ✅ Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      <NavBar />
      <Routes>
        {/* ✅ Redirect to login if user is not authenticated */}
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path='/settings' element={authUser ? <SettingsPage /> : <Navigate to="/login" />} />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />

        {/* ✅ Catch all invalid routes */}
        <Route path='*' element={<Navigate to="/" />} />
      </Routes>
      <Toaster position='top-center' />
    </div>
  );
};

export default App;
