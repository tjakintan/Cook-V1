import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation
} from 'react-router-dom';

import CookMainPage from './pages/cook_main_page.jsx';
import Feed from './pages/feed.jsx';
import Discover from './pages/discover.jsx';
import Upload from './pages/upload.jsx';
import More from './pages/more.jsx';
import Navbar from './components/navBar.jsx';

function useFiveSecondDelay() {
    const [ready, setReady] = useState(false);
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setReady(true);
      }, 3000); // 3 seconds
  
      return () => clearTimeout(timer);
    }, []);
  
    return ready;
}

export default function App() {
    const showCooKWaitPage = useFiveSecondDelay();
    if (!showCooKWaitPage) {
        return <CookMainPage />
    }
    else {
        return (
            <div className='appMainPage'>
                <Routes>
                    <Route path="/feed" element={<Feed />} />
                    <Route path="/discover" element={<Discover />} />
                    <Route path="/upload" element={<Upload />} />
                    <Route path="/more" element={<More />} />
                </Routes>
                <Navbar />
            </div>
        )
    }
}
