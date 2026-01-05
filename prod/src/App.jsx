import { useState } from 'react';
import './App.css'

function App() {

  return (
<div className="w-screen h-screen flex flex-col items-center justify-center bg-white text-black">
  <img 
    src="/gomeal.png"
    alt="goMeal logo"
    className="w-20 h-20 mb-6" 
  />
  <p className="text-sm font-normal tracking-wider text-center">
    We are currently working on goMeal
  </p>
</div>

  )
}

export default App
