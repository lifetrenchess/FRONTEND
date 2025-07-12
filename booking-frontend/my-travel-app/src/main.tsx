// src/main.tsx (after installing react-router-dom)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx'; // Or './pages/BookingPage.tsx' if you moved it
import './index.css';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter> {/* Wrap App with BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);