import { useState, useEffect } from 'react';
import {
  Routes,
  Route,
} from 'react-router-dom';

import Feed from './pages/feed.jsx';
import Discover from './pages/discover.jsx';
import Upload from './pages/upload.jsx';
import More from './pages/more.jsx';
import Navbar from './components/navBar.jsx';
import Home from './pages/home.jsx';
import Icons from './components/Icon.jsx';

export default function App() {

    return (
        <div className='appMainPage'>
            <Icons />
                <Routes>
                    <Route path="/" element={<Home />} />
                        <Route path="/feed" element={<Feed />} />
                            <Route path="/discover" element={<Discover />} />
                        <Route path="/upload" element={<Upload />} />
                    <Route path="/more" element={<More />} />
                </Routes>
            <Navbar />
        </div>
    )
    
}
