/**
 * React Application Entry Point
 * 
 * This file initializes the React application by rendering the root component
 * into the DOM. It also includes global styles and wraps the app in StrictMode.
 */

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Initialize the React root and render the application
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
