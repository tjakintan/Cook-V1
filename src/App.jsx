import {
  Routes,
  Route,
} from 'react-router-dom';
import { motion, useAnimationControls } from "framer-motion";
import React, { useEffect, useState, useRef } from "react";
import Feed from './pages/feed.jsx';
import Discover from './pages/discover.jsx';
import Upload from './pages/upload.jsx';
import Navbar from './components/navBar.jsx';
import Home from './pages/home.jsx';
import Auth from './pages/auth.jsx';
import { useUser } from './utils/user.jsx';
import { Navigate, Outlet } from "react-router-dom";
import Settings from './pages/setting.jsx'

function ProtectedRouteAppLayout() {
  const { user, loading } = useUser();

  if (loading) return null; 

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

function AppLayout() {
  const controls = useAnimationControls();
  const [showSettings, setShowSettings] = useState(false);
  const showSettingsRef = useRef(null);
  
  const handleSettingsToggle = () => {
    setShowSettings(prev => {
      controls.start({ y: prev ? 0 : "0vh" });
      return !prev;
    });
  };

  return (
    <>

      <Navbar  swipeControls={controls} showSettingsRef={showSettingsRef} />

        <motion.div
          animate={controls}
          initial={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={` flex flex-col h-screen overflow-auto scrollbar-hide`}
        >
          <motion.div
            initial={{ height: 0 }}
            transition={{ duration: 0.1, ease: "easeInOut" }}
            className="z-60 md:z-50"
          >
            <div className="relative">
              {showSettings && (
                <div className="fixed inset-0 z-10 backdrop-blur-lg bg-white/10" onClick={() => setShowSettings(false)}/>
              )}

              <motion.div className="relative z-20">
                <Settings isOpen={showSettings} toggleOpen={handleSettingsToggle}/>
              </motion.div>
            </div>
          </motion.div>
          <div className={``}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/upload" element={<Upload />} />
            </Routes>
          </div>
        </motion.div>

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
