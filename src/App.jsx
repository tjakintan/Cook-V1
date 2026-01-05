import { useState, useEffect } from 'react';
import {
  Routes,
  Route,
} from 'react-router-dom';

import Feed from './pages/feed.jsx';
import Discover from './pages/discover.jsx';
import Upload from './pages/upload.jsx';
import Navbar from './components/navBar.jsx';
import Home from './pages/home.jsx';
import Auth from './pages/auth.jsx';
import { useUser } from './utils/user.jsx';
import { Navigate, Outlet } from "react-router-dom";


function ProtectedRoute() {
  const { user, loading } = useUser();

  if (loading) return null; 

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

function AppLayout() {
  
  return (
    <>

      <Navbar />

      <Routes>

        <Route path="/" element={<Home />} />

        <Route element={<ProtectedRoute />}>

          <Route path="/feed" element={<Feed />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/upload" element={<Upload />} />

        </Route>

      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Routes>

      <Route path="/auth" element={<Auth />} />
      <Route path="/*" element={<AppLayout />} />
      
    </Routes>
  );
}
