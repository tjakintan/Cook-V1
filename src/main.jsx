import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { UserProvider } from './utils/user.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';


createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="1084481734574-lagcn11aadccseqb743vug4tf4d06hau.apps.googleusercontent.com">
    <StrictMode>
      <BrowserRouter>
        <UserProvider>
          <App />
        </UserProvider>
      </BrowserRouter>
    </StrictMode>
  </GoogleOAuthProvider>

)